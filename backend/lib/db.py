"""Shared Mongo handle — import `client`/`db` from here (server.py, routers, seed.py)."""

import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING, IndexModel

load_dotenv(Path(__file__).parent.parent / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

logger = logging.getLogger(__name__)

# One entry per collection: every field a route filters, sorts, or dedupes on. Applied by ensure_indexes() at startup.
INDEXES: dict[str, list[IndexModel]] = {
    "status_checks": [IndexModel([("timestamp", DESCENDING)], name="timestamp_desc")],
    "users": [
        IndexModel([("id", ASCENDING)], name="id", unique=True),
        IndexModel([("email", ASCENDING)], name="email", unique=True),
        IndexModel([("organization_id", ASCENDING), ("role", ASCENDING)], name="org_role"),
        IndexModel([("coach_id", ASCENDING)], name="coach"),
    ],
    "organizations": [IndexModel([("id", ASCENDING)], name="id", unique=True)],
    "cohorts": [
        IndexModel([("id", ASCENDING)], name="id", unique=True),
        IndexModel([("organization_id", ASCENDING)], name="org"),
    ],
    "training_modules": [
        IndexModel([("id", ASCENDING)], name="id", unique=True),
        IndexModel([("order", ASCENDING)], name="order"),
    ],
    "quizzes": [IndexModel([("module_id", ASCENDING)], name="module", unique=True)],
    "participant_progress": [
        IndexModel([("participant_id", ASCENDING), ("module_id", ASCENDING)], name="participant_module"),
    ],
    "job_search_logs": [
        IndexModel([("participant_id", ASCENDING), ("created_at", DESCENDING)], name="participant_created"),
    ],
    "resumes": [IndexModel([("participant_id", ASCENDING), ("created_at", DESCENDING)], name="participant_created")],
    "interview_sessions": [
        IndexModel([("id", ASCENDING)], name="id", unique=True),
        IndexModel([("participant_id", ASCENDING), ("created_at", DESCENDING)], name="participant_created"),
    ],
    "case_notes": [
        IndexModel([("participant_id", ASCENDING), ("created_at", DESCENDING)], name="participant_created"),
    ],
}


async def ensure_indexes() -> None:
    for collection, models in INDEXES.items():
        for model in models:  # one at a time so a bad spec skips only itself
            try:
                await db[collection].create_indexes([model])
            except Exception as exc:  # never block boot on an index; the log line names what to fix
                logger.error("ensure_indexes(%s.%s): %s", collection, model.document["name"], exc)
