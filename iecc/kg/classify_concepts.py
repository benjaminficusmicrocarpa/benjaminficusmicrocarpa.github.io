"""
Classify canonical concepts into a fixed theological taxonomy.

Two tiers run in order:
  Tier 1 — Deterministic heuristics (scripture regex + keyword lists)
  Tier 2 — Ollama LLM chat (batched, cached) for the remainder

Reads:   normalized_concepts.json   (canonical concept strings)
Writes:  concept_categories.json    (canonical → category mapping)
Cache:   .concept_category_cache.json

Usage:
    python classify_concepts.py                    # both tiers
    python classify_concepts.py --heuristics-only  # skip LLM
    python classify_concepts.py --llm-only         # skip heuristics
    python classify_concepts.py --dry-run          # preview counts
    python classify_concepts.py --model granite4.1:3b
    python classify_concepts.py --batch-size 20
"""

import argparse
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

KG_DIR = Path(__file__).resolve().parent
NORM_FILE = KG_DIR / "normalized_concepts.json"
OUTPUT_FILE = KG_DIR / "concept_categories.json"
CACHE_FILE = KG_DIR / ".concept_category_cache.json"

OLLAMA_URL = "http://localhost:11434/api/chat"
DEFAULT_MODEL = "granite4.1:3b"
DEFAULT_BATCH = 20
MAX_RETRIES = 3
RETRY_DELAY = 2.0

# ── Taxonomy ───────────────────────────────────────────────────
#
# god_christ_spirit    – Nature, attributes, persons of the Trinity
# sin_salvation        – Fall, sin, atonement, redemption, justification, grace
# church_mission       – Ecclesiology, community, evangelism, outreach, discipleship
# cultural_engagement  – Society, justice, politics, culture, worldview interaction
# spiritual_practices  – Prayer, worship, fasting, spiritual disciplines
# biblical_narrative   – Scripture references, biblical events, stories, characters
# other                – Anything that doesn't clearly fit above

CATEGORIES = [
    "god_christ_spirit",
    "sin_salvation",
    "church_mission",
    "cultural_engagement",
    "spiritual_practices",
    "biblical_narrative",
    "other",
]

CATEGORY_SET = set(CATEGORIES)

# ── Tier 1: Heuristics ────────────────────────────────────────

SCRIPTURE_RE = re.compile(
    r"^(?:\d+\s*)?"
    r"(genesis|exodus|leviticus|numbers|deuteronomy|joshua|judges|ruth|"
    r"samuel|kings|chronicles|ezra|nehemiah|esther|job|psalms?|proverbs|"
    r"ecclesiastes|isaiah|jeremiah|lamentations|ezekiel|daniel|hosea|joel|"
    r"amos|obadiah|jonah|micah|nahum|habakkuk|zephaniah|haggai|zechariah|"
    r"malachi|matthew|mark|luke|john|acts|romans|corinthians|galatians|"
    r"ephesians|philippians|colossians|thessalonians|timothy|titus|philemon|"
    r"hebrews|james|peter|revelation)\b",
    re.IGNORECASE,
)

BIBLICAL_CHARACTERS_RE = re.compile(
    r"\b(abraham|isaac|jacob|moses|david|solomon|elijah|elisha|"
    r"noah|joseph|daniel|ruth|esther|paul|peter|jonah|"
    r"mary|martha|lazarus|samson|gideon|joshua|nehemiah|"
    r"adam|eve|cain|abel|pharaoh|goliath|saul)\b",
    re.IGNORECASE,
)

KEYWORD_RULES: list[tuple[str, list[str]]] = [
    ("god_christ_spirit", [
        r"\btrinity\b", r"\btriune\b", r"\bgodhead\b",
        r"\bholy spirit\b", r"\bspirit'?s?\b(?!ual)",
        r"\bgod'?s?\b(?!.*(image|purpose|plan|design|kingdom|love|grace|mercy|"
        r"justice|faithfulness|sovereignty|glory|presence|word|promise|call|"
        r"provision|protection|peace|joy|comfort|healing|power|wisdom|wrath|"
        r"judgment|discipline|holiness|righteousness|truth|will|law|command|"
        r"covenant|blessing))",
        r"\bjesus\b", r"\bchrist\b(?!'s (redemption|atonement|sacrifice|blood|cross))",
        r"\bimago dei\b", r"\bimage of god\b", r"\bdivine nature\b",
        r"\bdivine attributes?\b", r"\bomnipoten", r"\bomniscien", r"\bomnipres",
        r"\bsovereign\b", r"\bsovereignty\b",
        r"\bincarnation\b", r"\bascension\b", r"\bresurrection of (?:christ|jesus)\b",
        r"\bcreator\b",
    ]),
    ("sin_salvation", [
        r"\bsin\b", r"\bsins\b", r"\bsinful\b", r"\bsinner\b",
        r"\bsalvation\b", r"\bredemption\b", r"\bredeemed?\b",
        r"\batonement\b", r"\bjustification\b", r"\bjustified\b",
        r"\brepentance\b", r"\brepent\b",
        r"\bforgiveness\b", r"\bforgiven\b", r"\bforgiving\b",
        r"\bgrace\b", r"\bmercy\b",
        r"\bcross\b", r"\bcrucifi",
        r"\bblood sacrifice\b", r"\bliving sacrifice\b",
        r"\bretribution\b", r"\bwrath\b",
        r"\bfall of man\b", r"\boriginal sin\b", r"\bfallenness\b",
        r"\bgospel\b", r"\bgood news\b",
        r"\bborn again\b", r"\bnew birth\b",
        r"\breturn to god\b", r"\breconcili",
        r"\bdying to\b", r"\bdeath to self\b",
    ]),
    ("spiritual_practices", [
        r"\bprayer\b", r"\bpray\b", r"\bpraying\b",
        r"\bworship\b", r"\bworshipp?ing\b",
        r"\bfasting\b", r"\bfast\b(?!er)",
        r"\bmeditat", r"\bcontemplat",
        r"\bbaptism\b", r"\bbaptiz",
        r"\bcommunion\b", r"\beucharist\b", r"\blord'?s supper\b",
        r"\bsabbath\b", r"\brest\b(?!or)",
        r"\bspiritual discipline\b", r"\bspiritual growth\b",
        r"\bspiritual formation\b", r"\bspiritual practice\b",
        r"\bdevotional?\b", r"\bquiet time\b",
        r"\babiding\b", r"\babide\b",
        r"\bthanksgiving\b", r"\bgratitude\b",
        r"\btithe\b", r"\btithing\b", r"\bgiving\b",
        r"\bconfession\b",
    ]),
    ("church_mission", [
        r"\bchurch\b", r"\bcongregation\b", r"\beccles",
        r"\bmission\b", r"\bmissionary\b", r"\bmissions\b",
        r"\bevangelism\b", r"\bevangeliz", r"\bevangelical\b",
        r"\bdiscipleship\b", r"\bdisciple\b", r"\bdiscipling\b",
        r"\bcommunity\b", r"\bfellowship\b", r"\bkoinonia\b",
        r"\bbody of christ\b", r"\bunity\b(?!.*(body|soul))",
        r"\bserving\b", r"\bservice\b", r"\bvolunteer\b",
        r"\bleadership\b", r"\bpastor\b", r"\belder\b", r"\bdeacon\b",
        r"\boutreach\b", r"\bministry\b",
        r"\bplanting\b(?!.*(garden|seed))",
        r"\bsmall group\b", r"\blife group\b",
        r"\bmentorship?\b", r"\bmentor\b",
        r"\bkingdom (?:of god|work|building)\b",
    ]),
    ("cultural_engagement", [
        r"\bcultur", r"\bsociet", r"\bsocial\b",
        r"\bjustice\b", r"\binjustice\b",
        r"\bpolitic", r"\bgovernment\b",
        r"\bworldview\b", r"\bworld view\b",
        r"\bsecular", r"\bhumanism\b", r"\batheis",
        r"\bideolog", r"\bmarxis", r"\brelativis",
        r"\bpoverty\b", r"\boppression\b", r"\boppress",
        r"\bracis", r"\bprejudice\b", r"\bdiscrimination\b",
        r"\benvironment\b", r"\bclimate\b", r"\bcreation care\b",
        r"\bimmigra", r"\brefugee\b",
        r"\bwork.?life\b", r"\bvocation\b",
        r"\beconom", r"\bwealth\b", r"\bmaterial",
        r"\bmedia\b", r"\btechnolog",
        r"\bsexualit", r"\bgender\b", r"\bmarriage\b(?!.*(supper|lamb))",
        r"\bpost.?modern", r"\bdeconstructi",
        r"\banimism\b", r"\bidolatry\b",
    ]),
    ("biblical_narrative", [
        r"\bparable\b", r"\bparables\b",
        r"\bcovenant\b",
        r"\bexodus\b", r"\bexile\b",
        r"\bpromised land\b", r"\bwilderness\b",
        r"\bcreation\b(?!.*(care|mandate))", r"\bflood\b",
        r"\bsermone? on the mount\b",
        r"\bbeautitudes?\b", r"\bbeatitudes?\b",
        r"\bpentecost\b",
        r"\btransfiguration\b",
        r"\blast supper\b",
        r"\bgarden of eden\b", r"\beden\b",
        r"\btower of babel\b",
        r"\bburning bush\b",
        r"\bred sea\b",
        r"\bten commandments\b", r"\bdecalogue\b",
        r"\bprophecy\b", r"\bprophetic\b",
        r"\bapocalyptic\b", r"\beschatolog",
    ]),
]

COMPILED_RULES: list[tuple[str, list[re.Pattern]]] = [
    (cat, [re.compile(p, re.IGNORECASE) for p in patterns])
    for cat, patterns in KEYWORD_RULES
]


def heuristic_classify(concept: str) -> tuple[str | None, str | None]:
    """Return (category, rule_id) or (None, None) if no heuristic matches."""
    stripped = re.sub(r"^\d+\s*", "", concept)
    if SCRIPTURE_RE.match(stripped):
        return "biblical_narrative", "scripture_re"

    if BIBLICAL_CHARACTERS_RE.search(concept):
        return "biblical_narrative", "biblical_characters"

    for cat, patterns in COMPILED_RULES:
        for pat in patterns:
            if pat.search(concept):
                return cat, f"keyword:{pat.pattern}"

    return None, None


# ── Tier 2: LLM ───────────────────────────────────────────────

TAXONOMY_CSV = ", ".join(CATEGORIES)

LLM_SYSTEM = (
    "You classify theological/pastoral concepts into exactly one category.\n"
    f"Allowed categories: {TAXONOMY_CSV}\n\n"
    "Category definitions:\n"
    "- god_christ_spirit: Trinity, divine nature, attributes, persons of God\n"
    "- sin_salvation: Sin, fall, atonement, redemption, justification, grace, gospel\n"
    "- church_mission: Church life, community, evangelism, discipleship, outreach\n"
    "- cultural_engagement: Society, justice, culture, worldview, politics\n"
    "- spiritual_practices: Prayer, worship, fasting, spiritual disciplines\n"
    "- biblical_narrative: Scripture references, biblical events, stories, characters\n"
    "- other: Anything that doesn't clearly fit above\n\n"
    'Respond with ONLY a JSON array: [{"concept":"...","category":"..."}]\n'
    "No commentary, no markdown fences."
)


def load_cache() -> dict[str, str]:
    if CACHE_FILE.exists():
        with open(CACHE_FILE) as f:
            return json.load(f)
    return {}


def save_cache(cache: dict[str, str]):
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)


def call_llm(model: str, concepts: list[str]) -> str:
    user_msg = "Classify these concepts:\n" + "\n".join(f"- {c}" for c in concepts)
    payload = json.dumps({
        "model": model,
        "stream": False,
        "messages": [
            {"role": "system", "content": LLM_SYSTEM},
            {"role": "user", "content": user_msg},
        ],
        "options": {"temperature": 0.0, "num_predict": 1024},
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
            print(f"    retry {attempt}/{MAX_RETRIES}: {e}")
            time.sleep(RETRY_DELAY * attempt)
    return ""


def parse_llm_response(raw: str) -> dict[str, str]:
    """Parse LLM JSON response into {concept: category}."""
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```\w*\n?", "", cleaned)
        cleaned = re.sub(r"\n?```$", "", cleaned)
        cleaned = cleaned.strip()
    try:
        arr = json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\[.*\]", cleaned, re.DOTALL)
        if match:
            try:
                arr = json.loads(match.group())
            except json.JSONDecodeError:
                return {}
        else:
            return {}

    result = {}
    if isinstance(arr, list):
        for item in arr:
            if isinstance(item, dict):
                c = item.get("concept", "").strip().lower()
                cat = item.get("category", "").strip().lower()
                if c and cat in CATEGORY_SET:
                    result[c] = cat
    return result


def llm_classify(model: str, concepts: list[str], batch_size: int,
                 cache: dict[str, str]) -> dict[str, str]:
    """Classify concepts via LLM in batches, using and updating cache."""
    uncached = [c for c in concepts if c not in cache]
    if not uncached:
        print(f"  All {len(concepts)} concepts found in cache")
        return {c: cache[c] for c in concepts}

    print(f"  {len(uncached)} concepts to classify via LLM "
          f"({len(concepts) - len(uncached)} cached)")

    results = {c: cache[c] for c in concepts if c in cache}
    batches = [uncached[i:i + batch_size] for i in range(0, len(uncached), batch_size)]
    total_batches = len(batches)

    for idx, batch in enumerate(batches, 1):
        t0 = time.perf_counter()
        raw = call_llm(model, batch)
        elapsed = time.perf_counter() - t0

        parsed = parse_llm_response(raw)
        matched = 0
        for concept in batch:
            cat = parsed.get(concept)
            if not cat:
                for k, v in parsed.items():
                    if k in concept or concept in k:
                        cat = v
                        break
            if cat and cat in CATEGORY_SET:
                results[concept] = cat
                cache[concept] = cat
                matched += 1
            else:
                results[concept] = "other"
                cache[concept] = "other"

        print(f"  Batch {idx}/{total_batches}: "
              f"{matched}/{len(batch)} matched in {elapsed:.1f}s", flush=True)

        if idx % 10 == 0:
            save_cache(cache)

    save_cache(cache)
    return results


# ── Main ───────────────────────────────────────────────────────

def get_canonical_concepts() -> list[str]:
    with open(NORM_FILE) as f:
        data = json.load(f)
    return sorted(set(data["concept_map"].values()))


def main():
    parser = argparse.ArgumentParser(description="Classify canonical concepts")
    parser.add_argument("--heuristics-only", action="store_true")
    parser.add_argument("--llm-only", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH)
    args = parser.parse_args()

    canonicals = get_canonical_concepts()
    print(f"Canonical concepts: {len(canonicals)}", flush=True)

    categories: dict[str, dict] = {}

    # Tier 1: Heuristics
    heuristic_hits = 0
    if not args.llm_only:
        print("\n── Tier 1: Heuristics ──", flush=True)
        for c in canonicals:
            cat, rule = heuristic_classify(c)
            if cat:
                categories[c] = {"category": cat, "source": "heuristic", "rule": rule}
                heuristic_hits += 1

        by_cat = {}
        for info in categories.values():
            by_cat[info["category"]] = by_cat.get(info["category"], 0) + 1
        print(f"  Heuristic matches: {heuristic_hits}/{len(canonicals)}", flush=True)
        for cat in CATEGORIES:
            print(f"    {cat}: {by_cat.get(cat, 0)}", flush=True)

    # Tier 2: LLM
    remaining = [c for c in canonicals if c not in categories]
    if remaining and not args.heuristics_only:
        print(f"\n── Tier 2: LLM ({args.model}) ──")
        if args.dry_run:
            print(f"  Would classify {len(remaining)} concepts "
                  f"in ~{len(remaining) // args.batch_size + 1} batches")
        else:
            cache = load_cache()
            llm_results = llm_classify(args.model, remaining, args.batch_size, cache)
            for c, cat in llm_results.items():
                categories[c] = {"category": cat, "source": "llm"}
    elif remaining and args.heuristics_only:
        print(f"\n  {len(remaining)} concepts left unclassified (heuristics-only mode)")
        for c in remaining:
            categories[c] = {"category": "other", "source": "unclassified"}

    if args.dry_run:
        print("\nDry run — no output written.")
        return

    # Summary
    by_cat = {}
    by_source = {}
    for info in categories.values():
        by_cat[info["category"]] = by_cat.get(info["category"], 0) + 1
        by_source[info["source"]] = by_source.get(info["source"], 0) + 1

    print(f"\n── Final distribution ──")
    for cat in CATEGORIES:
        print(f"  {cat}: {by_cat.get(cat, 0)}")
    print(f"\n── By source ──")
    for src, cnt in sorted(by_source.items()):
        print(f"  {src}: {cnt}")

    output = {
        "generated": "classify_concepts.py",
        "model": args.model,
        "taxonomy_version": 1,
        "taxonomy": CATEGORIES,
        "total_concepts": len(categories),
        "categories": {
            c: info["category"] for c, info in sorted(categories.items())
        },
        "details": {
            c: info for c, info in sorted(categories.items())
        },
    }
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"\nWrote {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
