from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.database import get_db
from app.models import User, UserRole
from app.schemas.auth import MessageResponse, SendOTPRequest, TokenResponse, VerifyOTPRequest
from app.services.otp import create_and_send_otp, verify_otp_code

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/send-otp", response_model=MessageResponse, summary="Send OTP to phone")
def send_otp(payload: SendOTPRequest, db: Session = Depends(get_db)):
    """
    Step 1 – Register or log in.

    - If the phone is new → creates a user record, sends OTP.
    - If the phone exists with the **same role** → resends OTP (login).
    - If the phone exists with a **different role** → 409 conflict.
    """
    user = db.query(User).filter(User.phone_number == payload.phone_number).first()

    if user:
        if user.role.value != payload.role:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"This phone is registered as '{user.role.value}', not '{payload.role}'.",
            )
    else:
        user = User(
            phone_number=payload.phone_number,
            role=UserRole(payload.role),
            name=payload.name,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    sent = create_and_send_otp(db, user)
    if not sent:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Failed to send OTP. Please try again.",
        )

    return {"message": f"OTP sent to {payload.phone_number}"}


@router.post("/verify-otp", response_model=TokenResponse, summary="Verify OTP and get token")
def verify_otp(payload: VerifyOTPRequest, db: Session = Depends(get_db)):
    """
    Step 2 – Verify the OTP received on phone.
    Returns a JWT access token on success.
    """
    user = db.query(User).filter(User.phone_number == payload.phone_number).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phone number not registered")

    valid = verify_otp_code(db, user, payload.code)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP",
        )

    # Mark user as verified
    user.is_verified = True
    db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(
        access_token=token,
        role=user.role.value,
        user_id=str(user.id),
        name=user.name,
    )
