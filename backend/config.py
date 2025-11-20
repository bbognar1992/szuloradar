from pydantic_settings import BaseSettings
from typing import List, Union
from pathlib import Path


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
    
    class Config:
        # Load .env from project root (one level up from backend/)
        env_file = str(Path(__file__).parent.parent / ".env")
        case_sensitive = False
    
    def get_cors_origins(self) -> List[str]:
        """Parse CORS origins from string or list"""
        if isinstance(self.cors_origins, str):
            # Parse comma-separated string
            return [origin.strip() for origin in self.cors_origins.split(",")]
        return self.cors_origins


settings = Settings()

