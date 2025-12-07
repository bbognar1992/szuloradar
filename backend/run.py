#!/usr/bin/env python3
"""
Simple script to run the FastAPI application
"""
from pathlib import Path
from dotenv import load_dotenv

# Load .env file for local development (if it exists)
# In production, environment variables should be set in the platform
load_dotenv(Path(__file__).parent.parent / ".env")

import uvicorn
from config import settings

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    )

