from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas.profile import ProfileResponse, ProfileUpdate

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=ProfileResponse, summary="Get my profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return ProfileResponse(
        user_id=current_user.id,
        username=current_user.username,
        role=current_user.role.value,
    )


@router.patch("", response_model=ProfileResponse, summary="Update my profile")
def update_profile(
    payload: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.username:
        existing = db.query(User).filter(
            User.username == payload.username,
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = payload.username

    db.commit()
    db.refresh(current_user)
    return ProfileResponse(
        user_id=current_user.id,
        username=current_user.username,
        role=current_user.role.value,
    )