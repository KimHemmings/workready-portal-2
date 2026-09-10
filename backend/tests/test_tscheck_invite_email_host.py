"""app_url() precedence regression: onboarding invite links must use the host configured in
backend/.env (APP_URL), never a UUID-form preview host, per invite_email.py's stale-preview
fallback logic.
"""

import re
import uuid

KIM_ADMIN_EMAIL = "kimh@straightuptraining.com"
MARCUS_ID = "user-coach-marcus"

EXPECTED_HOST = "https://workready-portal-2.preview.emergentagent.com"
UUID_HOST_RE = re.compile(r"^https?://[0-9a-f-]{36}\.preview\.emergentagent\.com")


def _login(client, email):
    r = client.post("/auth/login", json={"email": email, "password": "Training2026!"})
    assert r.status_code == 200, r.text
    return r.json()["id"]


def test_invite_email_link_uses_configured_host_not_uuid_preview(client):
    admin_id = _login(client, KIM_ADMIN_EMAIL)

    # Create a fresh learner to invite so we don't touch seeded rows. Deliberately left off any
    # coach roster (no coach_id) so it does not change Marcus's caseload count elsewhere.
    create = client.post(
        f"/admin/{admin_id}/users",
        json={
            "name": "Tscheck Invite Target",
            "email": f"tscheck-invite-{uuid.uuid4().hex[:8]}@hves.com.au",
            "role": "participant",
        },
    )
    assert create.status_code == 200, create.text
    new_user_id = create.json()["user"]["id"]

    r = client.post(f"/invite-email/{admin_id}/{new_user_id}")
    assert r.status_code == 200, r.text
    body = r.json()

    assert body["invite_url"].startswith(EXPECTED_HOST), (
        f"onboarding link host mismatch: {body['invite_url']!r} does not start with "
        f"{EXPECTED_HOST!r}"
    )
    assert not UUID_HOST_RE.match(body["invite_url"]), (
        f"onboarding link regressed to a UUID-form preview host: {body['invite_url']!r}"
    )
    assert body["status"] == "unavailable", (
        "RESEND_API_KEY is blank in backend/.env, so status should be 'unavailable' "
        f"(no email actually sent) — got {body['status']!r}"
    )
