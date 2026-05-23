import React from 'react';
import { Calendar, Car, MapPin, Gauge, ShieldAlert, Award, CreditCard, ChevronRight } from 'lucide-react';
import { CitationAnalysisResult } from '../types';

interface LegalAnalysisPanelProps {
  result: CitationAnalysisResult;
  activeGround: string;
  onSelectGround: (ground: string) => void;
}

export const LegalAnalysisPanel: React.FC<LegalAnalysisPanelProps> = ({ 
  result,
  activeGround,
  onSelectGround
}) => {
  const { extracted_facts: facts, matched_sections: sections, total_calculated_fine: fine, confidence_score: confidence } = result;

  // Legal appeal procedural grounds options based on the infraction type
  const DEFENSE_GROUNDS = [
    {
      id: 'Calibration Error',
      name: '⚙️ Calibration Error',
      desc: 'Challenge the radar/speed gun calibration accuracy and certification date.'
    },
    {
      id: 'Inadequate Signage',
      name: '⚠️ Inadequate Signage',
      desc: 'Verify if visible, standardized regulatory speed boards were absent at the location (Section 116 MVA).'
    },
    {
      id: 'Medical Emergency',
      name: '🏥 Medical Emergency',
      desc: 'Request humanitarian relief due to life-safety urgency or medical transport.'
    }
  ];

  return (
    <div class="flex flex-col gap-6 w-full">
      
      {/* Overview Card */}
      <div class="glass-panel p-5 rounded-2xl border-l-4 border-l-indigo-500">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[9px] text-indigo-400 font-mono tracking-widest uppercase font-semibold">Classification</span>
            <h3 class="text-xl font-black text-white mt-0.5 tracking-tight font-display">{result.infraction_type} Infraction</h3>
          </div>
          <div class="text-right">
            <span class="text-[9px] text-slate-400 font-mono tracking-widest uppercase font-semibold">Challan Ref</span>
            <p class="text-xs font-mono font-bold text-slate-200 mt-0.5">{result.citation_id}</p>
          </div>
        </div>
      </div>

      {/* Extracted Challan Facts Grid */}
      <div class="glass-panel p-5 rounded-2xl flex flex-col gap-4">
        <h4 class="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-900 pb-2">
          <Car class="h-3.5 w-3.5 text-indigo-400" /> Extracted Citation Facts
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Fact: Date */}
          <div class="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
            <Calendar class="h-4.5 w-4.5 text-indigo-400 flex-shrink-0" />
            <div>
              <p class="text-[10px] text-slate-500 font-mono uppercase font-semibold">Date of Incident</p>
              <p class="text-xs font-bold text-slate-200 mt-0.5">{facts.date || 'Not detected'}</p>
            </div>
          </div>

          {/* Fact: Vehicle */}
          <div class="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
            <Car class="h-4.5 w-4.5 text-indigo-400 flex-shrink-0" />
            <div>
              <p class="text-[10px] text-slate-500 font-mono uppercase font-semibold">License Plate</p>
              <p class="text-xs font-mono font-bold text-slate-200 mt-0.5">{facts.vehicle_number || 'Not detected'}</p>
            </div>
          </div>

          {/* Fact: Location */}
          <div class="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-900/60 sm:col-span-2">
            <MapPin class="h-4.5 w-4.5 text-indigo-400 flex-shrink-0" />
            <div class="min-w-0">
              <p class="text-[10px] text-slate-500 font-mono uppercase font-semibold">Location</p>
              <p class="text-xs font-bold text-slate-200 mt-0.5 truncate">{facts.location || 'Not detected'}</p>
            </div>
          </div>

          {/* Fact: Speed Params if Speeding */}
          {facts.speed_recorded && (
            <div class="flex items-center gap-3 bg-indigo-950/20 p-3 rounded-xl border border-indigo-900/20 sm:col-span-2">
              <Gauge class="h-5 w-5 text-indigo-400 flex-shrink-0" />
              <div class="flex-grow flex items-center justify-between">
                <div>
                  <p class="text-[10px] text-indigo-400 font-mono uppercase font-semibold">Overspeeding Index</p>
                  <p class="text-xs text-slate-300 mt-0.5">
                    Clocked <strong class="text-white font-bold">{facts.speed_recorded} km/h</strong> in a <strong class="text-white">{facts.speed_limit} km/h</strong> zone.
                  </p>
                </div>
                <div class="text-right">
                  <span class="text-[10px] px-1.5 py-0.5 bg-rose-950/60 text-rose-400 rounded-md font-mono border border-rose-900/30">
                    +{Math.round((facts.speed_recorded / (facts.speed_limit || 1) - 1) * 100)}% over
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Indian Motor Vehicles Act Matched Sections */}
      <div class="glass-panel p-5 rounded-2xl flex flex-col gap-4">
        <h4 class="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-900 pb-2">
          <ShieldAlert class="h-3.5 w-3.5 text-indigo-400" /> Matched Motor Vehicles Act Clauses
        </h4>
        <div class="flex flex-col gap-3">
          {sections.map((section, idx) => (
            <div key={idx} class="p-3.5 bg-slate-900/60 rounded-xl border border-slate-900/80 flex flex-col gap-2">
              <div class="flex items-start justify-between gap-2">
                <span class="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900 text-xs font-mono font-bold">
                  {section.section_number}
                </span>
                <span class="text-xs text-slate-300 font-semibold">{section.title}</span>
              </div>
              <p class="text-[11px] text-slate-400 leading-relaxed italic bg-slate-950/30 p-2 rounded">
                "{section.description}"
              </p>
              
              {/* Statutory Fines Breakdown */}
              <div class="flex items-center justify-between text-[11px] border-t border-slate-900/80 pt-2 mt-1">
                <span class="text-slate-500">Fine Scale:</span>
                <span class="text-slate-300 font-mono">
                  INR {section.standard_fine} (Standard) — Up to <strong class="text-slate-200">INR {section.max_fine}</strong>
                </span>
              </div>
              
              {section.imprisonment_option && (
                <div class="mt-1 px-2 py-0.5 bg-rose-950/20 border border-rose-900/20 text-rose-400 text-[9px] rounded-md font-semibold tracking-wide uppercase self-start">
                  ⚠️ Includes Custody / Imprisonment Option
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic statutory fine and OCR confidence panel */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Fine Assessed */}
        <div class="glass-panel p-4 rounded-xl flex items-center gap-3">
          <div class="h-10 w-10 rounded-lg bg-emerald-950/40 text-emerald-400 flex items-center justify-center">
            <CreditCard class="h-5 w-5" />
          </div>
          <div>
            <span class="text-[9px] text-slate-500 uppercase font-mono tracking-wider font-semibold">Standard Fine Assessed</span>
            <p class="text-lg font-black text-emerald-400 font-mono">₹ {fine}</p>
          </div>
        </div>

        {/* Confidence Score */}
        <div class="glass-panel p-4 rounded-xl flex items-center gap-3">
          <div class="h-10 w-10 rounded-lg bg-indigo-950/40 text-indigo-400 flex items-center justify-center">
            <Award class="h-5 w-5" />
          </div>
          <div>
            <span class="text-[9px] text-slate-500 uppercase font-mono tracking-wider font-semibold">Extraction Confidence</span>
            <div class="flex items-center gap-1.5 mt-0.5">
              <div class="w-16 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  class="h-full bg-indigo-500 rounded-full shadow-glow-indigo" 
                  style={{ width: `${confidence * 100}%` }}
                ></div>
              </div>
              <span class="text-xs font-mono font-bold text-indigo-400">{(confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Select Appeal Ground Strategy Trigger */}
      <div class="glass-panel p-5 rounded-2xl flex flex-col gap-3 bg-gradient-to-br from-indigo-950/10 to-brand-950 border border-slate-900">
        <div>
          <h4 class="text-sm font-bold text-white tracking-tight">Select Procedural Defense Ground</h4>
          <p class="text-xs text-slate-400 mt-0.5">Customize your appeal letter strategy based on the procedural facts.</p>
        </div>
        
        <div class="flex flex-col gap-2 mt-1">
          {DEFENSE_GROUNDS.map((ground) => (
            <button
              key={ground.id}
              onClick={() => onSelectGround(ground.id)}
              class={`flex items-start justify-between gap-3 text-left p-3 rounded-xl transition duration-200 border ${
                activeGround === ground.id
                  ? 'bg-brand-500/10 border-brand-500/40 text-white shadow-glow-indigo'
                  : 'bg-slate-950/50 hover:bg-slate-950 border-slate-900 hover:border-slate-850 text-slate-300'
              }`}
            >
              <div class="min-w-0">
                <span class="text-xs font-bold block">{ground.name}</span>
                <span class="text-[10px] text-slate-400 mt-0.5 block leading-normal">{ground.desc}</span>
              </div>
              <ChevronRight class={`h-4 w-4 mt-0.5 flex-shrink-0 ${activeGround === ground.id ? 'text-indigo-400' : 'text-slate-600'}`} />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
