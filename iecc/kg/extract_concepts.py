"""
Extract theological/pastoral concepts from sermon chunks using Ollama.

Strategy: Option A — one LLM call per chunk (sub-split chunks > 500 est. tokens).
Outputs:  sermon_concepts.json  (per-sermon concepts + per-chunk raw extractions)
Cache:    .concept_cache.json   (keyed by text hash for instant resume)

Usage:
    python extract_concepts.py              # run all sermons
    python extract_concepts.py --resume     # skip sermons already in output
    python extract_concepts.py --dry-run    # show plan without calling LLM
"""

import argparse
import hashlib
import json
import re
import sys
import time
import unicodedata
import urllib.request
from pathlib import Path

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "granite4.1:3b"

KG_DIR = Path(__file__).resolve().parent
CHUNKS_FILE = KG_DIR / "sermon_chunks.json"
OUTPUT_FILE = KG_DIR / "sermon_concepts.json"
CACHE_FILE = KG_DIR / ".concept_cache.json"

SYSTEM_PROMPT = (
    "You extract concise theological and pastoral concepts from sermon text. "
    "Output ONLY a pipe-separated list of 2–6 word noun phrases. "
    "No commentary, no numbering, no bullets. Example output:\n"
    "redemption of creation | Spirit's intercession | hope in suffering"
)

SUB_SPLIT_THRESHOLD = 500   # est. tokens — split chunks larger than this
SUB_SPLIT_TARGET = 350      # target size for sub-pieces
MAX_RETRIES = 3
RETRY_DELAY = 2.0


# ── Ollama client ──────────────────────────────────────────────

def call_ollama(user_msg: str) -> str:
    payload = json.dumps({
        "model": MODEL,
        "stream": False,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
        "options": {"temperature": 0.3, "num_predict": 256},
    }).encode()
    req = urllib.request.Request(
        OLLAMA_URL, data=payload,
        headers={"Content-Type": "application/json"},
    )
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                body = json.loads(resp.read())
            return body["message"]["content"].strip()
        except Exception as e:
            if attempt == MAX_RETRIES:
                raise
            print(f"    retry {attempt}/{MAX_RETRIES} after error: {e}")
            time.sleep(RETRY_DELAY * attempt)
    return ""


# ── Parsing ────────────────────────────────────────────────────

def parse_concepts(raw: str) -> list[str]:
    concepts = []
    for line in raw.split("\n"):
        for part in line.split("|"):
            c = part.strip().strip("-•*").strip()
            c = re.sub(r"^\d+[.)]\s*", "", c)
            if 2 < len(c) < 80:
                concepts.append(c)
    return concepts


def normalize_concept(c: str) -> str:
    c = unicodedata.normalize("NFKC", c)
    c = c.lower().strip()
    c = re.sub(r"['']+s$", "", c)        # remove trailing possessive 's
    c = re.sub(r"\s+", " ", c)
    return c


def make_prompt(text: str) -> str:
    return (
        "Extract 5–12 key theological/pastoral concepts from this sermon segment.\n\n"
        f"--- SEGMENT ---\n{text[:1800]}\n--- END ---\n\n"
        "Output ONLY a pipe-separated list of noun phrases."
    )


# ── Sub-splitting ──────────────────────────────────────────────

def estimate_tokens(text: str) -> int:
    return int(len(text.split()) * 1.3)


def sub_split(text: str) -> list[str]:
    """Split text into ~SUB_SPLIT_TARGET-token pieces at sentence boundaries."""
    sentences = re.split(r'(?<=[.!?])\s+', text)
    pieces = []
    buf = []
    buf_tok = 0
    for sent in sentences:
        stok = estimate_tokens(sent)
        if buf and buf_tok + stok > SUB_SPLIT_TARGET:
            pieces.append(" ".join(buf))
            buf = []
            buf_tok = 0
        buf.append(sent)
        buf_tok += stok
    if buf:
        pieces.append(" ".join(buf))
    return pieces


# ── Cache ──────────────────────────────────────────────────────

def text_hash(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()[:16]


def load_cache() -> dict:
    if CACHE_FILE.exists():
        with open(CACHE_FILE) as f:
            return json.load(f)
    return {}


def save_cache(cache: dict):
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, ensure_ascii=False)


# ── Main pipeline ─────────────────────────────────────────────

def process_chunk(chunk: dict, cache: dict) -> list[str]:
    """Extract concepts from one chunk, using cache and sub-splitting."""
    text = chunk["text"]
    tok = chunk["token_est"]
    all_concepts = []

    pieces = sub_split(text) if tok > SUB_SPLIT_THRESHOLD else [text]

    for piece in pieces:
        h = text_hash(piece)
        if h in cache:
            all_concepts.extend(cache[h])
            continue

        prompt = make_prompt(piece)
        raw = call_ollama(prompt)
        concepts = parse_concepts(raw)
        cache[h] = concepts
        all_concepts.extend(concepts)

    return all_concepts


def process_sermon(sermon: dict, cache: dict, dry_run: bool = False) -> dict:
    chunks = sermon["chunks"]
    chunk_results = []
    all_raw = []
    calls_made = 0
    cache_hits = 0

    for chunk in chunks:
        pieces = sub_split(chunk["text"]) if chunk["token_est"] > SUB_SPLIT_THRESHOLD else [chunk["text"]]
        n_pieces = len(pieces)
        cached = sum(1 for p in pieces if text_hash(p) in cache)

        if dry_run:
            chunk_results.append({
                "chunk_index": chunk["chunk_index"],
                "heading": chunk["heading"],
                "pieces": n_pieces,
                "cached": cached,
            })
            cache_hits += cached
            calls_made += n_pieces - cached
            continue

        concepts = process_chunk(chunk, cache)
        calls_made += sum(1 for p in pieces if text_hash(p) not in cache)
        cache_hits += sum(1 for p in pieces if text_hash(p) in cache)

        chunk_results.append({
            "chunk_index": chunk["chunk_index"],
            "section_id": chunk["section_id"],
            "heading": chunk["heading"],
            "raw_concepts": concepts,
        })
        all_raw.extend(concepts)

    # Dedupe per sermon
    freq = {}
    for c in all_raw:
        norm = normalize_concept(c)
        if norm not in freq:
            freq[norm] = {"canonical": c, "count": 0}
        freq[norm]["count"] += 1

    concepts_deduped = sorted(freq.keys())

    return {
        "id": sermon["id"],
        "date": sermon["date"],
        "title": sermon["title"],
        "series": sermon.get("series", ""),
        "tags": sermon.get("tags", []),
        "chunk_count": len(chunks),
        "llm_calls": calls_made,
        "cache_hits": cache_hits,
        "raw_concept_count": len(all_raw),
        "deduped_concept_count": len(concepts_deduped),
        "concepts": [
            {"concept": freq[n]["canonical"], "normalized": n, "count": freq[n]["count"]}
            for n in concepts_deduped
        ],
        "chunks": chunk_results if not dry_run else [],
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--resume", action="store_true", help="Skip sermons already in output")
    parser.add_argument("--dry-run", action="store_true", help="Show plan without calling LLM")
    parser.add_argument("--sermon", type=str, help="Process only this sermon id (filename)")
    args = parser.parse_args()

    with open(CHUNKS_FILE) as f:
        corpus = json.load(f)

    sermons = corpus["sermons"]
    if args.sermon:
        sermons = [s for s in sermons if args.sermon in s["id"]]
        if not sermons:
            print(f"No sermon matching '{args.sermon}'")
            sys.exit(1)

    # Load existing output for resume
    done_ids = set()
    existing = []
    if args.resume and OUTPUT_FILE.exists():
        with open(OUTPUT_FILE) as f:
            prev = json.load(f)
        existing = prev.get("sermons", [])
        done_ids = {s["id"] for s in existing}
        print(f"Resume: {len(done_ids)} sermons already done")

    cache = load_cache()
    print(f"Cache: {len(cache)} entries loaded", flush=True)

    # Connectivity check
    if not args.dry_run:
        print("Warming up model...", end=" ", flush=True)
        try:
            call_ollama("Say 'ready'.")
            print("OK", flush=True)
        except Exception as e:
            print(f"\nFATAL: Cannot reach Ollama at {OLLAMA_URL}: {e}", flush=True)
            sys.exit(1)

    if args.dry_run:
        total_calls = 0
        total_cached = 0
        for s in sermons:
            if s["id"] in done_ids:
                continue
            result = process_sermon(s, cache, dry_run=True)
            calls = result["llm_calls"]
            hits = result["cache_hits"]
            total_calls += calls
            total_cached += hits
            print(f"  {s['id'][:55]:55s} | {result['chunk_count']:3d} chunks | {calls:3d} calls | {hits:3d} cached")
        print(f"\nTotal new LLM calls needed: {total_calls}")
        print(f"Already cached:             {total_cached}")
        print(f"Est. time @ 0.6s/call:      {total_calls * 0.6:.0f}s ({total_calls * 0.6 / 60:.1f}min)")
        return

    results = list(existing)
    t_start = time.time()
    total_calls = 0

    for i, sermon in enumerate(sermons):
        if sermon["id"] in done_ids:
            continue

        t0 = time.time()
        result = process_sermon(sermon, cache)
        elapsed = time.time() - t0
        total_calls += result["llm_calls"]
        results.append(result)

        print(
            f"[{i+1:3d}/{len(sermons)}] {sermon['id'][:50]:50s} "
            f"| {elapsed:5.1f}s | {result['llm_calls']:3d} calls "
            f"| {result['deduped_concept_count']:3d} concepts",
            flush=True,
        )

        # Save cache after every sermon (cheap insurance)
        save_cache(cache)

        # Save output after every sermon (resumable)
        output = {
            "generated": "extract_concepts.py",
            "model": MODEL,
            "sermon_count": len(results),
            "total_concepts": sum(r["deduped_concept_count"] for r in results),
            "sermons": results,
        }
        with open(OUTPUT_FILE, "w") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)

    wall = time.time() - t_start
    print(f"\nDone. {len(results)} sermons, {total_calls} LLM calls, {wall:.1f}s")
    print(f"Output: {OUTPUT_FILE}")
    print(f"Cache:  {CACHE_FILE} ({len(cache)} entries)")


if __name__ == "__main__":
    main()
