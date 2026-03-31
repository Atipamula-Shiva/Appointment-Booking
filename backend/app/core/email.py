import resend
from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY

async def send_email(to: str, subject: str, body: str):
    resend.Emails.send({
        "from": "Spotlo <noreply@support.spotlo.in>",
        "to": to,
        "subject": subject,
        "text": body
    })