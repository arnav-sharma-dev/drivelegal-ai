export interface ExtractedFacts {
  date?: string;
  vehicle_number?: string;
  location?: string;
  speed_recorded?: number;
  speed_limit?: number;
  officer_name?: string;
}

export interface MatchedMVSection {
  section_number: string;
  title: string;
  description: string;
  standard_fine: number;
  max_fine: number;
  imprisonment_option: boolean;
}

export interface CitationAnalysisResult {
  citation_id: string;
  infraction_type: string;
  extracted_facts: ExtractedFacts;
  matched_sections: MatchedMVSection[];
  total_calculated_fine: number;
  confidence_score: number;
  raw_text_parsed: string;
}

export interface AppealGenerationRequest {
  citation_id: string;
  infraction_type: string;
  extracted_facts: ExtractedFacts;
  matched_sections: MatchedMVSection[];
  legal_ground: string;
  additional_context?: string;
}

export interface AppealGenerationResult {
  appeal_markdown: string;
  legal_grounds_used: string[];
  recommended_actions: string[];
  recipient_authority: string;
}
