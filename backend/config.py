import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"

    # PayPal Sandbox
    PAYPAL_CLIENT_ID: str = ""
    PAYPAL_CLIENT_SECRET: str = ""
    PAYPAL_BASE_URL: str = "https://api-m.sandbox.paypal.com"
    PAYPAL_WEBHOOK_ID: str = ""

    # AI Keys
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""

    # AI Configuration
    AI_PROVIDER: str = "groq"
    GEMINI_MODEL: str = "gemini-1.5-flash"
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # Database (optional Supabase)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    # Application URLs
    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_URL: str = "http://localhost:8000"

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def is_paypal_configured(self) -> bool:
        cid = self.PAYPAL_CLIENT_ID.strip()
        sec = self.PAYPAL_CLIENT_SECRET.strip()
        return bool(cid and sec and "PASTE_" not in cid and "PASTE_" not in sec)

    @property
    def is_groq_configured(self) -> bool:
        key = self.GROQ_API_KEY.strip()
        return bool(key and "PASTE_" not in key)

    @property
    def is_gemini_configured(self) -> bool:
        key = self.GEMINI_API_KEY.strip()
        return bool(key and "PASTE_" not in key)

settings = Settings()
