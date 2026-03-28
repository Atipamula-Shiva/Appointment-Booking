# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.core.email import send_email
# import random
# import string
# from datetime import datetime, timedelta
# from app.database import get_db
# from app.models import User, UserRole, OTPStore
# from app.core.security import create_access_token, decode_access_token, hash_password, verify_password, create_refresh_token
# from app.schemas.auth_password import RegisterRequest, LoginRequest, RefreshRequest
# from app.schemas.auth_password import (
#     RegisterRequest,
#     LoginRequest,
#     RefreshRequest,
#     VerifyEmailOTPRequest,      # ← add this
#     ForgotPasswordRequest,      # ← add this
#     ResetPasswordRequest,       # ← add this
#     ForgotUsernameRequest       # ← add this
# )
# router = APIRouter(prefix="/auth/password", tags=["Auth Password"])

# @router.post("/register")
# async def register(payload: RegisterRequest, db: Session = Depends(get_db)):
#     existing = db.query(User).filter(User.phone_number == payload.username).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="User already exists")

#     email_taken = db.query(User).filter(User.email == payload.email).first()
#     if email_taken:
#         raise HTTPException(status_code=400, detail="Email already in use")

#     new_user = User(
#         phone_number=payload.username,
#         password_hash=hash_password(payload.password),
#         role=UserRole(payload.role),
#         username=payload.username,
#         email=payload.email,
#         is_verified=False        # ← not verified yet
#     )

#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     otp = generate_otp()
#     store_otp(db, payload.email, otp, purpose="register")
#     await send_email(
#         to=payload.email,
#         subject="Verify your account",
#         body=f"Your OTP is: {otp}. It expires in 10 minutes."
#     )

#     return {"message": "OTP sent to your email. Please verify to activate your account."}  # ← NO tokens here

# @router.post("/login")
# def login(payload: LoginRequest, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.phone_number == payload.username).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     if not user.password_hash:
#         raise HTTPException(status_code=400, detail="User registered via OTP. No password set.")

#     if not verify_password(payload.password, user.password_hash):
#         raise HTTPException(status_code=400, detail="Invalid credentials")

#     token = create_access_token({
#         "sub": str(user.id),
#         "role": user.role.value
#     })

#     refresh_token = create_refresh_token({
#         "sub": str(user.id),
#         "role": user.role.value
#     })

#     return {
#         "access_token": token,
#         "refresh_token": refresh_token,
#         "role": user.role.value
#     }



# @router.post("/refresh")
# def refresh_token(payload: RefreshRequest):
#     decoded = decode_access_token(payload.refresh_token)

#     if not decoded:
#         raise HTTPException(status_code=401, detail="Invalid refresh token")

#     new_access_token = create_access_token({
#         "sub": decoded["sub"],
#         "role": decoded["role"]
#     })

#     return {"access_token": new_access_token}


# # def generate_otp(length: int = 6) -> str:
# #     return ''.join(random.choices(string.digits, k=length))

# def generate_otp(length: int = 6) -> str:
#     return ''.join(random.choices(string.digits, k=length))


# # def store_otp(db: Session, email: str, otp: str, purpose: str):
# #     """Store OTP with 10-minute expiry. Overwrites existing OTP for same email+purpose."""
# #     existing = db.query(OTPStore).filter(
# #         OTPStore.email == email,
# #         OTPStore.purpose == purpose
# #     ).first()

# #     expiry = datetime.utcnow() + timedelta(minutes=10)

# #     if existing:
# #         existing.otp = otp
# #         existing.expires_at = expiry
# #         existing.is_used = False
# #     else:
# #         db.add(OTPStore(email=email, otp=otp, purpose=purpose, expires_at=expiry))

# #     db.commit()

# def store_otp(db: Session, email: str, otp: str, purpose: str):
#     existing = db.query(OTPStore).filter(
#         OTPStore.email == email,
#         OTPStore.purpose == purpose
#     ).first()

#     expiry = datetime.utcnow() + timedelta(minutes=10)

#     if existing:
#         existing.otp = otp
#         existing.expires_at = expiry
#         existing.is_used = False
#     else:
#         db.add(OTPStore(email=email, otp=otp, purpose=purpose, expires_at=expiry))

#     db.commit()

# def verify_otp(db: Session, email: str, otp: str, purpose: str) -> bool:
#     record = db.query(OTPStore).filter(
#         OTPStore.email == email,
#         OTPStore.otp == otp,
#         OTPStore.purpose == purpose,
#         OTPStore.is_used == False
#     ).first()

#     if not record:
#         return False
#     if record.expires_at < datetime.utcnow():
#         return False

#     record.is_used = True
#     db.commit()
#     return True


# # ── Register (Step 1: Send OTP) ───────────────────────────────────────────────

# @router.post("/register")
# def register(payload: RegisterRequest, db: Session = Depends(get_db)):
#     """
#     Registers user but marks as unverified.
#     Sends OTP to email for verification.
#     """
#     existing = db.query(User).filter(User.phone_number == payload.username).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="User already exists")

#     email_taken = db.query(User).filter(User.email == payload.email).first()
#     if email_taken:
#         raise HTTPException(status_code=400, detail="Email already in use")

#     new_user = User(
#         phone_number=payload.username,
#         password_hash=hash_password(payload.password),
#         role=UserRole(payload.role),
#         username=payload.username,
#         email=payload.email,       # ← email instead of name
#         is_verified=False          # ← not verified yet
#     )

#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     otp = generate_otp()
#     store_otp(db, payload.email, otp, purpose="register")
#     send_email(
#         to=payload.email,
#         subject="Verify your account",
#         body=f"Your OTP is: {otp}. It expires in 10 minutes."
#     )

#     return {"message": "OTP sent to email. Please verify to activate your account."}


# # ── Register (Step 2: Verify OTP) ─────────────────────────────────────────────

# @router.post("/register/verify")
# def verify_registration(payload: VerifyEmailOTPRequest, db: Session = Depends(get_db)):
#     """Verifies OTP and activates the account. Returns tokens on success."""
#     user = db.query(User).filter(User.email == payload.email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     if user.is_verified:
#         raise HTTPException(status_code=400, detail="Account already verified")

#     if not verify_otp(db, payload.email, payload.otp, purpose="register"):
#         raise HTTPException(status_code=400, detail="Invalid or expired OTP")

#     user.is_verified = True
#     db.commit()

#     token = create_access_token({"sub": str(user.id), "role": user.role.value})
#     refresh_token = create_refresh_token({"sub": str(user.id), "role": user.role.value})

#     return {
#         "access_token": token,
#         "refresh_token": refresh_token,
#         "role": user.role.value
#     }


# # ── Login (No OTP required) ───────────────────────────────────────────────────

# @router.post("/login")
# def login(payload: LoginRequest, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.phone_number == payload.username).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     if not user.is_verified:
#         raise HTTPException(status_code=403, detail="Account not verified. Please verify your email first.")

#     if not user.password_hash:
#         raise HTTPException(status_code=400, detail="User registered via OTP. No password set.")

#     if not verify_password(payload.password, user.password_hash):
#         raise HTTPException(status_code=400, detail="Invalid credentials")

#     token = create_access_token({"sub": str(user.id), "role": user.role.value})
#     refresh_token = create_refresh_token({"sub": str(user.id), "role": user.role.value})

#     return {
#         "access_token": token,
#         "refresh_token": refresh_token,
#         "role": user.role.value
#     }


# # ── Forgot Password (Step 1: Send OTP) ───────────────────────────────────────

# @router.post("/forgot-password")
# def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.email == payload.email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="No account linked to this email")

#     otp = generate_otp()
#     store_otp(db, payload.email, otp, purpose="reset_password")
#     send_email(
#         to=payload.email,
#         subject="Reset your password",
#         body=f"Your OTP is: {otp}. It expires in 10 minutes."
#     )

#     return {"message": "OTP sent to email for password reset."}


# # ── Forgot Password (Step 2: Reset with OTP) ──────────────────────────────────

# @router.post("/reset-password")
# def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
#     if not verify_otp(db, payload.email, payload.otp, purpose="reset_password"):
#         raise HTTPException(status_code=400, detail="Invalid or expired OTP")

#     user = db.query(User).filter(User.email == payload.email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     user.password_hash = hash_password(payload.new_password)
#     db.commit()

#     return {"message": "Password reset successful. You can now log in."}


# # ── Forgot Username (Step 1: Send OTP) ───────────────────────────────────────

# @router.post("/forgot-username")
# def forgot_username(payload: ForgotUsernameRequest, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.email == payload.email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="No account linked to this email")

#     otp = generate_otp()
#     store_otp(db, payload.email, otp, purpose="forgot_username")
#     send_email(
#         to=payload.email,
#         subject="Retrieve your username",
#         body=f"Your OTP is: {otp}. It expires in 10 minutes."
#     )

#     return {"message": "OTP sent to email."}


# # ── Forgot Username (Step 2: Verify OTP and return username) ─────────────────

# @router.post("/forgot-username/verify")
# def verify_forgot_username(payload: VerifyEmailOTPRequest, db: Session = Depends(get_db)):
#     if not verify_otp(db, payload.email, payload.otp, purpose="forgot_username"):
#         raise HTTPException(status_code=400, detail="Invalid or expired OTP")

#     user = db.query(User).filter(User.email == payload.email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     return {"username": user.username}


# # ── Refresh Token ─────────────────────────────────────────────────────────────

# @router.post("/refresh")
# def refresh_token(payload: RefreshRequest):
#     decoded = decode_access_token(payload.refresh_token)

#     if not decoded:
#         raise HTTPException(status_code=401, detail="Invalid refresh token")

#     new_access_token = create_access_token({
#         "sub": decoded["sub"],
#         "role": decoded["role"]
#     })

#     return {"access_token": new_access_token}



import random
import string
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserRole, OTPStore
from app.core.security import create_access_token, decode_access_token, hash_password, verify_password, create_refresh_token
from app.core.email import send_email
from app.schemas.auth_password import (
    RegisterRequest,
    LoginRequest,
    RefreshRequest,
    VerifyEmailOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ForgotUsernameRequest
)

router = APIRouter(prefix="/auth/password", tags=["Auth Password"])


# ── Helpers ───────────────────────────────────────────────────────────────────

def generate_otp(length: int = 6) -> str:
    return ''.join(random.choices(string.digits, k=length))


def store_otp(db: Session, email: str, otp: str, purpose: str):
    existing = db.query(OTPStore).filter(
        OTPStore.email == email,
        OTPStore.purpose == purpose
    ).first()

    expiry = datetime.utcnow() + timedelta(minutes=10)

    if existing:
        existing.otp = otp
        existing.expires_at = expiry
        existing.is_used = False
    else:
        db.add(OTPStore(email=email, otp=otp, purpose=purpose, expires_at=expiry))

    db.commit()


def verify_otp(db: Session, email: str, otp: str, purpose: str) -> bool:
    record = db.query(OTPStore).filter(
        OTPStore.email == email,
        OTPStore.otp == otp,
        OTPStore.purpose == purpose,
        OTPStore.is_used == False
    ).first()

    if not record:
        return False
    if record.expires_at < datetime.utcnow():
        return False

    record.is_used = True
    db.commit()
    return True


# ── Register ──────────────────────────────────────────────────────────────────

@router.post("/register")
async def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.phone_number == payload.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    email_taken = db.query(User).filter(User.email == payload.email).first()
    if email_taken:
        raise HTTPException(status_code=400, detail="Email already in use")

    new_user = User(
        phone_number=payload.username,
        password_hash=hash_password(payload.password),
        role=UserRole(payload.role),
        username=payload.username,
        email=payload.email,
        is_verified=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    otp = generate_otp()
    store_otp(db, payload.email, otp, purpose="register")
    await send_email(
        to=payload.email,
        subject="Verify your account",
        body=f"Your OTP is: {otp}. It expires in 10 minutes."
    )

    return {"message": "OTP sent to your email. Please verify to activate your account."}


@router.post("/register/verify")
async def verify_registration(payload: VerifyEmailOTPRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        raise HTTPException(status_code=400, detail="Account already verified")

    if not verify_otp(db, payload.email, payload.otp, purpose="register"):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user.is_verified = True
    db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    refresh_token = create_refresh_token({"sub": str(user.id), "role": user.role.value})

    return {
        "Account Created Successfully"
    }


# ── Login ─────────────────────────────────────────────────────────────────────

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_number == payload.username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Account not verified. Please verify your email first.")

    if not user.password_hash:
        raise HTTPException(status_code=400, detail="User registered via OTP. No password set.")

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    refresh_token = create_refresh_token({"sub": str(user.id), "role": user.role.value})

    return {
        "access_token": token,
        "refresh_token": refresh_token,
        "role": user.role.value
    }


# ── Forgot Password ───────────────────────────────────────────────────────────

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No account linked to this email")

    otp = generate_otp()
    store_otp(db, payload.email, otp, purpose="reset_password")
    await send_email(                             # ← async + await
        to=payload.email,
        subject="Reset your password",
        body=f"Your OTP is: {otp}. It expires in 10 minutes."
    )

    return {"message": "OTP sent to email for password reset."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    if not verify_otp(db, payload.email, payload.otp, purpose="reset_password"):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = hash_password(payload.new_password)
    db.commit()

    return {"message": "Password reset successful. You can now log in."}


# ── Forgot Username ───────────────────────────────────────────────────────────

@router.post("/forgot-username")
async def forgot_username(payload: ForgotUsernameRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No account linked to this email")

    otp = generate_otp()
    store_otp(db, payload.email, otp, purpose="forgot_username")
    await send_email(                             # ← async + await
        to=payload.email,
        subject="Retrieve your username",
        body=f"Your OTP is: {otp}. It expires in 10 minutes."
    )

    return {"message": "OTP sent to email."}


@router.post("/forgot-username/verify")
def verify_forgot_username(payload: VerifyEmailOTPRequest, db: Session = Depends(get_db)):
    if not verify_otp(db, payload.email, payload.otp, purpose="forgot_username"):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"username": user.username}


# ── Refresh Token ─────────────────────────────────────────────────────────────

@router.post("/refresh")
def refresh_token(payload: RefreshRequest):
    decoded = decode_access_token(payload.refresh_token)

    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token = create_access_token({
        "sub": decoded["sub"],
        "role": decoded["role"]
    })

    return {"access_token": new_access_token}