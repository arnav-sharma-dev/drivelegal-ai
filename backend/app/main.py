import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for parsing traffic law infractions and generating motorist appeals",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set CORS origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include v1 Router API
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["System Control"])
async def root():
    """
    Health check and basic backend service information.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "api_documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting DriveLegal-AI Server...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
