from fastapi import APIRouter
from app.api.v1.endpoints import citation, appeal

api_router = APIRouter()
api_router.include_router(citation.router, prefix="", tags=["Citation Analysis"])
api_router.include_router(appeal.router, prefix="", tags=["Appeal Generation"])
