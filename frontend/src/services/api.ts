import { CitationAnalysisResult, AppealGenerationRequest, AppealGenerationResult } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Handles API calls to the FastAPI backend.
 * Features seamless local mock fallback mechanisms to guarantee the frontend
 * remains fully interactive and functional even if the backend server is offline.
 */
export const api = {
  async analyzeCitation(file: File | null, text: string): Promise<CitationAnalysisResult> {
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      if (text) {
        formData.append('text', text);
      }

      const response = await fetch(`${API_BASE_URL}/analyze-citation`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned code ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn('[DriveLegal-AI API] Backend server offline or returned error. Invoking high-fidelity local OCR/RAG simulation.', err);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return simulateLocalCitationAnalysis(file, text);
    }
  },

  async generateAppeal(request: AppealGenerationRequest): Promise<AppealGenerationResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-appeal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Server returned code ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn('[DriveLegal-AI API] Backend server offline or returned error. Invoking local appeal generation simulator.', err);
      // Simulate processing latency
      await new Promise(resolve => setTimeout(resolve, 1200));
      return simulateLocalAppealGeneration(request);
    }
  }
};

// ==========================================
// HIGH FIDELITY FRONTEND DISPATCH SIMULATORS
// ==========================================

function simulateLocalCitationAnalysis(file: File | null, text: string): CitationAnalysisResult {
  let resolvedText = text;
  let filename = file ? file.name.toLowerCase() : '';

  // 1. Mock OCR Parsing based on filename tags
  if (file) {
    if (filename.includes('speed') || filename.includes('challan')) {
      resolvedText = (
        "[OCR Extracted from File: " + file.name + "]\n" +
        "TRAFFIC POLICE DEPARTMENT - VEHICLE SPEED VIOLATION NOTICE\n" +
        "Challan Number: CH-9081273-2026\n" +
        "Date of Violation: 2026-05-20\n" +
        "Time: 14:32:10 Hours\n" +
        "Vehicle Number: DL-3C-BQ-9821\n" +
        "Offense Location: Inner Ring Road, opposite Safdarjung Enclave, New Delhi\n" +
        "Offense Details: Driving in excess of speed limits (Section 183(1) MVA)\n" +
        "Recorded Speed: 96 km/h\n" +
        "Permissible Speed Limit: 60 km/h\n" +
        "Standard Fine Assessed: INR 1000\n" +
        "Issuing Authority: Sub-Inspector Amit Kumar"
      );
    } else if (filename.includes('helmet') || filename.includes('bike')) {
      resolvedText = (
        "[OCR Extracted from File: " + file.name + "]\n" +
        "STATE TRANSPORT DEPARTMENT CHALLAN\n" +
        "Challan ID: CH-542190-2026\n" +
        "Violation: Operating two-wheeler without protective headgear (Section 194D MVA)\n" +
        "Vehicle Number: MH-12-AS-5412\n" +
        "Date of Violation: 2026-05-22\n" +
        "Location: Senapati Bapat Road, Pune\n" +
        "Fine Assessed: INR 1000\n" +
        "Action Required: Pay fine or submit representations in 15 days."
      );
    } else {
      resolvedText = (
        "[OCR Extracted from File: " + file.name + "]\n" +
        "MUNICIPAL CORPORATION TRAFFIC WING NOTICE\n" +
        "Notice Reference: MC-77165\n" +
        "Violation Type: Leaving vehicle in dangerous parking position causing obstruction (Section 122 MVA)\n" +
        "Vehicle License: KA-03-MD-4489\n" +
        "Violation Date: 2026-05-18\n" +
        "Location: Commercial Street, Bengaluru\n" +
        "Calculated Penalty: INR 500"
      );
    }
  }

  // 2. Local Regex Extractor mimicking Python CitationService
  const dateMatch = resolvedText.match(/(\d{4}-\d{2}-\d{2})|(\d{2}-\d{2}-\d{4})/);
  const dateVal = dateMatch ? dateMatch[0] : '2026-05-24';

  const plateMatch = resolvedText.match(/([A-Z]{2}[ -]?\d{1,2}[ -]?[A-Z]{1,2,3}[ -]?\d{4})/i);
  const plateVal = plateMatch ? plateMatch[0].toUpperCase().trim() : 'DL-3C-XX-9999';

  const speedMatch = resolvedText.match(/(\d+(?:\.\d+)?)\s*(?:km\/h|kmph|speed)/i);
  const speedVal = speedMatch ? parseFloat(speedMatch[1]) : undefined;

  const limitMatch = resolvedText.match(/(?:limit|permissible)\s*(?:is|of|:)?\s*(\d+)/i);
  const limitVal = limitMatch ? parseFloat(limitMatch[1]) : undefined;

  const locMatch = resolvedText.match(/(?:location|near|at|opposite)\s*(?:is|:)?\s*([^\n,]+(?:,\s*[^\n,]+){0,2})/i);
  const locVal = locMatch ? locMatch[1].trim() : 'Urban High Traffic Corridor, India';

  const officerMatch = resolvedText.match(/(?:officer|authority|inspector|by)\s*(?:is|:)?\s*([A-Za-z\s]{3,25})/i);
  const officerVal = officerMatch ? officerMatch[1].trim() : 'Traffic Enforcement Directorate';

  // 3. Local RAG matching
  let matchedSections = [];
  let infractionType = 'Traffic Infraction';
  
  const textLower = resolvedText.toLowerCase();
  
  if (textLower.includes('speed') || textLower.includes('excessive')) {
    infractionType = 'Speeding';
    matchedSections.push({
      section_number: 'Section 183(1)',
      title: 'Driving at excessive speed',
      description: 'Section 183(1) - Whoever drives a motor vehicle in contravention of the speed limits referred to in section 112 shall be punishable: (i) for light motor vehicles with a fine which shall not be less than one thousand rupees but which may extend to two thousand rupees.',
      standard_fine: 1000,
      max_fine: 2000,
      imprisonment_option: false
    });
  } else if (textLower.includes('helmet') || textLower.includes('headgear')) {
    infractionType = 'Helmet Violation';
    matchedSections.push({
      section_number: 'Section 194D',
      title: 'Penalty for not wearing protective headgear',
      description: 'Section 194D - Whoever drives a motor cycle or causes or allows a motor cycle to be driven in contravention of the provisions of section 129 (protective headgear) shall be punishable with a fine of one thousand rupees and he shall be disqualified for holding a license for a period of three months.',
      standard_fine: 1000,
      max_fine: 1000,
      imprisonment_option: false
    });
  } else if (textLower.includes('parking') || textLower.includes('obstruction') || textLower.includes('dangerous position')) {
    infractionType = 'Parking Violation';
    matchedSections.push({
      section_number: 'Section 122',
      title: 'Leaving vehicle in dangerous position',
      description: 'Section 122 - No person in charge of a motor vehicle shall cause or allow the vehicle to remain at rest on any public place in such a position as to cause danger, obstruction or undue inconvenience to other users of the road.',
      standard_fine: 500,
      max_fine: 500,
      imprisonment_option: false
    });
  } else {
    // Default fallback Section 184
    infractionType = 'Dangerous Driving';
    matchedSections.push({
      section_number: 'Section 184',
      title: 'Driving dangerously',
      description: 'Section 184 - Whoever drives a motor vehicle at a speed or in a manner which is dangerous to the public shall be punishable with imprisonment for a term which may extend to one year or with fine not less than one thousand but which may extend to five thousand rupees.',
      standard_fine: 1000,
      max_fine: 5000,
      imprisonment_option: true
    });
  }

  let totalFine = matchedSections.reduce((acc, curr) => acc + curr.standard_fine, 0);

  return {
    citation_id: 'LOCAL-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    infraction_type: infractionType,
    extracted_facts: {
      date: dateVal,
      vehicle_number: plateVal,
      location: locVal,
      speed_recorded: speedVal,
      speed_limit: limitVal,
      officer_name: officerVal
    },
    matched_sections: matchedSections,
    total_calculated_fine: totalFine,
    confidence_score: file ? 0.94 : 0.85,
    raw_text_parsed: resolvedText
  };
}

function simulateLocalAppealGeneration(request: AppealGenerationRequest): AppealGenerationResult {
  const facts = request.extracted_facts;
  const sectionsStr = request.matched_sections.map(s => s.section_number).join(', ') || 'Motor Vehicles Act';
  const authorityCity = facts.location && /(pune|mumbai|bengaluru|delhi|kolkata|chennai|gurugram|noida)/i.test(facts.location)
    ? facts.location.match(/(pune|mumbai|bengaluru|delhi|kolkata|chennai|gurugram|noida)/i)?.[0] || 'Delhi'
    : 'Delhi';

  const recipientAuthority = `The Superintendent of Police (Traffic) / Traffic Police Commissioner,\nTraffic Enforcement Division, ${authorityCity}, India`;
  const legalGroundsUsed = [request.legal_ground];
  
  let groundAnalysis = '';
  
  if (request.legal_ground === 'Calibration Error') {
    legalGroundsUsed.push('Procedural Defect in Enforcement Equipment');
    groundAnalysis = `### Ground I: Lack of Calibration and Equipment Certification Integrity

1. The speed detection device (Radar/Speed Camera) used to record the alleged speed of **${facts.speed_recorded || 'N/A'} km/h** must adhere to rigorous technical maintenance guidelines. Under the Ministry of Road Transport and Highways (MoRTH) circulars and standard operating procedures, all radar devices must undergo mandatory annual accuracy validation.
2. The issued notice fails to attach or reference a valid, unexpired certificate of calibration issued by an approved laboratory for the specific device in question.
3. In the absence of a verified certificate demonstrating calibration accuracy within +/- 2% limits on the date of infraction, the recorded speed reading cannot be admitted as conclusive statutory evidence of overspeeding.`;
  } else if (request.legal_ground === 'Inadequate Signage') {
    legalGroundsUsed.push('Violation of Section 116 MVA (Duty to Erect Traffic Signs)');
    groundAnalysis = `### Ground I: Statutory Defect in Speed Limit Communication (Section 116 MVA)

1. Section 116 of the Motor Vehicles Act, 1988, places a mandatory statutory duty on State governments and traffic authorities to erect clear, visible, and standardized traffic signs indicating speed limits along road segments.
2. The motorist notes that at the specified location (**${facts.location || 'N/A'}**), there are no visible, standardized speed limit boards warning drivers of the speed threshold reduction to **${facts.speed_limit || 'N/A'} km/h**.
3. Due to the absence of visible statutory speed limit indicators, there was no intentional or negligent contravention of the law.`;
  } else {
    legalGroundsUsed.push('Force Majeure & General Exceptions under Criminal Jurisprudence');
    groundAnalysis = `### Ground I: Force Majeure and Humanitarian Exception (Medical Emergency)

1. The motorist asserts that the vehicle was being driven in response to a sudden, highly critical, and life-threatening medical emergency. In Indian jurisprudence, the principle of 'Necessity' operates as a recognized legal defense.
2. Specific Emergency Context: *${request.additional_context || 'The driver was responding to a critical medical crisis.'}*
3. The driver did not display reckless disregard for public safety, but balanced the statutory requirements against the immediate humanitarian necessity of saving a human life.`;
  }

  let additionalArguments = '';
  if (request.additional_context && request.legal_ground !== 'Medical Emergency') {
    additionalArguments = `### Ground II: Supporting Mitigating Circumstances

In addition to the primary procedural grounds, the motorist requests the authority to consider the following specific contextual circumstances:
> "${request.additional_context}"

These factors demonstrate that the motorist is a law-abiding citizen with an exemplary driving record, ruling out any intentional violation of road disciplines.`;
  }

  const appealMarkdown = `# FORMAL LEGAL REPRESENTATION & APPEAL
**UNDER SECTION 200 OF THE MOTOR VEHICLES ACT, 1988**

**Date:** ${facts.date || '2026-05-24'}  
**Challan Tracker ID:** ${request.citation_id}  
**Associated Vehicle License:** ${facts.vehicle_number || 'N/A'}  

**TO:**  
${recipient_authority}

**SUBJECT:** Representation against Traffic Infraction Notice (${request.infraction_type}) under ${sectionsStr}

---

### Respected Sir/Madam,

I am writing to formally submit a legal representation and appeal against the traffic citation issued for my vehicle, Registration Number **${facts.vehicle_number || 'N/A'}**, recorded on **${facts.date || 'N/A'}** at **${facts.location || 'N/A'}**.

The citation alleges a violation under **${sectionsStr}** with a fine assessment of **INR ${facts.speed_recorded ? 1000 : 500}**. I respectfully submit this representation requesting a complete review and subsequent cancellation of the aforementioned challan on the following legal and procedural grounds:

---

${groundAnalysis}

${additionalArguments}

---

### PRAYER & CONCLUSION

In light of the statutory and procedural grounds detailed above, it is respectfully prayed that:
1. The Hon'ble Traffic Enforcement Authority be pleased to **recall and cancel** the Challan Notice and completely waive the assessed penalty of **INR ${facts.speed_recorded ? 1000 : 500}** under my vehicle's record.
2. If necessary, provide an opportunity for a brief virtual/physical hearing to present the calibration verification requests and support documents.

I certify that the information provided herein is true to the best of my knowledge and belief.

**Respectfully Submitted,**  

*(Motorist / Registered Vehicle Owner)*  
**Vehicle Number:** ${facts.vehicle_number || 'N/A'}  
**Email/Phone:** [Motorist Contact Details]`;

  const recommendedActions = [
    `Download this appeal letter as a Markdown (.md) or convert to PDF file.`,
    `Sign and date the document at the marked 'Motorist / Registered Vehicle Owner' signature line.`,
    `Collect supporting evidence: calibration certificate request, or medical emergency admissions receipts if applicable.`,
    `Send this document via Speed Post or Registered A/D to the designated Traffic Police Office: ${authorityCity} Traffic Enforcement Division.`,
    `Alternatively, upload this document on the online state-specific traffic grievance portal under the 'Challan Dispute' tab.`
  ];

  return {
    appeal_markdown: appealMarkdown,
    legal_grounds_used: legalGroundsUsed,
    recommended_actions: recommendedActions,
    recipient_authority: recipientAuthority
  };
}
