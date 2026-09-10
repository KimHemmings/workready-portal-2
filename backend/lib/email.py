"""Transactional email via Resend, with graceful degradation.

If `RESEND_API_KEY` is not configured the send is reported as `unavailable` instead of raising, so
the UI can always fall back to the copyable magic link / mailto draft. No feature is ever blocked by
email configuration.
"""

import asyncio
import logging
import os

import resend

logger = logging.getLogger(__name__)

SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
SENDER_NAME = "Straight Up Training"

ROLE_LABEL = {
    "participant": "Learner",
    "coach": "Case Manager",
    "admin": "Provider",
    "owner": "System Admin",
}


def _api_key() -> str:
    return os.environ.get("RESEND_API_KEY", "").strip()


def email_configured() -> bool:
    return bool(_api_key())


def invite_subject() -> str:
    return "Welcome to Straight Up Training \u2013 Complete Your Account Setup"


def invite_text(user_name: str, role: str, org_name: str, link: str) -> str:
    """The onboarding copy, kept identical across email, mailto draft and on-screen preview."""
    return (
        f"Hi {user_name},\n\n"
        f"You have been invited to join Straight Up Training as a {ROLE_LABEL.get(role, role)} "
        f"by {org_name}.\n\n"
        "Through your dashboard, you can track training progress, complete mock interviews, and "
        "manage job search evidence submissions.\n\n"
        f"Get Started Here: {link}\n\n"
        "Best regards,\n"
        "The Straight Up Training Team"
    )


def invite_html(user_name: str, role: str, org_name: str, link: str) -> str:
    """Inline-CSS, table-based HTML so it renders in every mail client."""
    return f"""\
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 0;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;font-family:Helvetica,Arial,sans-serif;color:#18181b;">
      <tr><td style="font-size:20px;font-weight:bold;padding-bottom:8px;">Straight Up Training</td></tr>
      <tr><td style="font-size:16px;padding-bottom:16px;">Hi {user_name},</td></tr>
      <tr><td style="font-size:15px;line-height:1.6;padding-bottom:16px;">
        You have been invited to join Straight Up Training as a
        <strong>{ROLE_LABEL.get(role, role)}</strong> by <strong>{org_name}</strong>.
      </td></tr>
      <tr><td style="font-size:15px;line-height:1.6;padding-bottom:24px;">
        Through your dashboard, you can track training progress, complete mock interviews, and
        manage job search evidence submissions.
      </td></tr>
      <tr><td style="padding-bottom:24px;">
        <a href="{link}" style="background:#f97316;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:15px;font-weight:bold;display:inline-block;">Get Started Here</a>
      </td></tr>
      <tr><td style="font-size:13px;line-height:1.6;color:#52525b;padding-bottom:16px;">
        If the button does not work, copy this link into your browser:<br>
        <a href="{link}" style="color:#7c3aed;">{link}</a>
      </td></tr>
      <tr><td style="font-size:14px;line-height:1.6;">Best regards,<br>The Straight Up Training Team</td></tr>
    </table>
  </td></tr>
</table>"""


async def send_email(to: str, subject: str, html: str, text: str) -> tuple[str, str]:
    """Send one email. Returns (status, detail) where status is sent | unavailable | failed."""
    key = _api_key()
    if not key:
        return (
            "unavailable",
            "Email sending is not configured, so no email was sent. Use the copyable link or the "
            "mailto draft instead.",
        )
    resend.api_key = key
    params = {
        "from": f"{SENDER_NAME} <{SENDER_EMAIL}>",
        "to": [to],
        "subject": subject,
        "html": html,
        "text": text,
    }
    try:
        # The Resend SDK is synchronous — keep the FastAPI event loop free.
        result = await asyncio.to_thread(resend.Emails.send, params)
        return "sent", f"Email sent to {to} (id {result.get('id', 'unknown')})"
    except Exception as exc:  # noqa: BLE001 - never let email failure break user creation
        logger.error("Resend send failed for %s: %s", to, exc)
        return "failed", f"Resend could not send the email: {exc}"
