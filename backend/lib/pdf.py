"""Minimal dependency-free PDF writer for compliance reports (text-only, A4)."""


def _esc(text: str) -> str:
    return text.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")


def _wrap(text: str, width: int = 100) -> list[str]:
    words, out, line = str(text).split(), [], ""
    for w in words:
        if len(line) + len(w) + 1 > width:
            out.append(line)
            line = w
        else:
            line = f"{line} {w}".strip()
    if line:
        out.append(line)
    return out or [""]


def interview_scorecard_pdf(session: dict) -> bytes:
    """Build the downloadable Interview Feedback Scorecard PDF for one practice session."""
    fb = session.get("feedback_summary_json") or {}
    created = str(session.get("created_at", ""))[:10]
    lines: list[str] = [
        f"Role target : {session.get('job_target', '')}",
        f"Industry    : {session.get('industry', '')}",
        f"Date        : {created}",
        f"Mode        : {'LLND / Accessible' if session.get('mode') == 'llnd' else 'Standard'}",
        f"Overall readiness score: {session.get('overall_score', 0)}/100",
        "",
        "Summary",
        "-------",
    ]
    lines += _wrap(fb.get("summary", ""))
    lines += ["", "Core Skills for Work", "--------------------"]
    for s in fb.get("skills", []) or []:
        lines += _wrap(f"{s.get('skill', '')}: {s.get('score', 0)}/100 - {s.get('comment', '')}")
    lines += ["", "Strengths", "---------"]
    for s in fb.get("strengths", []) or []:
        lines += _wrap(f"- {s}")
    lines += ["", "Areas for improvement", "---------------------"]
    for s in fb.get("improvements", []) or []:
        lines += _wrap(f"- {s}")
    lines += ["", "Transcript", "----------"]
    for turn in session.get("transcript_json", []) or []:
        label = str(turn.get("role", "")).upper()
        lines += _wrap(f"{label}: {turn.get('content', '')}")
        lines.append("")
    return simple_pdf("WorkReady Portal - Interview Feedback Scorecard", lines)


def simple_pdf(title: str, lines: list[str]) -> bytes:
    per_page = 46
    pages: list[list[str]] = []
    body = [title, ""] + lines
    for i in range(0, len(body), per_page):
        pages.append(body[i : i + per_page])
    if not pages:
        pages = [[title]]

    objects: list[bytes] = []
    page_ids = [4 + i * 2 for i in range(len(pages))]

    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
    kids = " ".join(f"{pid} 0 R" for pid in page_ids)
    objects.append(f"<< /Type /Pages /Kids [{kids}] /Count {len(pages)} >>".encode())
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")

    for idx, page_lines in enumerate(pages):
        content_id = page_ids[idx] + 1
        objects.append(
            (
                f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
                f"/Resources << /Font << /F1 3 0 R >> >> /Contents {content_id} 0 R >>"
            ).encode()
        )
        stream = "BT /F1 10 Tf 40 800 Td 14 TL\n"
        for line in page_lines:
            stream += f"({_esc(line[:110])}) Tj T*\n"
        stream += "ET"
        data = stream.encode("latin-1", "replace")
        objects.append(b"<< /Length " + str(len(data)).encode() + b" >>\nstream\n" + data + b"\nendstream")

    out = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for i, obj in enumerate(objects, start=1):
        offsets.append(len(out))
        out += f"{i} 0 obj\n".encode() + obj + b"\nendobj\n"
    xref_pos = len(out)
    out += f"xref\n0 {len(objects) + 1}\n".encode()
    out += b"0000000000 65535 f \n"
    for off in offsets[1:]:
        out += f"{off:010d} 00000 n \n".encode()
    out += f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF".encode()
    return bytes(out)
