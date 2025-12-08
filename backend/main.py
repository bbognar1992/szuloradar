from pathlib import Path
from dotenv import load_dotenv

# Load .env file for local development (if it exists)
# In production, environment variables should be set in the platform
load_dotenv(Path(__file__).parent.parent / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import auth, users, places, interactions, recommendations

# Create FastAPI app
# Note: Database tables are created via Alembic migrations (run in start.sh)
app = FastAPI(
    title="SzülőRadar API",
    description="API for kid-friendly places discovery application",
    version="1.0.0"
)

# CORS middleware - MUST be added before routes
# Get CORS origins from settings
cors_origins = settings.get_cors_origins()
if not isinstance(cors_origins, list):
    cors_origins = []

# Only add localhost URLs in development mode (not in production)
if settings.debug:
    for port in [3000, 3001]:
        origin = f"http://localhost:{port}"
        if origin not in cors_origins:
            cors_origins.append(origin)

# Remove backend URL if accidentally included
cors_origins = [origin for origin in cors_origins if origin and not origin.endswith(':8000')]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(places.router)
app.include_router(interactions.router)
app.include_router(recommendations.router)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to SzülőRadar API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )

