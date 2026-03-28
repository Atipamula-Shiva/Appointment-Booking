from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    username: str
    password: str
    role: str
    email: EmailStr 


class LoginRequest(BaseModel):
    username: str
    password: str
    role: str

class RefreshRequest(BaseModel):
    refresh_token: str

class VerifyEmailOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class ForgotUsernameRequest(BaseModel):
    email: EmailStr