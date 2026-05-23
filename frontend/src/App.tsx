import React, { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { CitationUploader } from './components/CitationUploader';
import { LegalAnalysisPanel } from './components/LegalAnalysisPanel';
import { AppealDraftPanel } from './components/AppealDraftPanel';
import { CitationAnalysisResult, AppealGenerationResult } from './types';
import { api } from './services/api';
import { AlertCircle, Scale } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<'upload' | 'analysis' | 'appeal'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [citationResult, setCitationResult] = useState<CitationAnalysisResult | null>(null);
  const [appealResult, setAppealResult] = useState<AppealGenerationResult | null>(null);
  const [activeGround, setActiveGround] = useState('Calibration Error');
  const [customContext, setCustomContext] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAnalyze = async (file: File | null, text: string) => {
    setIsAnalyzing(true);
    setErrorMessage('');
    try {
      // 1. Analyze Citation via API
      const analysis = await api.analyzeCitation(file, text);
      setCitationResult(analysis);
      setStep('analysis');

      // 2. Proactively generate initial appeal draft using default Calibration Error ground
      setIsGenerating(true);
      const appeal = await api.generateAppeal({
        citation_id: analysis.citation_id,
        infraction_type: analysis.infraction_type,
        extracted_facts: analysis.extracted_facts,
        matched_sections: analysis.matched_sections,
        legal_ground: 'Calibration Error',
        additional_context: ''
      });
      setAppealResult(appeal);
      setStep('appeal');
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during citation parsing. Please check your document and try again.');
    } finally {
      setIsAnalyzing(false);
      setIsGenerating(false);
    }
  };

  const handleGroundChange = async (ground: string) => {
    if (!citationResult) return;
    setActiveGround(ground);
    setIsGenerating(true);
    try {
      const appeal = await api.generateAppeal({
        citation_id: citationResult.citation_id,
        infraction_type: citationResult.infraction_type,
        extracted_facts: citationResult.extracted_facts,
        matched_sections: citationResult.matched_sections,
        legal_ground: ground,
        additional_context: customContext
      });
      setAppealResult(appeal);
    } catch (err: any) {
      console.error('Error modifying appeal defense strategy:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContextUpdate = async (context: string) => {
    if (!citationResult) return;
    setCustomContext(context);
    setIsGenerating(true);
    try {
      const appeal = await api.generateAppeal({
        citation_id: citationResult.citation_id,
        infraction_type: citationResult.infraction_type,
        extracted_facts: citationResult.extracted_facts,
        matched_sections: citationResult.matched_sections,
        legal_ground: activeGround,
        additional_context: context
      });
      setAppealResult(appeal);
    } catch (err: any) {
      console.error('Error updating case circumstances:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setCitationResult(null);
    setAppealResult(null);
    setActiveGround('Calibration Error');
    setCustomContext('');
    setErrorMessage('');
  };

  return (
    <DashboardLayout 
      activeStep={step} 
      onReset={handleReset} 
      challanAnalysed={!!citationResult}
    >
      {/* Upload Screen */}
      {step === 'upload' && (
        <div class="flex flex-col gap-6 w-full max-w-4xl mx-auto py-4">
          
          {/* Main Uploader widget */}
          <CitationUploader onAnalyze={handleAnalyze} isLoading={isAnalyzing} />

          {/* Core App Information Section */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            
            <div class="glass-panel p-5 rounded-2xl">
              <div class="h-9 w-9 rounded-lg bg-indigo-950/60 text-indigo-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 class="text-sm font-bold text-white mt-3">Smart OCR Parser</h4>
              <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                Automatically extracts registration dates, vehicle numbers, infraction speed metrics, and location metadata.
              </p>
            </div>

            <div class="glass-panel p-5 rounded-2xl">
              <div class="h-9 w-9 rounded-lg bg-indigo-950/60 text-indigo-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 class="text-sm font-bold text-white mt-3">LangChain RAG Core</h4>
              <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                Retrieves matching sections, penalty schedules, and judicial precedents from the Motor Vehicles Act database.
              </p>
            </div>

            <div class="glass-panel p-5 rounded-2xl">
              <div class="h-9 w-9 rounded-lg bg-indigo-950/60 text-indigo-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 class="text-sm font-bold text-white mt-3">Statutory Appeals</h4>
              <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                Drafts formal representations leveraging calibration limits, Section 116 sign boards, or emergency exceptions.
              </p>
            </div>

          </div>

          {errorMessage && (
            <div class="flex items-start gap-2.5 p-4 bg-rose-950/20 border border-rose-900/40 rounded-2xl text-xs text-rose-300">
              <AlertCircle class="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

        </div>
      )}

      {/* Split Analysis & Drafting Workspace */}
      {(step === 'analysis' || step === 'appeal') && citationResult && appealResult && (
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-full mt-2 items-start">
          
          {/* Left Panel: Legal Analysis */}
          <div class="w-full flex flex-col gap-6">
            <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">
              <Scale class="h-4 w-4 text-indigo-400" />
              <span>Challan Compliance Analyzer</span>
            </div>
            <LegalAnalysisPanel 
              result={citationResult} 
              activeGround={activeGround}
              onSelectGround={handleGroundChange}
            />
          </div>

          {/* Right Panel: Appeal Draft */}
          <div class="w-full flex flex-col gap-6">
            <div class="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">
              <span>AI Appeal Drafter & Editor</span>
              <span class="text-[10px] text-emerald-400 font-mono tracking-normal bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/20">
                Live Draft Ready
              </span>
            </div>
            <AppealDraftPanel 
              appealResult={appealResult}
              onUpdateContext={handleContextUpdate}
              isGenerating={isGenerating}
            />
          </div>

        </div>
      )}
    </DashboardLayout>
  );
}
