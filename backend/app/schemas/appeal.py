from typing import Optional, List
from pydantic import BaseModel, Field
from app.schemas.citation import ExtractedFacts, MatchedMVSection

class AppealGenerationRequest(BaseModel):
    citation_id: str = Field(..., description="Unique generated analysis tracker ID")
    infraction_type: str = Field(..., description="Categorized traffic violation", examples=["Speeding"])
    extracted_facts: ExtractedFacts
    matched_sections: List[MatchedMVSection] = Field(default_factory=list)
    legal_ground: str = Field(..., description="The procedural defense to leverage", examples=["Calibration Error", "Inadequate Signage", "Medical Emergency"])
    additional_context: Optional[str] = Field(None, description="Custom circumstances inputted by the motorist", examples=["I was rushing my pregnant wife to the City General Hospital."])

class AppealGenerationResult(BaseModel):
    appeal_markdown: str = Field(..., description="AI-generated formal markdown appeal document")
    legal_grounds_used: List[str] = Field(..., description="Procedural and statutory grounds leveraged in the defense")
    recommended_actions: List[str] = Field(..., description="Steps the motorist should take to submit the appeal")
    recipient_authority: str = Field(..., description="Addressed Indian traffic or transport authority")
