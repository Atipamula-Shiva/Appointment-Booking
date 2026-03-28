from uuid import UUID
from pydantic import BaseModel


class ProfileResponse(BaseModel):
    user_id: UUID
    username: str | None = None
    role: str

    model_config = {"from_attributes": True}

class ProfileUpdate(BaseModel):
    username: str | None = None