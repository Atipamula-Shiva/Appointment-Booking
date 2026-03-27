import random
import string
from datetime import datetime, timedelta

from sqlalchemy.orm import Session
from twilio.rest import Client

from app.core.config import settings
from app.models import OTP, User


def generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


def send_otp_sms(phone_number: str, code: str) -> bool:
    """Send OTP via Twilio SMS. Returns True on success."""
    try:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=f"Your verification code is {code}. Valid for {settings.OTP_EXPIRE_MINUTES} minutes.",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number,
        )
        return True
    except Exception as e:
        print(f"[OTP] SMS send error: {e}")
        return False


def create_and_send_otp(db: Session, user: User) -> bool:
    """Generate OTP, persist it, send SMS. Replaces any existing OTP for the user."""
    code = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

    # Delete old OTP if present
    existing = db.query(OTP).filter(OTP.user_id == user.id).first()
    if existing:
        db.delete(existing)
        db.flush()

    otp = OTP(user_id=user.id, code=code, expires_at=expires_at)
    db.add(otp)
    db.commit()

    return send_otp_sms(user.phone_number, code)


def verify_otp_code(db: Session, user: User, code: str) -> bool:
    """Check the OTP code. Marks it used on success."""
    otp = db.query(OTP).filter(OTP.user_id == user.id).first()
    if not otp:
        return False
    if otp.is_used:
        return False
    if otp.expires_at < datetime.utcnow():
        return False
    if otp.code != code:
        return False

    otp.is_used = True
    db.commit()
    return True
