from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7 
    
    TWILIO_ACCOUNT_SID: str
    TWILIO_AUTH_TOKEN: str
    TWILIO_PHONE_NUMBER: str

    OTP_EXPIRE_MINUTES: int = 10

    RESEND_API_KEY: str        # ← replaces all MAIL_* fields
    MAIL_FROM: str

    class Config:
        env_file = ".env"


settings = Settings()
