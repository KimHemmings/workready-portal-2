"""Seat-limit enforcement (criterion 7): a provider with a coach_seat_limit of 1 must accept
exactly one Case Manager invite and reject the next with 409. Uses a fresh isolated provider org
so it never touches the shared Hunter Valley Employment Services seat counts. The org and its
users are removed in a teardown so reruns don't accumulate orgs.
"""

import os
import uuid

import pymongo
import pytest

OWNER_EMAIL = "admin@straightuptraining.com"

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "app")


def _login(client, email):
    r = client.post("/auth/login", json={"email": email, "password": "Training2026!"})
    assert r.status_code == 200, r.text
    return r.json()["id"]


def test_coach_seat_limit_blocks_second_invite(client):
    owner_id = _login(client, OWNER_EMAIL)
    suffix = uuid.uuid4().hex[:8]
    org_name = f"Tscheck Seat Test Org {suffix}"

    try:
        provider = client.post(
            f"/owner/{owner_id}/providers",
            json={
                "organization_name": org_name,
                "admin_name": "Tscheck Provider Admin",
                "admin_email": f"tscheck-provideradmin-{suffix}@example.com",
                "coach_seat_limit": 1,
                "participant_seat_limit": 1,
            },
        )
        assert provider.status_code == 200, provider.text
        admin_id = provider.json()["user"]["id"]

        first_coach = client.post(
            f"/admin/{admin_id}/users",
            json={
                "name": "Tscheck First Coach",
                "email": f"tscheck-coach1-{suffix}@example.com",
                "role": "coach",
            },
        )
        assert first_coach.status_code == 200, first_coach.text

        second_coach = client.post(
            f"/admin/{admin_id}/users",
            json={
                "name": "Tscheck Second Coach",
                "email": f"tscheck-coach2-{suffix}@example.com",
                "role": "coach",
            },
        )
        assert second_coach.status_code == 409, (
            f"expected 409 seat-limit rejection for the 2nd coach invite against a 1-seat org, "
            f"got {second_coach.status_code}: {second_coach.text}"
        )
        assert "seat" in second_coach.json()["detail"].lower()
    finally:
        mongo = pymongo.MongoClient(MONGO_URL)
        mongo[DB_NAME].organizations.delete_many({"name": org_name})
        mongo[DB_NAME].users.delete_many({"email": {"$regex": f"tscheck-.*{suffix}"}})
        mongo.close()
