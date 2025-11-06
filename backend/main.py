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

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

