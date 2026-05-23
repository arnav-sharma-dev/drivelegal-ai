from app.schemas.appeal import AppealGenerationRequest, AppealGenerationResult

class AppealService:
    """
    Asynchronously drafts highly structured, legally cited markdown appeal templates.
    Integrates facts, statutes, and selected procedural defense arguments to produce
    representation letters to RTOs/Traffic Commissioners.
    """
    async def generate_appeal(self, request: AppealGenerationRequest) -> AppealGenerationResult:
        facts = request.extracted_facts
        sections_str = ", ".join(s.section_number for s in request.matched_sections) or "Motor Vehicles Act"
        
        # 1. Determine authority and location
        authority_city = "Delhi"
        if facts.location:
            for city in ["Pune", "Mumbai", "Bengaluru", "Delhi", "Kolkata", "Chennai", "Gurugram", "Noida"]:
                if city.lower() in facts.location.lower():
                    authority_city = city
                    break
        recipient_authority = f"The Superintendent of Police (Traffic) / Traffic Police Commissioner,\nTraffic Enforcement Division, {authority_city}, India"

        # 2. Draft defense ground arguments
        ground_analysis = ""
        legal_grounds_used = [request.legal_ground]
        
        if request.legal_ground == "Calibration Error":
            legal_grounds_used.append("Procedural Defect in Enforcement Equipment")
            ground_analysis = (
                "### Ground I: Lack of Calibration and Equipment Certification Integrity\n\n"
                "1. The speed detection device (Radar/Speed Camera) used to record the alleged speed of "
                f"**{facts.speed_recorded or 'N/A'} km/h** must adhere to rigorous technical maintenance guidelines. "
                "Under the Ministry of Road Transport and Highways (MoRTH) circulars and standard operating procedures for speed enforcement, "
                "all radar devices and speed cameras must undergo mandatory annual calibration and accuracy validation.\n"
                "2. The issued notice fails to attach or reference a valid, unexpired certificate of calibration issued by an approved laboratory "
                "(e.g., National Physical Laboratory or designated NABL accrediting body) for the specific device in question.\n"
                "3. In the absence of a verified certificate demonstrating calibration accuracy within +/- 2% limits on the date of infraction, "
                "the recorded speed reading cannot be admitted as conclusive statutory evidence of overspeeding."
            )
        elif request.legal_ground == "Inadequate Signage":
            legal_grounds_used.append("Violation of Section 116 MVA (Duty to Erect Traffic Signs)")
            ground_analysis = (
                "### Ground I: Statutory Defect in Speed Limit Communication (Section 116 MVA)\n\n"
                f"1. Section 116 of the Motor Vehicles Act, 1988, places a mandatory statutory duty on State governments and "
                "traffic authorities to erect clear, visible, and standardized traffic signs indicating speed limits (Section 112) "
                f"along road segments.\n"
                f"2. The motorist notes that at the specified location (**{facts.location or 'N/A'}**), there are no visible, "
                "standardized speed limit boards or signs warning drivers of the speed threshold reduction to "
                f"**{facts.speed_limit or 'N/A'} km/h**.\n"
                "3. The Supreme Court of India and various High Courts have consistently held that traffic penalties cannot be "
                "sustained where the motorist is not provided fair, standardized visual notice of regulatory limitations. "
                "Due to the absence of visible statutory speed limit indicators, there was no intentional or negligent contravention of the law."
            )
        elif request.legal_ground == "Medical Emergency":
            legal_grounds_used.append("Force Majeure & General Exceptions under Criminal Jurisprudence")
            ground_analysis = (
                "### Ground I: Force Majeure and Humanitarian Exception (Medical Emergency)\n\n"
                "1. The motorist asserts that the vehicle was being driven in response to a sudden, highly critical, "
                "and life-threatening medical emergency. In Indian jurisprudence, the principle of 'Necessity' operates as a "
                "recognized legal defense where minor traffic infractions are committed to prevent grave and irreversible physical harm.\n"
                f"2. Specific Emergency Context: *{request.additional_context or 'The driver was responding to a critical medical crisis.'}*\n"
                "3. The driver did not display reckless disregard for public safety, but balanced the statutory requirements against "
                "the immediate humanitarian necessity of saving a human life. Under these exceptional circumstances, "
                "insisting on standard administrative penalties contradicts standard judicial discretion and public interest."
            )
        else:
            # Default ground
            ground_analysis = (
                f"### Ground I: Representation Against Procedural Inaccuracies\n\n"
                f"1. The motorist objects to the standard citation assessed under {sections_str}.\n"
                "2. The recorded facts do not conclusively prove negligent conduct or intent. We request that the "
                "enforcement authority review the raw capture footage, calibration parameters, and procedural context "
                "surrounding the incident."
            )

        # 3. Add secondary arguments if custom context is provided
        additional_arguments = ""
        if request.additional_context and request.legal_ground != "Medical Emergency":
            additional_arguments = (
                "### Ground II: Supporting Mitigating Circumstances\n\n"
                "In addition to the primary procedural grounds, the motorist requests the authority to consider the following "
                f"specific contextual circumstances surrounding the incident:\n"
                f"> \"{request.additional_context}\"\n\n"
                "These factors demonstrate that the motorist is a law-abiding citizen with an exemplary driving record, "
                "ruling out any intentional violation of road disciplines."
            )

        # 4. Construct complete markdown representation
        appeal_markdown = f"""# FORMAL LEGAL REPRESENTATION & APPEAL
**UNDER SECTION 200 OF THE MOTOR VEHICLES ACT, 1988**

**Date:** {facts.date or "2026-05-24"}  
**Challan Tracker ID:** {request.citation_id}  
**Associated Vehicle License:** {facts.vehicle_number or "N/A"}  

**TO:**  
{recipient_authority}

**SUBJECT:** Representation against Traffic Infraction Notice ({request.infraction_type}) under {sections_str}

---

### Respected Sir/Madam,

I am writing to formally submit a legal representation and appeal against the traffic citation issued for my vehicle, bearing Registration Number **{facts.vehicle_number or "N/A"}**, recorded on **{facts.date or "N/A"}** at **{facts.location or "N/A"}**.

The citation alleges a violation under **{sections_str}** with a fine assessment of **INR {facts.speed_recorded and 1000 or 500}**. I respectfully submit this representation requesting a complete review and subsequent cancellation of the aforementioned challan on the following legal and procedural grounds:

---

{ground_analysis}

{additional_arguments}

---

### PRAYER & CONCLUSION

In light of the statutory and procedural grounds detailed above, it is respectfully prayed that:
1. The Hon'ble Traffic Enforcement Authority be pleased to **recall and cancel** the Challan Notice and completely waive the assessed penalty of **INR {facts.speed_recorded and 1000 or 500}** under my vehicle's record.
2. If necessary, provide an opportunity for a brief virtual/physical hearing to present the calibration verification requests and support documents.

I certify that the information provided herein is true to the best of my knowledge and belief.

**Respectfully Submitted,**  

*(Motorist / Registered Vehicle Owner)*  
**Vehicle Number:** {facts.vehicle_number or "N/A"}  
**Email/Phone:** [Motorist Contact Details]  
"""

        # 5. Determine recommended motorist actions
        recommended_actions = [
            f"Download this appeal letter as a Markdown (.md) or convert to PDF file.",
            f"Sign and date the document at the marked 'Motorist / Registered Vehicle Owner' signature line.",
            f"Collect supporting evidence: calibration certificate request, or medical emergency admissions receipts if applicable.",
            f"Send this document via Speed Post or Registered A/D to the designated Traffic Police Office: {authority_city} Traffic Enforcement Division.",
            f"Alternatively, upload this document on the online state-specific traffic grievance portal (e.g., E-Challan Grievance website) under the 'Challan Dispute' tab."
        ]

        return AppealGenerationResult(
            appeal_markdown=appeal_markdown.strip(),
            legal_grounds_used=legal_grounds_used,
            recommended_actions=recommended_actions,
            recipient_authority=recipient_authority
        )

appeal_service = AppealService()
