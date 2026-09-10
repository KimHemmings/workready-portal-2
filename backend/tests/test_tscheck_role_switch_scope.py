"""Role switcher access control: only the System Admin (owner) may list role-switch targets;
any other role id must be rejected with 403 (criterion 6).
"""

OWNER_EMAIL = "admin@straightuptraining.com"
NON_OWNER_EMAIL = "marcus@hves.com.au"


def _login(client, email):
    r = client.post("/auth/login", json={"email": email, "password": "Training2026!"})
    assert r.status_code == 200, r.text
    return r.json()["id"]


def test_owner_can_list_role_switch_targets(client):
    owner_id = _login(client, OWNER_EMAIL)
    r = client.get(f"/role-switch/{owner_id}")
    assert r.status_code == 200, r.text
    roles = {t["role"] for t in r.json()}
    assert "owner" in roles
    # Every seeded role should have at least one live preview target.
    assert {"admin", "coach", "participant"}.issubset(roles), roles


def test_non_owner_role_switch_is_forbidden(client):
    coach_id = _login(client, NON_OWNER_EMAIL)
    r = client.get(f"/role-switch/{coach_id}")
    assert r.status_code == 403, (
        f"expected 403 for a non-owner requesting role-switch targets, got {r.status_code}: "
        f"{r.text}"
    )
