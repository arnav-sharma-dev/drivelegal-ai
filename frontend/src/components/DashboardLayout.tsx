import React from 'react';
import { Scale, ShieldCheck, FileText, HelpCircle, History } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeStep: 'upload' | 'analysis' | 'appeal';
  onReset: () => void;
  challanAnalysed: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeStep,
  onReset,
  challanAnalysed
}) => {
  return (
    <div class="min-h-screen bg-brand-950 flex flex-col font-sans text-slate-200">
      {/* Premium Ambient Glow in Background */}
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Brand Header */}
      <header class="border-b border-slate-900 bg-brand-950/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
            <div class="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-glow-indigo">
              <Scale class="h-5 w-5 text-white" />
            </div>
            <div>
              <span class="text-xl font-extrabold tracking-tight text-white font-display bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-300">
                DriveLegal<span class="text-indigo-400 font-medium font-sans text-sm ml-1 px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-900/50">AI</span>
              </span>
              <p class="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Indian Motorist Compliance Engine</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="hidden md:flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-3 py-1 rounded-full">
              <ShieldCheck class="h-3.5 w-3.5" />
              <span>Aligned with MV Act, 1988 (2019 Amendment)</span>
            </div>
            <button 
              onClick={onReset}
              class="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition duration-200"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <div class="max-w-7xl mx-auto w-full flex-grow flex flex-col lg:flex-row px-4 lg:px-8 py-6 gap-6 z-10">
        
        {/* Navigation Sidebar/Indicator Panel */}
        <aside class="w-full lg:w-64 flex flex-col gap-4 flex-shrink-0">
          <div class="glass-panel p-5 rounded-2xl flex flex-col gap-4">
            <h3 class="text-xs font-semibold text-slate-400 tracking-widest uppercase">Workflow Status</h3>
            <nav class="flex flex-col gap-2">
              
              {/* Step 1: Upload */}
              <div 
                class={`flex items-center gap-3 p-3 rounded-xl transition duration-200 ${
                  activeStep === 'upload' 
                    ? 'bg-brand-500/10 border border-brand-500/20 text-brand-300' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <div class={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  activeStep === 'upload' ? 'bg-brand-500 text-white shadow-glow-indigo' : 'bg-slate-900 border border-slate-800'
                }`}>
                  1
                </div>
                <div>
                  <p class="text-sm font-semibold">Upload Challan</p>
                  <p class="text-[10px] text-slate-500">File drop / Text area</p>
                </div>
              </div>

              {/* Step 2: Analysis */}
              <div 
                class={`flex items-center gap-3 p-3 rounded-xl transition duration-200 ${
                  activeStep === 'analysis' 
                    ? 'bg-brand-500/10 border border-brand-500/20 text-brand-300' 
                    : !challanAnalysed 
                      ? 'opacity-50 cursor-not-allowed text-slate-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 cursor-pointer'
                }`}
              >
                <div class={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  activeStep === 'analysis' ? 'bg-brand-500 text-white shadow-glow-indigo' : 'bg-slate-900 border border-slate-800'
                }`}>
                  2
                </div>
                <div>
                  <p class="text-sm font-semibold">Legal Breakdown</p>
                  <p class="text-[10px] text-slate-500">MVA clauses & fines</p>
                </div>
              </div>

              {/* Step 3: Appeal Draft */}
              <div 
                class={`flex items-center gap-3 p-3 rounded-xl transition duration-200 ${
                  activeStep === 'appeal' 
                    ? 'bg-brand-500/10 border border-brand-500/20 text-brand-300' 
                    : !challanAnalysed 
                      ? 'opacity-50 cursor-not-allowed text-slate-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 cursor-pointer'
                }`}
              >
                <div class={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  activeStep === 'appeal' ? 'bg-brand-500 text-white shadow-glow-indigo' : 'bg-slate-900 border border-slate-800'
                }`}>
                  3
                </div>
                <div>
                  <p class="text-sm font-semibold">Appeal Draft</p>
                  <p class="text-[10px] text-slate-500">Generate representation</p>
                </div>
              </div>

            </nav>
          </div>

          {/* Quick Legal Advisory Card */}
          <div class="glass-panel p-5 rounded-2xl bg-gradient-to-br from-indigo-950/20 to-brand-950 border border-slate-900/80">
            <div class="flex items-start gap-3">
              <FileText class="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 class="text-sm font-semibold text-white">Advisory Notice</h4>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                  Under Section 200 of the Indian Motor Vehicles Act, 1988, motorists have the statutory right to contest challans before they are forwarded to court. Submit representations early to avoid court hearings.
                </p>
              </div>
            </div>
          </div>
          
          {/* Quick Stats Panel */}
          <div class="glass-panel p-5 rounded-2xl flex flex-col gap-3">
            <h4 class="text-xs font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
              <History class="h-3.5 w-3.5 text-indigo-400" /> System Metrics
            </h4>
            <div class="grid grid-cols-2 gap-2 text-center">
              <div class="bg-slate-900/50 p-2.5 rounded-xl border border-slate-900">
                <span class="text-lg font-bold text-emerald-400">96.4%</span>
                <p class="text-[9px] text-slate-400">OCR Precision</p>
              </div>
              <div class="bg-slate-900/50 p-2.5 rounded-xl border border-slate-900">
                <span class="text-lg font-bold text-indigo-400">14 Secs</span>
                <p class="text-[9px] text-slate-400">Avg. Drafting</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Arena */}
        <main class="flex-grow flex flex-col min-w-0">
          {children}
        </main>

      </div>

      {/* Footer */}
      <footer class="border-t border-slate-900 mt-auto py-6 bg-brand-950/40 text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} DriveLegal-AI. Crafted for Indian Motorists under Motor Vehicles Act provisions.</span>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-slate-400 flex items-center gap-1"><HelpCircle class="h-3 w-3" /> Law Clauses</a>
            <a href="#" class="hover:text-slate-400">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
