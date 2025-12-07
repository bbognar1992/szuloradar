from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union


class Settings(BaseSettings):
    # Database
    database_url: str
    
    # JWT
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Application
    debug: bool = True
    cors_origins: Union[List[str], str] = ["http://localhost:3001", "http://localhost:8000"]
    
    model_config = SettingsConfigDict(
        # Use OS environment variables only (not .env file)
        # For local development, load .env file using python-dotenv or export variables
        # For production (Vercel, etc.), set environment variables in platform config
        case_sensitive=False,
        extra="ignore"  # Ignore extra environment variables that aren't defined in Settings
    )
    
    def get_cors_origins(self) -> List[str]:
        """Parse CORS origins from string or list"""
        if isinstance(self.cors_origins, str):
            # Parse comma-separated string
            return [origin.strip() for origin in self.cors_origins.split(",")]
        return self.cors_origins


settings = Settings()

