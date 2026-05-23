from typing import Optional
from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from app.schemas.citation import CitationAnalysisResult
from app.services.citation_service import citation_service

router = APIRouter()

@router.post("/analyze-citation", response_model=CitationAnalysisResult)
async def analyze_citation(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None)
):
    """
    API endpoint accepting multi-part file upload (image/PDF) or a plain text string.
    Runs regex metadata extraction and vector RAG matching to detail traffic violations.
    """
    if not file and not text:
        raise HTTPException(
            status_code=400,
            detail="Bad Request: You must provide either an uploaded document file or raw citation text."
        )
    try:
        result = await citation_service.analyze_citation(file=file, text_input=text)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during citation analysis: {str(e)}"
        )
