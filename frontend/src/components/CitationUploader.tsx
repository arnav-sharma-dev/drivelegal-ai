import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, Trash2, ArrowRight, Play, AlertCircle } from 'lucide-react';

interface CitationUploaderProps {
  onAnalyze: (file: File | null, text: string) => void;
  isLoading: boolean;
}

export const CitationUploader: React.FC<CitationUploaderProps> = ({ onAnalyze, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualText, setManualText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample templates for quick user validation
  const SAMPLES = [
    {
      label: '⚡ Overspeeding Challan (NH-8)',
      text: `TRAFFIC POLICE DEPARTMENT - VEHICLE SPEED VIOLATION NOTICE
Challan Number: CH-9081273-2026
Date of Violation: 2026-05-20
Time: 14:32:10 Hours
Vehicle Number: DL-3C-BQ-9821
Offense Location: Inner Ring Road, opposite Safdarjung Enclave, New Delhi
Offense Details: Driving in excess of speed limits (Section 183(1) MVA)
Recorded Speed: 96 km/h
Permissible Speed Limit: 60 km/h
Standard Fine Assessed: INR 1000
Issuing Authority: Sub-Inspector Amit Kumar`
    },
    {
      label: '🏍️ Helmet Violation (MH-12)',
      text: `STATE TRANSPORT DEPARTMENT CHALLAN
Challan ID: CH-542190-2026
Violation: Operating two-wheeler without protective headgear (Section 194D MVA)
Vehicle Number: MH-12-AS-5412
Date of Violation: 2026-05-22
Location: Senapati Bapat Road, Pune
Fine Assessed: INR 1000
Action Required: Pay fine or submit representations in 15 days.`
    },
    {
      label: '🚗 Obstruction / Wrong Parking',
      text: `MUNICIPAL CORPORATION TRAFFIC WING NOTICE
Notice Reference: MC-77165
Violation Type: Leaving vehicle in dangerous parking position causing obstruction (Section 122 MVA)
Vehicle License: KA-03-MD-4489
Violation Date: 2026-05-18
Location: Commercial Street, Bengaluru
Calculated Penalty: INR 500`
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
      
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setErrorMsg('');
      } else {
        setErrorMsg('Unsupported file format. Please upload a PDF or an Image (PNG, JPG, WebP).');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMsg('');
    }
  };

  const selectSample = (text: string) => {
    setSelectedFile(null);
    setManualText(text);
    setErrorMsg('');
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && manualText.trim().length === 0) {
      setErrorMsg('Please upload a challan document file or paste your citation text to proceed.');
      return;
    }
    setErrorMsg('');
    onAnalyze(selectedFile, manualText);
  };

  return (
    <div class="glass-panel p-6 rounded-3xl flex flex-col gap-6">
      
      {/* Heading */}
      <div>
        <h2 class="text-2xl font-extrabold text-white tracking-tight">Citation Document Processing</h2>
        <p class="text-sm text-slate-400 mt-1">
          Upload your traffic challan PDF, speed violation photo receipt, or paste the SMS citation content.
        </p>
      </div>

      <form onSubmit={handleSubmit} class="flex flex-col gap-6">
        
        {/* File Drag-and-Drop Arena */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          class={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition duration-300 ${
            dragActive 
              ? 'border-brand-500 bg-brand-950/40 shadow-glow-indigo' 
              : selectedFile
                ? 'border-emerald-500/50 bg-emerald-950/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
          }`}
          onClick={!selectedFile ? triggerUpload : undefined}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            class="hidden"
            accept=".pdf,image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
          />
          
          {selectedFile ? (
            <div class="flex flex-col items-center gap-3 w-full max-w-sm">
              <div class="h-14 w-14 rounded-2xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 shadow-glow-emerald">
                <FileText class="h-7 w-7" />
              </div>
              <div class="text-center">
                <p class="text-sm font-bold text-white truncate max-w-xs">{selectedFile.name}</p>
                <p class="text-xs text-slate-400 mt-0.5">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to Parse</p>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  class="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/30 rounded-lg transition duration-150"
                >
                  <Trash2 class="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div class="flex flex-col items-center gap-3">
              <div class="h-14 w-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300">
                <UploadCloud class="h-7 w-7" />
              </div>
              <div>
                <p class="text-sm font-bold text-slate-200">Drag and drop your citation file here</p>
                <p class="text-xs text-slate-400 mt-1">Accepts PDF and images (JPEG, PNG) up to 10MB</p>
              </div>
              <span class="mt-2 text-xs font-semibold text-indigo-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-850 hover:text-white transition duration-200">
                Select File
              </span>
            </div>
          )}
        </div>

        {/* Separator OR */}
        {!selectedFile && (
          <div class="flex items-center justify-center gap-3">
            <hr class="flex-grow border-slate-900" />
            <span class="text-xs text-slate-500 font-mono tracking-widest uppercase">OR</span>
            <hr class="flex-grow border-slate-900" />
          </div>
        )}

        {/* Text Input Block */}
        {!selectedFile && (
          <div class="flex flex-col gap-2">
            <label class="text-xs font-semibold text-slate-400 tracking-wider uppercase">Challan / SMS Plain Text Input</label>
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Paste the SMS citation notification or type the details of your traffic stop here..."
              rows={5}
              class="w-full bg-slate-950 border border-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition duration-200 resize-y"
            ></textarea>
          </div>
        )}

        {/* Error messaging */}
        {errorMsg && (
          <div class="flex items-start gap-2.5 p-3.5 bg-rose-950/20 border border-rose-900/40 rounded-xl text-xs text-rose-300">
            <AlertCircle class="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action triggers */}
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 border-t border-slate-900/60 pt-5">
          <div class="flex flex-col gap-1.5">
            <span class="text-[10px] text-slate-500 tracking-widest uppercase font-semibold">Test Presets for Demo validation</span>
            <div class="flex flex-wrap gap-2">
              {SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectSample(sample.text)}
                  class="text-[11px] font-medium text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-900/30 px-3 py-1.5 rounded-lg transition duration-150"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || (!selectedFile && manualText.trim().length === 0)}
            class="flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-indigo"
          >
            {isLoading ? (
              <>
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Parsing Citation...
              </>
            ) : (
              <>
                Analyze Violation <ArrowRight class="h-4 w-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
