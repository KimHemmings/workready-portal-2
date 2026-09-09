"""AI Interview Simulator — full 5-question multi-turn session and scorecard.

Uses a freshly admin-invited participant so no seeded interview history is touched.
AI calls have deterministic fallbacks and can take a while; client timeout is generous.
"""
import uuid

import httpx

ADMIN_ID = "user-admin-eleanor"


def _create_fresh_participant(client):
    suffix = uuid.uuid4().hex[:8]
    payload = {
        "name": f"tscheck-interview-user-{suffix}",
        "email": f"tscheck-interview-{suffix}@hves.com.au",
        "role": "participant",
    }
    resp = client.post(f"/admin/{ADMIN_ID}/users", json=payload)
    assert resp.status_code == 200, resp.text
    return resp.json()["id"]


def test_full_interview_session_produces_scorecard(client, backend_url):
    pid = _create_fresh_participant(client)

    start = client.post(
        "/interviews/start",
        json={"participant_id": pid, "job_target": "Retail Assistant", "industry": "Retail"},
        timeout=120.0,
    )
    assert start.status_code == 200, start.text
    session = start.json()
    session_id = session["id"]
    assert len(session["questions"]) == 5
    assert session["finished"] is False

    last = None
    with httpx.Client(base_url=f"{backend_url}/api", timeout=120.0) as long_client:
        for i in range(5):
            resp = long_client.post(
                f"/interviews/{session_id}/answer",
                json={"answer": f"tscheck automated answer {i + 1} describing relevant experience."},
            )
            assert resp.status_code == 200, resp.text
            last = resp.json()

    assert last["finished"] is True
    assert isinstance(last["overall_score"], (int, float))
    assert 0 <= last["overall_score"] <= 100

    feedback = last["feedback_summary_json"]
    assert "strengths" in feedback and isinstance(feedback["strengths"], list)
    assert "improvements" in feedback and isinstance(feedback["improvements"], list)
    skills = {s["skill"] for s in feedback["skills"]}
    assert {"Communication", "Problem Solving", "Workplace Etiquette"}.issubset(skills)

    history = client.get(f"/interviews/participant/{pid}/history")
    assert history.status_code == 200
    ids = [h["id"] for h in history.json()]
    assert session_id in ids
