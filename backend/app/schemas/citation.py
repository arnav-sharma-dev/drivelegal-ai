from typing import Optional, List
from pydantic import BaseModel, Field

class ExtractedFacts(BaseModel):
    date: Optional[str] = Field(None, description="Date of infraction (YYYY-MM-DD)", examples=["2026-05-20"])
    vehicle_number: Optional[str] = Field(None, description="Indian vehicle license plate number", examples=["DL-3C-AS-1234"])
    location: Optional[str] = Field(None, description="Location where infraction occurred", examples=["Outer Ring Road, New Delhi"])
    speed_recorded: Optional[float] = Field(None, description="Recorded vehicle speed (km/h)", examples=["92.5"])
    speed_limit: Optional[float] = Field(None, description="Speed limit in the specified zone (km/h)", examples=["70.0"])
    officer_name: Optional[str] = Field(None, description="Issuing officer/authority name or ID", examples=["Traffic Sub-Inspector Sharma"])

class MatchedMVSection(BaseModel):
    section_number: str = Field(..., description="Indian Motor Vehicles Act Section identifier", examples=["Section 183(1)"])
    title: str = Field(..., description="Legal heading of the offense", examples=["Driving at excessive speed"])
    description: str = Field(..., description="Formal legal breakdown of the section", examples=["Whoever drives a motor vehicle in contravention of speed limits..."])
    standard_fine: int = Field(..., description="Standard fine amount in INR", examples=[1000])
    max_fine: int = Field(..., description="Maximum statutory fine ceiling in INR", examples=[2000])
    imprisonment_option: bool = Field(False, description="Whether the section includes jail time as an option")

class CitationAnalysisResult(BaseModel):
    citation_id: str = Field(..., description="Unique generated analysis tracker ID")
    infraction_type: str = Field(..., description="Categorized traffic violation", examples=["Speeding"])
    extracted_facts: ExtractedFacts
    matched_sections: List[MatchedMVSection] = Field(default_factory=list)
    total_calculated_fine: int = Field(..., description="Cumulative fine assessed in INR", examples=[1000])
    confidence_score: float = Field(..., description="AI text/OCR extraction parsing confidence", examples=[0.94])
    raw_text_parsed: str = Field(..., description="Raw text parsed or OCR extracted from uploaded citation")
