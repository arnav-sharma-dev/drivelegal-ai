import asyncio
import sys
import os

# Append current directory to path for absolute imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.citation_service import citation_service
from app.services.appeal_service import appeal_service
from app.schemas.appeal import AppealGenerationRequest

async def run_tests():
    print("==================================================")
    print("⚙️  STAGES 1 & 2: VERIFYING BACKEND IMPORT BINDINGS")
    print("==================================================")
    
    # 1. Test Text-based Citation Analysis
    print("\n🔍 Test 1: Simulating Speeding Citation Analysis...")
    sample_text = (
        "TRAFFIC POLICE NOTICE\n"
        "Date: 2026-05-20\n"
        "Vehicle No: DL-3C-AS-7788\n"
        "Overspeed limit clocked at 98 km/h in 60 km/h speed zone near Safdarjung, New Delhi.\n"
        "Standard Fine: 1000 INR"
    )
    
    result = await citation_service.analyze_citation(text_input=sample_text)
    
    print("✅ Analysis successfully completed!")
    print(f"   • Tracker ID: {result.citation_id}")
    print(f"   • Violation Type: {result.infraction_type}")
    print(f"   • Date Extracted: {result.extracted_facts.date}")
    print(f"   • Vehicle Number: {result.extracted_facts.vehicle_number}")
    print(f"   • Speed Extracted: {result.extracted_facts.speed_recorded} km/h (Limit: {result.extracted_facts.speed_limit} km/h)")
    print(f"   • Location Matched: {result.extracted_facts.location}")
    print(f"   • RAG Sections Found: {[s.section_number for s in result.matched_sections]}")
    print(f"   • Assessed Statutory Fine: INR {result.total_calculated_fine}")
    print(f"   • OCR Confidence Score: {result.confidence_score}")
    
    # Assertions
    assert result.infraction_type == "Speeding", "Error: Infraction mapping failed."
    assert result.extracted_facts.vehicle_number == "DL-3C-AS-7788", "Error: Plate number extraction failed."
    assert result.extracted_facts.speed_recorded == 98.0, "Error: Clocked speed extraction failed."
    
    # 2. Test Appeal Generation
    print("\n✍️  Test 2: Simulating Calibration Error Appeal Generation...")
    appeal_req = AppealGenerationRequest(
        citation_id=result.citation_id,
        infraction_type=result.infraction_type,
        extracted_facts=result.extracted_facts,
        matched_sections=result.matched_sections,
        legal_ground="Calibration Error",
        additional_context="Overspeed radar system on Ring Road reported heavy accuracy swings."
    )
    
    appeal_res = await appeal_service.generate_appeal(appeal_req)
    
    print("✅ Appeal generation successfully completed!")
    print(f"   • Addressed Authority: {appeal_res.recipient_authority}")
    print(f"   • Grounds Leveraged: {appeal_res.legal_grounds_used}")
    print(f"   • Notice Length: {len(appeal_res.appeal_markdown)} characters")
    
    # Assertions
    assert len(appeal_res.appeal_markdown) > 500, "Error: Appeal letter body too short."
    assert "Calibration" in appeal_res.appeal_markdown, "Error: Ground details missing from notice."
    
    print("\n==================================================")
    print("🎉 ALL BACKEND VERIFICATIONS COMPLETED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(run_tests())
