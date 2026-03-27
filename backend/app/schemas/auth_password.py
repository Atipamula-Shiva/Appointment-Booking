from pydantic import BaseModel

class RegisterRequest(BaseModel):
    username: str
    password: str
    role: str
    name: str | None = None


class LoginRequest(BaseModel):
    username: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str