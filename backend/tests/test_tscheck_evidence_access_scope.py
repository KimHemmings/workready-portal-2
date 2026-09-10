"""Evidence scope regression: coach sees only their caseload, admin sees their org, owner sees
everything, and a participant is blocked entirely (criteria 3 & 4).
"""

MARCUS_ID = "user-coach-marcus"          # coach, Hunter Valley
KIM_ADMIN_ID = None                       # resolved at runtime
OWNER_ID = None
SARAH_ID = "user-participant-sarah"       # on Marcus's caseload


def _find_id(client, email):
    r = client.post("/auth/login", json={"email": email, "password": "Training2026!"})
    assert r.status_code == 200, r.text
    return r.json()["id"]


def test_coach_sees_only_own_caseload(client):
    r = client.get(f"/evidence/{MARCUS_ID}")
    assert r.status_code == 200, r.text
    body = r.json()
    learner_ids = {row["learner_id"] for row in body["rows"]}
    # Every learner on this coach's evidence list must actually be one of Marcus's own caseload.
    for lid in learner_ids:
        roster_check = client.get(f"/coaches/{MARCUS_ID}/participants/{lid}")
        assert roster_check.status_code == 200, (
            f"learner {lid} appeared in coach evidence but is not in {MARCUS_ID}'s caseload: "
            f"{roster_check.text}"
        )


def test_admin_sees_wider_org_scope_than_coach(client):
    admin_id = _find_id(client, "kimh@straightuptraining.com")
    assert admin_id, "could not resolve Straight Up Admin user id via GET /users"

    coach_view = client.get(f"/evidence/{MARCUS_ID}")
    admin_view = client.get(f"/evidence/{admin_id}")
    assert coach_view.status_code == 200 and admin_view.status_code == 200

    coach_learners = {row["learner_id"] for row in coach_view.json()["rows"]}
    admin_learners = {row["learner_id"] for row in admin_view.json()["rows"]}
    # Admin (provider) scope must be a superset of (or equal to, if org has one coach) the coach's.
    assert coach_learners.issubset(admin_learners), (
        f"admin evidence scope missing learners visible to the coach: "
        f"{coach_learners - admin_learners}"
    )


def test_owner_sees_everything(client):
    owner_id = _find_id(client, "admin@straightuptraining.com")
    assert owner_id, "could not resolve System Admin user id via GET /users"
    admin_id = _find_id(client, "kimh@straightuptraining.com")

    owner_view = client.get(f"/evidence/{owner_id}")
    admin_view = client.get(f"/evidence/{admin_id}")
    assert owner_view.status_code == 200 and admin_view.status_code == 200

    admin_learners = {row["learner_id"] for row in admin_view.json()["rows"]}
    owner_learners = {row["learner_id"] for row in owner_view.json()["rows"]}
    assert admin_learners.issubset(owner_learners), (
        f"owner evidence scope missing learners visible to the admin: "
        f"{admin_learners - owner_learners}"
    )


def test_participant_is_forbidden_from_evidence_endpoint(client):
    r = client.get(f"/evidence/{SARAH_ID}")
    assert r.status_code == 403, (
        f"expected 403 for a learner calling the evidence review endpoint, got {r.status_code}: "
        f"{r.text}"
    )
