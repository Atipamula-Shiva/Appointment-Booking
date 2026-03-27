from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, UserRole
from app.core.security import create_access_token, decode_access_token, hash_password, verify_password, create_refresh_token
from app.schemas.auth_password import RegisterRequest, LoginRequest, RefreshRequest

router = APIRouter(prefix="/auth/password", tags=["Auth Password"])

@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_number == payload.username).first()

    if user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        phone_number=payload.username,
        password_hash=hash_password(payload.password),
        role=UserRole(payload.role),
        name=payload.name,
        is_verified=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({
        "sub": str(new_user.id),
        "role": new_user.role.value
    })

    refresh_token = create_refresh_token({
        "sub": str(new_user.id),
        "role": new_user.role.value
    })


    return {
        "access_token": token,
        "refresh_token": refresh_token,
        "role": new_user.role.value
    }

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_number == payload.username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.password_hash:
        raise HTTPException(status_code=400, detail="User registered via OTP. No password set.")

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({
        "sub": str(user.id),
        "role": user.role.value
    })

    refresh_token = create_refresh_token({
        "sub": str(user.id),
        "role": user.role.value
    })

    return {
        "access_token": token,
        "refresh_token": refresh_token,
        "role": user.role.value
    }



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