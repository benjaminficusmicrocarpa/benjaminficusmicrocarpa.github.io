"""
Step C: Normalize and canonicalize extracted sermon concepts.

Layer 1 — String rules (mechanical, no LLM):
  - Strip emoji, NFKC, lowercase, collapse whitespace
  - Normalize possessive variants (god's / god's → god's)
  - Merge word-order permutations (e.g. "groaning creation" → "creation groaning")
  - Merge trivial morphological variants (possessive-stripped duplicates)

Layer 2 — Embedding similarity (Ollama granite4.1:3b):
  - Embed all surviving unique concepts
  - Cluster by cosine similarity ≥ threshold
  - Pick canonical label = most-frequent variant in cluster
  - Keep all raw forms as aliases

Output: normalized_concepts.json
  {concept_map: {raw → canonical}, clusters: [...], stats: {...}}

Usage:
    python normalize_concepts.py                   # run both layers
    python normalize_concepts.py --layer1-only     # string rules only (no LLM)
    python normalize_concepts.py --threshold 0.88  # adjust similarity threshold
"""

import argparse
import json
import re
import sys
import time
import unicodedata
import urllib.request
from collections import defaultdict
from pathlib import Path

import numpy as np

KG_DIR = Path(__file__).resolve().parent
CONCEPTS_FILE = KG_DIR / "sermon_concepts.json"
OUTPUT_FILE = KG_DIR / "normalized_concepts.json"

OLLAMA_URL = "http://localhost:11434/api/embed"
EMBED_MODEL = "granite4.1:3b"
EMBED_BATCH = 64
DEFAULT_THRESHOLD = 0.88


# ── Layer 1: String rules ─────────────────────────────────────

EMOJI_RE = re.compile(
    "["
    "\U0001F300-\U0001FAFF"  # misc symbols, emoticons, etc.
    "\U00002702-\U000027B0"
    "\U0000FE00-\U0000FE0F"
    "\U0000200D"
    "]+",
    flags=re.UNICODE,
)

POSSESSIVE_CURLY = re.compile(r"\u2019s?\b")  # right single quote ('s or ')
POSSESSIVE_STRAIGHT = re.compile(r"'s?\b")


def clean_concept(raw: str) -> str:
    """Apply all Layer 1 string transformations."""
    c = unicodedata.normalize("NFKC", raw)
    c = EMOJI_RE.sub("", c)
    # Normalize curly apostrophe to straight
    c = c.replace("\u2019", "'")
    c = c.replace("\u2018", "'")
    c = c.lower().strip()
    c = re.sub(r"\s+", " ", c)
    # Strip leading/trailing punctuation
    c = c.strip(".,;:!?\"()[]{}«»—–-_*#")
    c = c.strip()
    return c


SCRIPTURE_RE = re.compile(
    r"^(genesis|exodus|leviticus|numbers|deuteronomy|joshua|judges|ruth|"
    r"samuel|kings|chronicles|ezra|nehemiah|esther|job|psalm|proverbs|"
    r"ecclesiastes|isaiah|jeremiah|lamentations|ezekiel|daniel|hosea|joel|"
    r"amos|obadiah|jonah|micah|nahum|habakkuk|zephaniah|haggai|zechariah|"
    r"malachi|matthew|mark|luke|john|acts|romans|corinthians|galatians|"
    r"ephesians|philippians|colossians|thessalonians|timothy|titus|philemon|"
    r"hebrews|james|peter|revelation)\b",
    re.IGNORECASE,
)


def canonical_key(concept: str) -> str:
    """
    Generate a sort-invariant key for detecting word-order permutations.
    E.g. "groaning creation" and "creation groaning" → same key.
    Scripture references are kept verbatim (never reorder).
    """
    # Don't reorder scripture references — they contain verse numbers that matter
    stripped = re.sub(r"^\d+\s*", "", concept)
    if SCRIPTURE_RE.match(stripped):
        return concept
    words = sorted(re.findall(r"[a-z']+", concept))
    return " ".join(words)


def layer1_normalize(all_concepts: dict[str, dict]) -> dict[str, str]:
    """
    Apply string rules. Returns mapping: raw_normalized → layer1_canonical.
    """
    # Step 1: clean all concepts
    cleaned = {}
    for raw in all_concepts:
        c = clean_concept(raw)
        if len(c) > 2:
            cleaned[raw] = c

    # Step 2: group by canonical_key to merge word-order permutations
    key_groups = defaultdict(list)
    for raw, c in cleaned.items():
        k = canonical_key(c)
        key_groups[k].append((raw, c))

    # Step 3: for each group, pick canonical = most frequent (by sermon count)
    raw_to_canonical = {}
    for key, members in key_groups.items():
        # Pick the member with highest sermon coverage as canonical
        best = max(members, key=lambda m: all_concepts[m[0]]["sermons"])
        canonical = best[1]
        for raw, c in members:
            raw_to_canonical[raw] = canonical

    # Step 4: also merge possessive variants
    # "god's presence" and "gods presence" → "god's presence"
    stripped = defaultdict(list)
    for canonical in set(raw_to_canonical.values()):
        no_poss = canonical.replace("'s ", " ").replace("' ", " ")
        stripped[no_poss].append(canonical)

    for no_poss, variants in stripped.items():
        if len(variants) > 1:
            # Keep the one with the apostrophe
            with_apost = [v for v in variants if "'" in v]
            best = with_apost[0] if with_apost else variants[0]
            for raw, canon in list(raw_to_canonical.items()):
                if canon in variants:
                    raw_to_canonical[raw] = best

    return raw_to_canonical


# ── Layer 2: Embedding similarity ─────────────────────────────

def embed_batch(texts: list[str]) -> list[list[float]]:
    """Call Ollama embed API with a batch of texts."""
    payload = json.dumps({"model": EMBED_MODEL, "input": texts}).encode()
    req = urllib.request.Request(
        OLLAMA_URL, data=payload,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        body = json.loads(resp.read())
    return body["embeddings"]


def embed_all(concepts: list[str]) -> list[list[float]]:
    """Embed all concepts in batches."""
    all_embs = []
    for i in range(0, len(concepts), EMBED_BATCH):
        batch = concepts[i:i + EMBED_BATCH]
        embs = embed_batch(batch)
        all_embs.extend(embs)
        if (i // EMBED_BATCH) % 10 == 0:
            print(f"  Embedded {len(all_embs)}/{len(concepts)}...", flush=True)
    return all_embs


def cluster_by_similarity(
    concepts: list[str],
    embeddings: list[list[float]],
    threshold: float,
    concept_freq: dict[str, int],
) -> list[list[str]]:
    """
    Greedy centroid clustering using numpy for fast cosine similarity.
    High-frequency concepts become centroids first; others attach if sim ≥ threshold.
    """
    n = len(concepts)
    emb = np.array(embeddings, dtype=np.float32)
    # L2-normalize for dot-product = cosine similarity
    norms = np.linalg.norm(emb, axis=1, keepdims=True)
    norms = np.where(norms == 0, 1, norms)
    emb = emb / norms

    assigned = np.full(n, -1, dtype=np.int32)
    cluster_centroids = []  # indices of centroid rows
    clusters = []           # each = list of indices

    order = sorted(range(n), key=lambda i: concept_freq.get(concepts[i], 0), reverse=True)

    for idx in order:
        if assigned[idx] >= 0:
            continue

        if cluster_centroids:
            centroid_embs = emb[cluster_centroids]       # (k, dim)
            sims = centroid_embs @ emb[idx]              # (k,) dot products
            best_ci = int(np.argmax(sims))
            best_sim = float(sims[best_ci])
        else:
            best_sim = 0.0
            best_ci = -1

        if best_sim >= threshold and best_ci >= 0:
            clusters[best_ci].append(idx)
            assigned[idx] = best_ci
        else:
            assigned[idx] = len(clusters)
            cluster_centroids.append(idx)
            clusters.append([idx])

    return [[concepts[i] for i in cluster] for cluster in clusters]


def pick_canonical_from_cluster(
    cluster: list[str],
    concept_freq: dict[str, int],
) -> str:
    """Pick canonical = highest frequency, then shortest, then alphabetical."""
    return max(
        cluster,
        key=lambda c: (concept_freq.get(c, 0), -len(c)),
    )


# ── Main ──────────────────────────────────────────────────────

def load_concepts() -> dict[str, dict]:
    """Load all unique concepts with sermon frequency."""
    with open(CONCEPTS_FILE) as f:
        data = json.load(f)

    all_concepts = {}
    for s in data["sermons"]:
        for c in s["concepts"]:
            n = c["normalized"]
            if n not in all_concepts:
                all_concepts[n] = {"canonical_raw": c["concept"], "sermons": 0, "total": 0}
            all_concepts[n]["sermons"] += 1
            all_concepts[n]["total"] += c["count"]

    return all_concepts


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--layer1-only", action="store_true")
    parser.add_argument("--threshold", type=float, default=DEFAULT_THRESHOLD)
    args = parser.parse_args()

    all_concepts = load_concepts()
    print(f"Loaded {len(all_concepts)} unique normalized concepts", flush=True)

    # ── Layer 1 ──
    print("\n=== LAYER 1: String rules ===", flush=True)
    raw_to_l1 = layer1_normalize(all_concepts)

    l1_uniques = set(raw_to_l1.values())
    merges_l1 = len(all_concepts) - len(l1_uniques)
    dropped = len(all_concepts) - len(raw_to_l1)
    print(f"  Cleaned:  {len(raw_to_l1)} (dropped {dropped} too-short)")
    print(f"  Merged:   {merges_l1} duplicates")
    print(f"  Unique:   {len(l1_uniques)}", flush=True)

    if args.layer1_only:
        concept_freq = {}
        for raw, canon in raw_to_l1.items():
            if canon not in concept_freq:
                concept_freq[canon] = 0
            concept_freq[canon] += all_concepts[raw]["sermons"]

        output = {
            "generated": "normalize_concepts.py",
            "layers": ["string_rules"],
            "input_concepts": len(all_concepts),
            "output_concepts": len(l1_uniques),
            "concept_map": raw_to_l1,
            "clusters": [],
        }
        with open(OUTPUT_FILE, "w") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        print(f"\nWrote {OUTPUT_FILE}")
        return

    # ── Layer 2 ──
    print(f"\n=== LAYER 2: Embedding similarity (threshold={args.threshold}) ===", flush=True)

    # Build frequency for L1-canonical concepts
    concept_freq = defaultdict(int)
    for raw, canon in raw_to_l1.items():
        concept_freq[canon] += all_concepts[raw]["sermons"]

    # Single-word concepts are too short for reliable cosine similarity — skip them
    l1_multi = sorted(c for c in l1_uniques if " " in c)
    l1_single = sorted(c for c in l1_uniques if " " not in c)
    print(f"  Multi-word concepts to embed: {len(l1_multi)}")
    print(f"  Single-word concepts (skipped): {len(l1_single)}", flush=True)

    l1_list = l1_multi
    print(f"  Embedding {len(l1_list)} concepts...", flush=True)

    t0 = time.time()
    embeddings = embed_all(l1_list)
    embed_time = time.time() - t0
    print(f"  Embedded in {embed_time:.1f}s", flush=True)

    print(f"  Clustering...", flush=True)
    t0 = time.time()
    clusters = cluster_by_similarity(l1_list, embeddings, args.threshold, concept_freq)
    cluster_time = time.time() - t0

    multi_clusters = [c for c in clusters if len(c) > 1]
    singletons = [c for c in clusters if len(c) == 1]

    print(f"  Clustered in {cluster_time:.1f}s")
    print(f"  Clusters with merges: {len(multi_clusters)}")
    print(f"  Singletons: {len(singletons)}")
    print(f"  Final unique concepts: {len(clusters)}", flush=True)

    # Build final mapping: raw → final canonical
    l1_to_final = {}
    cluster_output = []
    for cluster in clusters:
        canonical = pick_canonical_from_cluster(cluster, concept_freq)
        for member in cluster:
            l1_to_final[member] = canonical
        if len(cluster) > 1:
            cluster_output.append({
                "canonical": canonical,
                "members": sorted(cluster),
                "size": len(cluster),
            })

    # Single-word concepts map to themselves
    for c in l1_single:
        l1_to_final[c] = c

    # Compose: raw → l1 → final
    raw_to_final = {}
    for raw, l1_canon in raw_to_l1.items():
        raw_to_final[raw] = l1_to_final.get(l1_canon, l1_canon)

    final_uniques = set(raw_to_final.values())

    # Show top merged clusters
    cluster_output.sort(key=lambda c: c["size"], reverse=True)
    print(f"\n  Top 20 merged clusters:", flush=True)
    for cl in cluster_output[:20]:
        print(f"    [{cl['size']}] {cl['canonical']}")
        for m in cl["members"]:
            if m != cl["canonical"]:
                print(f"         ← {m}")

    # ── Output ──
    output = {
        "generated": "normalize_concepts.py",
        "layers": ["string_rules", "embedding_similarity"],
        "embed_model": EMBED_MODEL,
        "similarity_threshold": args.threshold,
        "input_concepts": len(all_concepts),
        "after_layer1": len(l1_uniques),
        "output_concepts": len(final_uniques),
        "merged_clusters": len(multi_clusters),
        "concept_map": raw_to_final,
        "clusters": cluster_output,
    }

    with open(OUTPUT_FILE, "w") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n=== SUMMARY ===")
    print(f"  Input:    {len(all_concepts)} raw concepts")
    print(f"  Layer 1:  → {len(l1_uniques)} (string rules)")
    print(f"  Layer 2:  → {len(final_uniques)} (embedding clusters)")
    print(f"  Reduction: {len(all_concepts) - len(final_uniques)} concepts merged ({100*(len(all_concepts)-len(final_uniques))/len(all_concepts):.1f}%)")
    print(f"  Output:   {OUTPUT_FILE}", flush=True)


if __name__ == "__main__":
    main()
