"""Regression check for the {points:1} MongoDB projections added to job_search_logs queries in
participant.py (dashboard pbas_points) and coach.py (roster pbas_points). The projection must not
drop the "points" field or otherwise break the sum.

Sarah has a small monthly job-search-log cap (20), so every log this file creates is deleted in a
teardown to keep the check rerun-safe without ever touching her pre-existing seeded logs.
"""

import os
import uuid

import pymongo
import pytest

SARAH_ID = "user-participant-sarah"
MARCUS_ID = "user-coach-marcus"

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "app")


@pytest.fixture
def created_log_ids():
    ids = []
    yield ids
    if ids:
        mongo = pymongo.MongoClient(MONGO_URL)
        mongo[DB_NAME].job_search_logs.delete_many({"id": {"$in": ids}})
        mongo.close()


def _create_log(client, created_log_ids, application_type="Online application"):
    body = {
        "employer_name": f"tscheck-employer-{uuid.uuid4().hex[:8]}",
        "position_title": "Warehouse Assistant",
        "application_date": "2026-01-15",
        "application_type": application_type,
        "notes": "tscheck regression log",
    }
    r = client.post(f"/participants/{SARAH_ID}/job-logs", json=body)
    assert r.status_code == 200, r.text
    doc = r.json()
    created_log_ids.append(doc["id"])
    return doc


def test_dashboard_pbas_points_sum_includes_new_log(client, created_log_ids):
    before = client.get(f"/participants/{SARAH_ID}/dashboard")
    assert before.status_code == 200, before.text
    points_before = before.json()["pbas_points"]

    created = _create_log(client, created_log_ids, "Interview attended")  # worth 20 points
    assert created["points"] == 20

    after = client.get(f"/participants/{SARAH_ID}/dashboard")
    assert after.status_code == 200, after.text
    points_after = after.json()["pbas_points"]

    assert points_after == points_before + 20, (
        f"expected +20 points from projection-backed sum, got before={points_before} "
        f"after={points_after}"
    )


def test_coach_roster_pbas_points_matches_dashboard(client, created_log_ids):
    _create_log(client, created_log_ids, "Phone enquiry")  # worth 5 points

    dashboard = client.get(f"/participants/{SARAH_ID}/dashboard")
    assert dashboard.status_code == 200, dashboard.text
    dashboard_points = dashboard.json()["pbas_points"]

    roster = client.get(f"/coaches/{MARCUS_ID}/roster")
    assert roster.status_code == 200, roster.text
    rows = [r for r in roster.json() if r["participant"]["id"] == SARAH_ID]
    assert rows, "Sarah should appear on Marcus's roster"

    assert rows[0]["pbas_points"] == dashboard_points, (
        f"roster projection sum {rows[0]['pbas_points']} != dashboard sum {dashboard_points}"
    )
