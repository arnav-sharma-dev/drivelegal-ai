from fastapi import APIRouter, HTTPException
from app.schemas.appeal import AppealGenerationRequest, AppealGenerationResult
from app.services.appeal_service import appeal_service

router = APIRouter()

@router.post("/generate-appeal", response_model=AppealGenerationResult)
async def generate_appeal(request: AppealGenerationRequest):
    """
    API endpoint generating standard Indian traffic appeal notices.
    Processes facts and statutory defense points into a customizable markdown document.
    """
    try:
        result = await appeal_service.generate_appeal(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during legal appeal generation: {str(e)}"
        )
