"""
Build a compact graph JSON for kg_viz.html from sermon_concepts.json + normalized_concepts.json.

Nodes: sermons + canonical concepts
Edges: sermon --[weight]--> concept (aggregated mention counts)
"""

import json
from collections import defaultdict
from pathlib import Path

KG = Path(__file__).resolve().parent
CONCEPTS = KG / "sermon_concepts.json"
NORM = KG / "normalized_concepts.json"
OUT = KG / "kg_graph.json"


def main():
    with open(NORM) as f:
        norm_data = json.load(f)
    cmap = norm_data["concept_map"]

    with open(CONCEPTS) as f:
        ser_data = json.load(f)

    # sermon_id -> canonical -> total count
    sermon_concepts = {}
    concept_totals = defaultdict(int)
    edge_list = []

    for s in ser_data["sermons"]:
        sid = s["id"]
        agg = defaultdict(int)
        for c in s["concepts"]:
            n = c["normalized"]
            canonical = cmap.get(n, n)
            agg[canonical] += c["count"]
        sermon_concepts[sid] = dict(agg)
        for canon, w in agg.items():
            concept_totals[canon] += w

    nodes = []
    for s in ser_data["sermons"]:
        short = s["title"].split("|")[0].strip()[:60]
        nodes.append({
            "id": f"s:{s['id']}",
            "label": short,
            "group": "sermon",
            "title": f"{s['date']} — {short}",
            "date": s["date"],
            "series": s.get("series", ""),
        })

    concept_ids = {}
    for i, canon in enumerate(sorted(concept_totals.keys())):
        concept_ids[canon] = f"c:{i}"

    for canon in sorted(concept_totals.keys()):
        cid = concept_ids[canon]
        nodes.append({
            "id": cid,
            "label": canon[:40] + ("…" if len(canon) > 40 else ""),
            "group": "concept",
            "title": canon,
            "value": concept_totals[canon],
        })

    edges = []
    for s in ser_data["sermons"]:
        sid = f"s:{s['id']}"
        for canon, w in sermon_concepts[s["id"]].items():
            edges.append({
                "from": sid,
                "to": concept_ids[canon],
                "value": w,
            })

    out = {
        "generated": "build_kg_graph.py",
        "sermon_count": len(ser_data["sermons"]),
        "concept_count": len(concept_ids),
        "edge_count": len(edges),
        "nodes": nodes,
        "edges": edges,
    }

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))

    print(f"Wrote {OUT}")
    print(f"  Nodes: {len(nodes)} (sermons + concepts)")
    print(f"  Edges: {len(edges)}")


if __name__ == "__main__":
    main()
