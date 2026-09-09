"""Coach roster, participant detail, case notes and CSV/PDF compliance exports."""
import uuid

COACH_ID = "user-coach-marcus"
SARAH_ID = "user-participant-sarah"


def test_roster_lists_six_assigned_jobseekers(client):
    resp = client.get(f"/coaches/{COACH_ID}/roster")
    assert resp.status_code == 200, resp.text
    rows = resp.json()
    assert len(rows) == 6, f"expected 6 jobseekers on roster, got {len(rows)}"
    for row in rows:
        assert "completion_percent" in row
        assert "job_applications" in row
        assert "pbas_points" in row
        assert "last_login" in row
        assert "risk" in row


def test_participant_detail_shows_progress_and_case_note(client):
    resp = client.get(f"/coaches/{COACH_ID}/participants/{SARAH_ID}")
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["participant"]["id"] == SARAH_ID
    assert body["completion_percent"] == 40
    assert len(body.get("notes", [])) >= 1


def test_add_case_note_appears_in_notes_list(client):
    suffix = uuid.uuid4().hex[:8]
    note_text = f"tscheck-note-{suffix} automated test note"
    resp = client.post(
        f"/coaches/{COACH_ID}/participants/{SARAH_ID}/notes", json={"body": note_text}
    )
    assert resp.status_code == 200, resp.text
    created = resp.json()
    assert created["body"] == note_text

    detail = client.get(f"/coaches/{COACH_ID}/participants/{SARAH_ID}")
    assert detail.status_code == 200
    bodies = [n["body"] for n in detail.json()["notes"]]
    assert note_text in bodies


def test_csv_export_has_expected_header(client):
    resp = client.get(f"/coaches/{COACH_ID}/export.csv")
    assert resp.status_code == 200, resp.text
    first_line = resp.text.splitlines()[0]
    assert "Jobseeker" in first_line
    assert "PBAS points" in first_line


def test_pdf_export_is_valid_pdf(client):
    resp = client.get(f"/coaches/{COACH_ID}/export.pdf")
    assert resp.status_code == 200, resp.text
    assert resp.content[:4] == b"%PDF", f"expected PDF header, got {resp.content[:20]!r}"
