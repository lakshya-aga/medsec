import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    database_url: str = "sqlite:///./medical_system.db"
    upload_dir: str = "uploads"
    reports_dir: str = "reports"
    
    class Config:
        env_file = ".env"

settings = Settings()