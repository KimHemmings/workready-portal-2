"""Password hashing for the B2B sign-in flow (stdlib PBKDF2-HMAC-SHA256, no extra deps)."""

import hashlib
import hmac
import os
import secrets
import string
_ITERATIONS = 200_000


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _ITERATIONS)
    return f"pbkdf2_sha256${_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algo, iterations, salt_hex, digest_hex = stored.split("$")
        if algo != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256", password.encode(), bytes.fromhex(salt_hex), int(iterations)
        )
        return hmac.compare_digest(digest.hex(), digest_hex)
    except (ValueError, AttributeError):
        return False


def temporary_password() -> str:
    """Short, readable temporary password an admin can read out over the phone, e.g. Reset2026-XQ4T."""
    alphabet = string.ascii_uppercase + string.digits
    return f"Reset2026-{''.join(secrets.choice(alphabet) for _ in range(4))}"


def new_site_code(prefix: str = "SITE") -> str:
    """Short, human-readable registration code, e.g. SITE-7KQ4."""
    alphabet = string.ascii_uppercase + string.digits
    return f"{prefix}-{''.join(secrets.choice(alphabet) for _ in range(4))}"
