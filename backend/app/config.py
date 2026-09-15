from functools import lru_cache
from typing import Literal

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: Literal["development", "test", "production"] = "development"
    database_url: str | None = None
    jwt_secret_key: str = "development-only-change-me"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    cors_origins: str = "http://localhost:3001,http://localhost:3003"
    auto_create_schema: bool = False
    sns_base_url: str | None = None
    sns_api_key: str | None = None
    sns_master_workflow_id: str | None = None
    sns_master_workflow_url: str | None = None
    sns_decision_workflow_id: str | None = None
    sns_negotiation_workflow_id: str | None = None
    sns_risk_workflow_id: str | None = None
    sns_callback_url: str | None = None
    sns_webhook_secret: str | None = None
    sns_webhook_signature_header: str = "X-SNS-Signature"
    sns_timeout_seconds: float = 15.0
    sns_execution_url_template: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @model_validator(mode="after")
    def validate_production_settings(self) -> "Settings":
        if self.app_env == "production":
            if not self.database_url or "localhost" in self.database_url or "127.0.0.1" in self.database_url:
                raise ValueError("DATABASE_URL must point to the deployed PostgreSQL/Supabase database in production")
            if len(self.jwt_secret_key) < 32 or self.jwt_secret_key in {"development-only-change-me", "change-me-in-production"}:
                raise ValueError("JWT_SECRET_KEY must be a strong production secret of at least 32 characters")
            if "*" in self.cors_origin_list:
                raise ValueError("CORS_ORIGINS cannot use '*' in production")
            if not self.cors_origin_list:
                raise ValueError("CORS_ORIGINS must contain at least one allowed origin in production")
        elif not self.database_url:
            self.database_url = "sqlite:///./prism-dev.db"
        return self

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
