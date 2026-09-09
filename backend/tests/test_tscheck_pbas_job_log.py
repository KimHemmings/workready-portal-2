"""PBAS Job Search Logger — criterion: correct points per method, totals update, validation rejects empty fields."""
import uuid

PARTICIPANT_ID = "user-participant-sarah"


def test_create_job_log_in_person_awards_10_points(client):
    suffix = uuid.uuid4().hex[:8]
    payload = {
        "employer_name": f"tscheck-employer-{suffix}",
        "position_title": f"tscheck-position-{suffix}",
        "application_date": "2026-09-10",
        "application_type": "In person",
        "evidence_filename": f"tscheck-evidence-{suffix}.pdf",
        "notes": "created by automated test",
    }
    resp = client.post(f"/participants/{PARTICIPANT_ID}/job-logs", json=payload)
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["employer_name"] == payload["employer_name"]
    assert body["points"] == 10, f"expected 10 points for In person, got {body}"

    logs = client.get(f"/participants/{PARTICIPANT_ID}/job-logs")
    assert logs.status_code == 200
    ids = [r["id"] for r in logs.json()]
    assert body["id"] in ids


# Note: empty employer/position validation is enforced client-side only (server accepts
# empty strings with a 200). That UI-level rejection is covered by the
# pbas-logger-validation-rejects-empty-fields browser check instead of here.
