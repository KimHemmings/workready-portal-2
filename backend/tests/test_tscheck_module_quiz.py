"""Learning Centre module quiz — criterion: submitting answers returns percentage score,
per-question explanations, and passing >=80% marks the module completed.

Uses a freshly admin-invited participant so no seeded participant's progress is touched.
"""
import uuid

ADMIN_ID = "user-admin-eleanor"
MODULE_ID = "mod-written-comms"


def _create_fresh_participant(client):
    suffix = uuid.uuid4().hex[:8]
    payload = {
        "name": f"tscheck-quiz-user-{suffix}",
        "email": f"tscheck-quiz-{suffix}@hves.com.au",
        "role": "participant",
    }
    resp = client.post(f"/admin/{ADMIN_ID}/users", json=payload)
    assert resp.status_code == 200, resp.text
    return resp.json()["id"]


def test_quiz_submission_scores_and_completes_module(client):
    pid = _create_fresh_participant(client)

    resp = client.get(f"/participants/{pid}/modules/{MODULE_ID}")
    assert resp.status_code == 200, resp.text
    quiz = resp.json()["quiz"]
    assert len(quiz["questions"]) == 7

    start = client.post(f"/participants/{pid}/modules/{MODULE_ID}/start")
    assert start.status_code == 200, start.text

    correct_answers = [q["correct_answer"] for q in quiz["questions"]]
    submit = client.post(
        f"/participants/{pid}/modules/{MODULE_ID}/quiz",
        json={"answers": correct_answers},
    )
    assert submit.status_code == 200, submit.text
    body = submit.json()
    assert body["score"] == 100
    assert body["passed"] is True
    assert len(body["results"]) == 5
    for r in body["results"]:
        assert "explanation" in r and r["explanation"]

    progress = client.get(f"/participants/{pid}/progress")
    assert progress.status_code == 200
    rows = [r for r in progress.json() if r["module_id"] == MODULE_ID]
    assert len(rows) == 1
    assert rows[0]["status"] == "completed"
    assert rows[0]["quiz_score"] == 100
