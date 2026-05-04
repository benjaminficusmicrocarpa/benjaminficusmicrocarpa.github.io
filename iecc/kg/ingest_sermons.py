"""
Ingest IECC sermon HTML pages and produce a chunked JSON corpus.

Output: sermon_chunks.json
  - One entry per sermon
  - Each entry carries metadata from sermons_data.json + structured text chunks
  - Chunks are split on h2/h3 boundaries inside each tab/section
"""

import json
import os
import re
import glob
import unicodedata
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Comment

IECC_DIR = Path(__file__).resolve().parent.parent  # iecc/
SERMONS_DATA = IECC_DIR / "sermons_data.json"
OUTPUT_FILE = Path(__file__).resolve().parent / "sermon_chunks.json"

STRIP_TAGS = {"style", "script", "nav", "noscript", "svg", "link", "meta"}
HEADING_TAGS = {"h2", "h3"}


def load_sermons_index():
    with open(SERMONS_DATA, encoding="utf-8") as f:
        data = json.load(f)
    by_link = {}
    for s in data.get("sermons", []):
        by_link[s["link"]] = s
    return by_link


def clean_text(text: str) -> str:
    """Collapse whitespace, strip emoji skin-tone modifiers, normalize unicode."""
    text = unicodedata.normalize("NFKC", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def estimate_tokens(text: str) -> int:
    """Rough word-based token estimate (English ~1.3 tokens/word)."""
    words = text.split()
    return int(len(words) * 1.3)


def extract_text_from_element(el) -> str:
    """Recursively extract visible text, preserving list markers."""
    parts = []
    for child in el.children:
        if isinstance(child, Comment):
            continue
        if isinstance(child, NavigableString):
            parts.append(str(child))
        elif child.name in STRIP_TAGS:
            continue
        elif child.name == "li":
            parts.append("\n- " + extract_text_from_element(child))
        elif child.name == "br":
            parts.append("\n")
        elif child.name in ("p", "div", "blockquote", "section", "article", "tr"):
            parts.append("\n" + extract_text_from_element(child) + "\n")
        else:
            parts.append(extract_text_from_element(child))
    return "".join(parts)


def find_content_sections(soup: BeautifulSoup):
    """
    Return a list of (section_id, section_element) tuples.
    Handles three structural patterns found in the corpus:
      1. <section|div id="..." class="tab-content|content-section">
      2. <div data-tab-content="...">  (Generic2-era pages)
      3. <div class="tab-content"> without id  (early pages like Contempt)
    """
    # Pattern 1: id-based tab-content / content-section
    sections = soup.select(
        'section.tab-content[id], section.content-section[id], '
        'div.tab-content[id], div.content-section[id]'
    )
    if sections:
        return [(s.get("id", "unknown"), s) for s in sections]

    # Pattern 2: data-tab-content attribute (Generic2 framework)
    sections = soup.select('[data-tab-content]')
    if sections:
        return [(s.get("data-tab-content", "unknown"), s) for s in sections]

    # Pattern 3: .tab-content without id (assign positional labels)
    sections = soup.select('div.tab-content')
    if sections:
        return [(f"section-{i}", s) for i, s in enumerate(sections)]

    # Fallback: try <main> or <body>
    main = soup.find("main") or soup.find("body")
    if main:
        return [("full", main)]
    return []


def _walk_for_headings(el):
    """
    Yield (type, payload) tuples in document order.
    type 'heading': payload = (tag_name, heading_text)
    type 'text':    payload = extracted plain text of that subtree
    Splits only on h2/h3; everything else is collected as 'text'.
    """
    for child in el.children:
        if isinstance(child, Comment):
            continue
        if isinstance(child, NavigableString):
            t = str(child).strip()
            if t:
                yield ("text", t)
            continue
        if child.name in STRIP_TAGS:
            continue
        if child.name in HEADING_TAGS:
            yield ("heading", (child.name, clean_text(extract_text_from_element(child))))
        elif child.find(list(HEADING_TAGS)):
            # There's a heading deeper inside — recurse to split on it
            yield from _walk_for_headings(child)
        else:
            # Leaf subtree with no headings inside — extract as one text block
            t = clean_text(extract_text_from_element(child))
            if t:
                yield ("text", t)


def chunk_section(section_id: str, el) -> list[dict]:
    """
    Split an element into chunks on h2/h3 boundaries found anywhere
    in the subtree (not just direct children).
    """
    chunks = []
    current_heading = None
    current_heading_tag = None
    buffer = []

    for kind, payload in _walk_for_headings(el):
        if kind == "heading":
            # Flush previous chunk
            text = clean_text(" ".join(buffer))
            if text:
                chunks.append({
                    "section_id": section_id,
                    "heading": current_heading or "(intro)",
                    "heading_tag": current_heading_tag or "none",
                    "text": text,
                    "token_est": estimate_tokens(text),
                })
            buffer = []
            current_heading_tag, current_heading = payload
        else:
            t = clean_text(payload)
            if t:
                buffer.append(t)

    # Flush remaining
    text = clean_text(" ".join(buffer))
    if text:
        chunks.append({
            "section_id": section_id,
            "heading": current_heading or "(intro)",
            "heading_tag": current_heading_tag or "none",
            "text": text,
            "token_est": estimate_tokens(text),
        })

    return chunks


def merge_small_chunks(chunks: list[dict], min_tokens: int = 80) -> list[dict]:
    """Merge very small chunks into their neighbor."""
    if len(chunks) <= 1:
        return chunks
    merged = [chunks[0]]
    for c in chunks[1:]:
        if c["token_est"] < min_tokens and merged:
            prev = merged[-1]
            prev["text"] += " " + c["text"]
            prev["token_est"] = estimate_tokens(prev["text"])
            if c["heading"] != "(intro)":
                prev["heading"] += " / " + c["heading"]
        else:
            merged.append(c)
    # Also merge a tiny first chunk forward if still too small
    if len(merged) > 1 and merged[0]["token_est"] < min_tokens:
        merged[1]["text"] = merged[0]["text"] + " " + merged[1]["text"]
        merged[1]["token_est"] = estimate_tokens(merged[1]["text"])
        if merged[0]["heading"] != "(intro)":
            merged[1]["heading"] = merged[0]["heading"] + " / " + merged[1]["heading"]
        merged.pop(0)
    return merged


def split_large_chunks(chunks: list[dict], max_tokens: int = 1500) -> list[dict]:
    """Split oversized chunks into ~500-token windows using sentence boundaries."""
    result = []
    for c in chunks:
        if c["token_est"] <= max_tokens:
            result.append(c)
            continue
        # Split on sentence boundaries (period + space + uppercase, or newline)
        sentences = re.split(r'(?<=[.!?])\s+', c["text"])
        buf = []
        buf_tok = 0
        part = 0
        for sent in sentences:
            stok = estimate_tokens(sent)
            if buf and buf_tok + stok > 500:
                part += 1
                result.append({
                    "section_id": c["section_id"],
                    "heading": c["heading"] + (f" (pt {part})" if part > 1 else ""),
                    "heading_tag": c["heading_tag"],
                    "text": " ".join(buf),
                    "token_est": buf_tok,
                })
                buf = []
                buf_tok = 0
            buf.append(sent)
            buf_tok += stok
        if buf:
            part += 1
            result.append({
                "section_id": c["section_id"],
                "heading": c["heading"] + (f" (pt {part})" if part > 1 else ""),
                "heading_tag": c["heading_tag"],
                "text": " ".join(buf),
                "token_est": buf_tok,
            })
    return result


def extract_hero_metadata(soup: BeautifulSoup) -> dict:
    """Pull pastor, date-string, subtitle from the hero header."""
    meta = {}
    hero_meta = soup.select_one(".hero-meta, .header-meta")
    if hero_meta:
        meta["hero_meta_raw"] = clean_text(extract_text_from_element(hero_meta))
        pastor_match = re.search(r"Pastor\s+(\w+)", meta["hero_meta_raw"])
        if pastor_match:
            meta["pastor"] = pastor_match.group(1)

    subtitle = soup.select_one(".hero-subtitle")
    if subtitle:
        meta["subtitle"] = clean_text(extract_text_from_element(subtitle))

    return meta


def process_sermon(html_path: str, index_entry: dict | None) -> dict:
    with open(html_path, encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    filename = os.path.basename(html_path)

    title_tag = soup.find("title")
    title = clean_text(title_tag.string) if title_tag and title_tag.string else filename

    body = soup.find("body")
    sermon_date = body.get("data-sermon-date", "") if body else ""
    if not sermon_date:
        m = re.match(r"(\d{4}-\d{2}-\d{2})", filename)
        sermon_date = m.group(1) if m else ""

    hero = extract_hero_metadata(soup)

    sections = find_content_sections(soup)
    all_chunks = []
    for sid, sel in sections:
        all_chunks.extend(chunk_section(sid, sel))

    all_chunks = merge_small_chunks(all_chunks)
    all_chunks = split_large_chunks(all_chunks)

    # Add sequential chunk_index
    for i, c in enumerate(all_chunks):
        c["chunk_index"] = i

    record = {
        "id": filename,
        "date": sermon_date,
        "title": title,
        "pastor": hero.get("pastor", ""),
        "subtitle": hero.get("subtitle", ""),
        "chunk_count": len(all_chunks),
        "total_tokens_est": sum(c["token_est"] for c in all_chunks),
        "chunks": all_chunks,
    }

    if index_entry:
        record["tags"] = index_entry.get("tags", [])
        record["displayTags"] = index_entry.get("displayTags", [])
        record["series"] = next(
            (t["label"] for t in index_entry.get("displayTags", []) if t["type"] == "series"),
            "",
        )

    return record


def main():
    index = load_sermons_index()

    html_files = sorted(glob.glob(str(IECC_DIR / "2*.html")))
    print(f"Found {len(html_files)} sermon HTML files")

    results = []
    for hf in html_files:
        fname = os.path.basename(hf)
        entry = index.get(fname)
        record = process_sermon(hf, entry)
        results.append(record)
        print(f"  {fname}: {record['chunk_count']} chunks, ~{record['total_tokens_est']} tokens")

    results.sort(key=lambda r: r["date"])

    corpus = {
        "generated": "ingest_sermons.py",
        "sermon_count": len(results),
        "total_chunks": sum(r["chunk_count"] for r in results),
        "total_tokens_est": sum(r["total_tokens_est"] for r in results),
        "sermons": results,
    }

    os.makedirs(OUTPUT_FILE.parent, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(corpus, f, ensure_ascii=False, indent=2)

    print(f"\nWrote {OUTPUT_FILE}")
    print(f"  Sermons: {corpus['sermon_count']}")
    print(f"  Chunks : {corpus['total_chunks']}")
    print(f"  Tokens : ~{corpus['total_tokens_est']}")


if __name__ == "__main__":
    main()
