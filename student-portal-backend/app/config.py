from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = "Student Portal"
    database_url: str = "postgresql://postgres:postgres@localhost:5432/student_portal"
    secret_key: str = "secret-key-placeholder"
    access_token_expire_minutes: int = 60 * 24
    algorithm: str = "HS256"
    gemini_api_key: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

