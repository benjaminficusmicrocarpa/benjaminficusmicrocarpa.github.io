"""
A/B test: compare two concept-extraction strategies on one sermon.

Option A: one LLM call per chunk (after sub-splitting chunks > 500 tok)
Option B: micro-batch 2–4 consecutive same-section chunks when each < 200 tok

Measures: wall time, number of LLM calls, concepts extracted, quality (manual).
"""

import json
import time
import re
import urllib.request
from pathlib import Path

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "granite4.1:3b"
CHUNKS_FILE = Path(__file__).resolve().parent / "sermon_chunks.json"
TEST_SERMON = "2026-05-03-romans-8-liberated-from-bondage.html"

SYSTEM_PROMPT = (
    "You extract concise theological and pastoral concepts from sermon text. "
    "Output ONLY a pipe-separated list of 2–6 word noun phrases. "
    "No commentary, no numbering, no bullets. Example output:\n"
    "redemption of creation | Spirit's intercession | hope in suffering"
)


def call_ollama(user_msg: str) -> tuple[str, float]:
    """Call Ollama chat API. Returns (response_text, elapsed_seconds)."""
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
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=120) as resp:
        body = json.loads(resp.read())
    elapsed = time.time() - t0
    return body["message"]["content"].strip(), elapsed


def parse_concepts(raw: str) -> list[str]:
    """Parse pipe-separated concepts, cleaning up noise."""
    concepts = []
    for line in raw.split("\n"):
        for part in line.split("|"):
            c = part.strip().strip("-•*").strip()
            c = re.sub(r"^\d+[.)]\s*", "", c)
            if 2 < len(c) < 80 and not c.startswith("Segment"):
                concepts.append(c)
    return concepts


def load_test_chunks() -> list[dict]:
    with open(CHUNKS_FILE) as f:
        data = json.load(f)
    s = next(s for s in data["sermons"] if s["id"] == TEST_SERMON)
    return s["chunks"]


def user_prompt_single(chunk: dict) -> str:
    return (
        f"Extract 5–12 key theological/pastoral concepts from this sermon segment.\n\n"
        f"--- SEGMENT ---\n{chunk['text'][:1500]}\n--- END ---\n\n"
        f"Output ONLY a pipe-separated list of noun phrases."
    )


def user_prompt_batch(segments: list[dict]) -> str:
    parts = []
    for i, seg in enumerate(segments, 1):
        parts.append(f"--- SEGMENT {i} ---\n{seg['text'][:800]}")
    text = "\n".join(parts) + "\n--- END ---"
    return (
        f"Extract 5–12 key theological/pastoral concepts from EACH segment below.\n"
        f"For each, output ONE line: 'Segment N: concept | concept | ...'\n\n"
        f"{text}"
    )


def run_option_a(chunks: list[dict]):
    """One call per chunk."""
    print("\n" + "=" * 60)
    print("OPTION A: one call per chunk")
    print("=" * 60)
    all_concepts = []
    total_calls = 0
    t_start = time.time()

    for c in chunks:
        prompt = user_prompt_single(c)
        raw, elapsed = call_ollama(prompt)
        concepts = parse_concepts(raw)
        total_calls += 1
        all_concepts.extend(concepts)
        print(f"  [{c['chunk_index']:2d}] {elapsed:5.1f}s | {len(concepts):2d} concepts | {concepts[:3]}")

    wall = time.time() - t_start
    deduped = sorted(set(c.lower() for c in all_concepts))
    print(f"\n  Total calls:    {total_calls}")
    print(f"  Wall time:      {wall:.1f}s")
    print(f"  Raw concepts:   {len(all_concepts)}")
    print(f"  Deduped:        {len(deduped)}")
    print(f"  Avg time/call:  {wall/total_calls:.1f}s")
    return {"calls": total_calls, "wall": wall, "raw": all_concepts, "deduped": deduped}


def run_option_b(chunks: list[dict]):
    """Micro-batch same-section chunks < 200 tok."""
    print("\n" + "=" * 60)
    print("OPTION B: micro-batch (2-4 per call, same section, each < 200 tok)")
    print("=" * 60)
    all_concepts = []
    total_calls = 0
    t_start = time.time()

    # Group consecutive chunks by section_id
    batches = []
    buf = []
    for c in chunks:
        if buf and (c["section_id"] != buf[0]["section_id"] or
                    c["token_est"] >= 200 or
                    len(buf) >= 4):
            batches.append(buf)
            buf = []
        # Start a new batch if this chunk is large
        if c["token_est"] >= 200:
            if buf:
                batches.append(buf)
                buf = []
            batches.append([c])
        else:
            buf.append(c)
    if buf:
        batches.append(buf)

    for batch in batches:
        if len(batch) == 1:
            prompt = user_prompt_single(batch[0])
        else:
            prompt = user_prompt_batch(batch)

        raw, elapsed = call_ollama(prompt)
        concepts = parse_concepts(raw)
        total_calls += 1
        all_concepts.extend(concepts)
        ids = [b["chunk_index"] for b in batch]
        print(f"  {ids} {elapsed:5.1f}s | {len(concepts):2d} concepts | {concepts[:3]}")

    wall = time.time() - t_start
    deduped = sorted(set(c.lower() for c in all_concepts))
    print(f"\n  Total calls:    {total_calls}")
    print(f"  Wall time:      {wall:.1f}s")
    print(f"  Raw concepts:   {len(all_concepts)}")
    print(f"  Deduped:        {len(deduped)}")
    print(f"  Avg time/call:  {wall/total_calls:.1f}s")
    return {"calls": total_calls, "wall": wall, "raw": all_concepts, "deduped": deduped}


def main():
    chunks = load_test_chunks()
    print(f"Test sermon: {TEST_SERMON}")
    print(f"Chunks: {len(chunks)}")
    print(f"Token range: {min(c['token_est'] for c in chunks)} – {max(c['token_est'] for c in chunks)}")

    # Warmup call
    print("\nWarming up model...")
    call_ollama("Say 'ready'.")
    print("Model warm.\n")

    result_a = run_option_a(chunks)
    result_b = run_option_b(chunks)

    print("\n" + "=" * 60)
    print("COMPARISON")
    print("=" * 60)
    print(f"{'':20s} {'Option A':>12s} {'Option B':>12s} {'Diff':>12s}")
    print(f"{'LLM calls':20s} {result_a['calls']:12d} {result_b['calls']:12d} {result_b['calls']-result_a['calls']:+12d}")
    print(f"{'Wall time (s)':20s} {result_a['wall']:12.1f} {result_b['wall']:12.1f} {result_b['wall']-result_a['wall']:+12.1f}")
    print(f"{'Raw concepts':20s} {len(result_a['raw']):12d} {len(result_b['raw']):12d} {len(result_b['raw'])-len(result_a['raw']):+12d}")
    print(f"{'Deduped concepts':20s} {len(result_a['deduped']):12d} {len(result_b['deduped']):12d} {len(result_b['deduped'])-len(result_a['deduped']):+12d}")
    print(f"{'Avg s/call':20s} {result_a['wall']/result_a['calls']:12.1f} {result_b['wall']/result_b['calls']:12.1f}")

    # Show unique to each
    set_a = set(result_a["deduped"])
    set_b = set(result_b["deduped"])
    overlap = set_a & set_b
    print(f"\n  Overlap:        {len(overlap)} concepts in both")
    print(f"  Only in A:      {len(set_a - set_b)}")
    print(f"  Only in B:      {len(set_b - set_a)}")

    print("\n--- ALL DEDUPED CONCEPTS (Option A) ---")
    for c in result_a["deduped"]:
        marker = " [also B]" if c in set_b else ""
        print(f"  {c}{marker}")

    print("\n--- ALL DEDUPED CONCEPTS (Option B) ---")
    for c in result_b["deduped"]:
        marker = " [also A]" if c in set_a else ""
        print(f"  {c}{marker}")


if __name__ == "__main__":
    main()
