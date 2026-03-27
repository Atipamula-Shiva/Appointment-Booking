from pydantic import BaseModel, field_validator
import re


def validate_phone(v: str) -> str:
    """Accept E.164 format: +91XXXXXXXXXX"""
    pattern = r"^\+[1-9]\d{7,14}$"
    if not re.match(pattern, v):
        raise ValueError("Phone must be in E.164 format e.g. +919876543210")
    return v


# ── Request schemas ───────────────────────────────────────

class SendOTPRequest(BaseModel):
    phone_number: str
    role: str           # "shop_owner" | "customer"
    name: str | None = None

    @field_validator("phone_number")
    @classmethod
    def check_phone(cls, v):
        return validate_phone(v)

    @field_validator("role")
    @classmethod
    def check_role(cls, v):
        if v not in ("shop_owner", "customer"):
            raise ValueError("role must be 'shop_owner' or 'customer'")
        return v


class VerifyOTPRequest(BaseModel):
    phone_number: str
    code: str

    @field_validator("phone_number")
    @classmethod
    def check_phone(cls, v):
        return validate_phone(v)


# ── Response schemas ──────────────────────────────────────

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    name: str | None


class MessageResponse(BaseModel):
    message: str
