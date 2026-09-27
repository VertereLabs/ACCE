"""Guide review tooling: one review-items.json drives both the annotated PDF and REVIEW-NOTES.md.

    python review_pdf.py annotate <guide-dir>   # write <guide>-REVIEW.pdf with a highlight + comment per item
    python review_pdf.py notes <guide-dir>      # regenerate REVIEW-NOTES.md from the JSON (includes pulled replies)
    python review_pdf.py pull <guide-dir>       # read replies/new comments from the REVIEW PDF into the JSON, then regenerate notes

<guide-dir> is a folder under contentfiles/ holding review-items.json (e.g. contentfiles/ifrs-9-financial-instruments).
Item fields: id, severity (blocker|correction|minor), part (markdown part number), section, issue, anchors (exact
phrases from the PDF, tried in order within that part's page range; [] = notes-only item), optional also /
also_parts (extra passages to highlight), optional web (affected web page path or list, when not 1:1 with parts).
Comment IDs ("#7", "#M3") are identical in the PDF and the markdown so they cross-reference.
Requires PyMuPDF (pip install pymupdf).
"""

import json
import re
import sys
from datetime import datetime
from pathlib import Path

import pymupdf

sys.stdout.reconfigure(encoding="utf-8")

AUTHOR = "Claude (review pass)"
SEVERITY = {
    "blocker": {"label": "Release blocker", "color": (0.94, 0.33, 0.31), "heading": "Release blockers (clearly wrong)"},
    "correction": {"label": "Technical correction", "color": (1.0, 0.65, 0.2), "heading": "Technical corrections (fix before release)"},
    "minor": {"label": "Minor / wording", "color": (1.0, 0.92, 0.3), "heading": "Minor / wording"},
}
ID_RE = re.compile(r"^#(M?\d+)\b")


def load(guide_dir: Path) -> dict:
    return json.loads((guide_dir / "review-items.json").read_text(encoding="utf-8"))


def save(guide_dir: Path, data: dict) -> None:
    (guide_dir / "review-items.json").write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def page_range(data: dict, part) -> range:
    first, last = data["parts"][str(part)]
    return range(first - 1, last)  # 0-based page indices


def find_anchor(doc, pages: range, anchors: list[str]):
    """First page/quads matching any anchor within the part's pages."""
    for anchor in anchors:
        for pno in pages:
            page = doc[pno]
            quads = page.search_for(anchor, quads=True)
            if not quads:
                continue
            # A multi-line match returns one quad per line; if the anchor occurs more than
            # once on the page we can't group reliably, so keep only the first line.
            text = " ".join(page.get_text().split())
            if text.lower().count(anchor.lower()) > 1:
                quads = quads[:1]
            return page, quads, anchor
    return None, None, None


def web_pages(data: dict, item: dict) -> str:
    """Affected web page(s). Defaults to the matching part number; set "web" on the item when
    the guide's web parts don't map 1:1 to the markdown parts."""
    web = item.get("web", f"/guides/{data['slug']}/part-{item['part']}")
    return ", ".join(web) if isinstance(web, list) else web


def comment_text(data: dict, item: dict) -> str:
    sev = SEVERITY[item["severity"]]["label"]
    return (
        f"#{item['id']} [{sev}] {item['section']}\n\n"
        f"{item['issue']}\n\n"
        f"Web page: {web_pages(data, item)}\n"
        f"Reply with your call: agree / disagree / change to ..."
    )


def add_highlight(page, quads, item, content, subject, color):
    annot = page.add_highlight_annot(quads)
    annot.set_colors(stroke=color)
    annot.set_info(title=AUTHOR, subject=subject, content=content)
    annot.set_opacity(0.45)
    annot.update()
    return annot


def cmd_annotate(guide_dir: Path, force: bool) -> None:
    data = load(guide_dir)
    src = (guide_dir / data["source_pdf"]).resolve()
    out = (guide_dir / data["review_pdf"]).resolve()

    if out.exists() and not force:
        with pymupdf.open(out) as existing:
            foreign = [a for p in existing for a in p.annots() if a.info.get("title") != AUTHOR]
        if foreign:
            sys.exit(f"{out.name} already has {len(foreign)} comment(s) from you. Run `pull` first, or pass --force to overwrite them.")

    doc = pymupdf.open(src)
    misses = []
    for item in data["items"]:
        color = SEVERITY[item["severity"]]["color"]
        subject = f"#{item['id']} {SEVERITY[item['severity']]['label']}"
        if not item["anchors"]:
            continue  # notes-only item (e.g. an issue that exists only on the web page)
        page, quads, _ = find_anchor(doc, page_range(data, item["part"]), item["anchors"])
        if page is None:
            # Fall back to a sticky note at the top of the part so nothing is lost.
            page = doc[page_range(data, item["part"])[0]]
            note = page.add_text_annot((page.rect.width - 40, 40), comment_text(data, item), icon="Comment")
            note.set_colors(stroke=color)
            note.set_info(title=AUTHOR, subject=subject)
            note.update()
            misses.append(item["id"])
            continue
        add_highlight(page, quads, item, comment_text(data, item), subject, color)

        also = {str(item["part"]): item.get("also", [])} | item.get("also_parts", {})
        for part, anchors in also.items():
            for anchor in anchors:
                p2, q2, _ = find_anchor(doc, page_range(data, part), [anchor])
                if p2 is not None:
                    add_highlight(p2, q2, item, f"#{item['id']} (related): see the main #{item['id']} comment. {item['section']}.", subject, color)
                else:
                    misses.append(f"{item['id']} (also: {anchor})")

    counts = {k: sum(1 for i in data["items"] if i["severity"] == k) for k in SEVERITY}
    cover = doc[0].add_text_annot((doc[0].rect.width - 40, 30), (
        f"Review pass: {data['guide']}\n\n"
        f"{counts['blocker']} release blockers (red), {counts['correction']} technical corrections (orange), "
        f"{counts['minor']} minor / wording (yellow).\n\n"
        "Each comment is numbered to match REVIEW-NOTES.md. Reply to a comment to give your call "
        "(agree / disagree / change to ...), or add your own comments anywhere. Save the PDF, then ask Claude "
        "to pull the replies back into the review notes."
    ), icon="Note")
    cover.set_info(title=AUTHOR, subject="How to use this review")
    cover.update()

    try:
        doc.save(out, garbage=3, deflate=True)
    except Exception as exc:
        sys.exit(f"Could not write {out.name} (is it open in a PDF viewer?): {exc}")
    print(f"Wrote {out} ({len(data['items'])} items)")
    if misses:
        print("Anchors not found (placed as sticky notes / skipped):", ", ".join(misses))


def cmd_pull(guide_dir: Path) -> None:
    data = load(guide_dir)
    out = (guide_dir / data["review_pdf"]).resolve()
    by_id = {i["id"]: i for i in data["items"]}
    for i in data["items"]:
        i["responses"] = []
    data["extra_comments"] = []

    with pymupdf.open(out) as doc:
        ours = {}  # xref -> item id
        annots = []
        for page in doc:
            for a in page.annots():
                annots.append((page, a))
                m = ID_RE.match(a.info.get("subject", ""))
                if a.info.get("title") == AUTHOR and m:
                    ours[a.xref] = m.group(1)
        for page, a in annots:
            info = a.info
            if info.get("title") == AUTHOR:
                continue
            content = (info.get("content") or "").strip()
            entry = {"author": info.get("title", ""), "text": content, "page": page.number + 1}
            parent = getattr(a, "irt_xref", 0)
            if parent in ours:
                if content:
                    by_id[ours[parent]]["responses"].append(entry)
            elif content:
                # A standalone comment: record the text it sits on for context.
                near = page.get_textbox(a.rect).strip().replace("\n", " ")[:120]
                data["extra_comments"].append(entry | {"near": near})

    data["pulled_at"] = datetime.now().isoformat(timespec="minutes")
    save(guide_dir, data)
    replied = sum(1 for i in data["items"] if i["responses"])
    print(f"Pulled replies on {replied}/{len(data['items'])} items, {len(data['extra_comments'])} standalone comment(s).")
    cmd_notes(guide_dir)


def cell(text: str) -> str:
    return text.replace("|", "\\|").replace("\n", " ")


def cmd_notes(guide_dir: Path) -> None:
    data = load(guide_dir)
    review_pdf = Path(data["review_pdf"]).name
    lines = [
        f"# {data['guide']} guide: content review notes",
        "",
        "<!-- Generated from review-items.json by contentfiles/_tools/review_pdf.py. Edit the JSON, not this file. -->",
        "",
        f"Status: **{data['status']}**. {data['intro']}",
        "",
        f"Every item below is also a numbered comment on `contentfiles/{review_pdf}`, highlighted on the passage it refers to "
        "(red = release blocker, orange = technical correction, yellow = minor). Reply to the comments in the PDF, then run "
        "`pull` to bring your replies into the Response column here.",
        "",
    ]
    if data.get("pulled_at"):
        lines += [f"Replies last pulled: {data['pulled_at']}.", ""]

    for key, meta in SEVERITY.items():
        items = [i for i in data["items"] if i["severity"] == key]
        if not items:
            continue
        lines += [f"## {meta['heading']}", "", "| # | Part | Section | Issue | Web page | Response |", "|---|------|---------|-------|----------|----------|"]
        for i in items:
            resp = "<br>".join(cell(r["text"]) for r in i.get("responses", [])) or ""
            where = cell(web_pages(data, i)) + ("" if i["anchors"] else " (web only, not in PDF)")
            lines.append(f"| {i['id']} | {i['part']} | {cell(i['section'])} | {cell(i['issue'])} | {where} | {resp} |")
        lines.append("")

    if data.get("extra_comments"):
        lines += ["## Additional comments from the PDF", "", "| Page | Near | Comment |", "|------|------|---------|"]
        for c in data["extra_comments"]:
            lines.append(f"| {c['page']} | {cell(c.get('near', ''))} | {cell(c['text'])} |")
        lines.append("")

    lines += ["## Release checklist", ""] + [f"{n}. {step}" for n, step in enumerate(data["release_checklist"], 1)] + [""]
    (guide_dir / data["notes_md"]).write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {guide_dir / data['notes_md']}")


if __name__ == "__main__":
    if len(sys.argv) < 3 or sys.argv[1] not in {"annotate", "notes", "pull"}:
        sys.exit(__doc__)
    target = Path(sys.argv[2])
    {"annotate": lambda: cmd_annotate(target, "--force" in sys.argv), "notes": lambda: cmd_notes(target), "pull": lambda: cmd_pull(target)}[sys.argv[1]]()
