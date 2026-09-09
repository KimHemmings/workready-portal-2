"""Provider Admin analytics KPIs and user management (invite + duplicate rejection + deactivate)."""
import uuid

ADMIN_ID = "user-admin-eleanor"


def test_admin_overview_kpis(client):
    resp = client.get(f"/admin/{ADMIN_ID}/overview")
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["total_participants"] >= 6
    assert body["total_coaches"] >= 1
    assert body["total_cohorts"] == 2
    assert isinstance(body["average_completion"], (int, float))
    assert len(body["module_engagement"]) == 5
    assert len(body["cohort_completion"]) == 2


def test_invite_new_user_added(client):
    suffix = uuid.uuid4().hex[:8]
    email = f"tscheck-invite-{suffix}@demo.au"
    resp = client.post(
        f"/admin/{ADMIN_ID}/users",
        json={"name": f"tscheck-user-{suffix}", "email": email, "role": "participant"},
    )
    assert resp.status_code == 200, resp.text
    created = resp.json()
    assert created["email"] == email
    assert created["status"] == "active"


def test_invite_duplicate_email_rejected(client):
    resp = client.post(
        f"/admin/{ADMIN_ID}/users",
        json={"name": "Duplicate Sarah", "email": "sarah@demo.au", "role": "participant"},
    )
    assert resp.status_code >= 400, (
        f"expected duplicate email to be rejected, got {resp.status_code}: {resp.text}"
    )


def test_deactivate_user_flips_status(client):
    suffix = uuid.uuid4().hex[:8]
    email = f"tscheck-deactivate-{suffix}@demo.au"
    created = client.post(
        f"/admin/{ADMIN_ID}/users",
        json={"name": f"tscheck-deact-{suffix}", "email": email, "role": "participant"},
    ).json()
    user_id = created["id"]
    assert created["status"] == "active"

    resp = client.patch(f"/admin/{ADMIN_ID}/users/{user_id}/status")
    assert resp.status_code == 200, resp.text
    assert resp.json()["status"] == "inactive"
