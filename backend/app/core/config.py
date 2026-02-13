from __future__ import annotations

from functools import lru_cache
from typing import List

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    app_name: str = "linklens"
    database_url: str = Field(default="sqlite:///./data/linklens.db", env="DATABASE_URL")
    metadata_timeout: float = Field(default=5.0, env="METADATA_TIMEOUT")
    metadata_user_agent: str = Field(default="LinkLensMetadataBot/1.0", env="METADATA_USER_AGENT")
    enable_auth: bool = Field(default=False, env="ENABLE_AUTH")
    jwt_secret: str = Field(default="super-secret-change-me", env="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", env="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=60, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    cors_origins: List[str] = Field(default_factory=lambda: ["http://localhost:5173"], env="CORS_ORIGINS")
    default_user_email: str = Field(default="demo@example.com", env="DEFAULT_USER_EMAIL")
    default_user_password: str = Field(default="demo123", env="DEFAULT_USER_PASSWORD")
    debug: bool = Field(default=False, env="DEBUG")
    page_size_default: int = Field(default=10, env="PAGE_SIZE_DEFAULT")
    page_size_max: int = Field(default=50, env="PAGE_SIZE_MAX")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    # Normalize cors origins when provided as comma separated string
    if isinstance(settings.cors_origins, str):
        settings.cors_origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
    return settings
