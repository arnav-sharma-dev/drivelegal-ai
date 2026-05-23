import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, Edit3, Eye, FileText, Send, HelpCircle } from 'lucide-react';
import { AppealGenerationResult } from '../types';
import { parseMarkdownToHTML } from '../utils/markdown';

interface AppealDraftPanelProps {
  appealResult: AppealGenerationResult;
  onUpdateContext: (context: string) => void;
  isGenerating: boolean;
}

export const AppealDraftPanel: React.FC<AppealDraftPanelProps> = ({ 
  appealResult, 
  onUpdateContext,
  isGenerating
}) => {
  const [tab, setTab] = useState<'preview' | 'edit'>('preview');
  const [editableMarkdown, setEditableMarkdown] = useState(appealResult.appeal_markdown);
  const [copied, setCopied] = useState(false);
  const [customContext, setCustomContext] = useState('');
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});

  // Sync state if backend updates the markdown
  useEffect(() => {
    setEditableMarkdown(appealResult.appeal_markdown);
  }, [appealResult.appeal_markdown]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([editableMarkdown], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `DriveLegal_Appeal_${appealResult.appeal_markdown.match(/Registration Number \*\*(.*?)\*\*/)?.[1] || 'Challan'}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleContextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customContext.trim().length > 0) {
      onUpdateContext(customContext);
    }
  };

  const toggleAction = (idx: number) => {
    setCheckedActions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div class="flex flex-col gap-6 w-full h-full">
      
      {/* Editor & Preview Header Controls */}
      <div class="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Toggle Mode Tabs */}
        <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-900 w-full sm:w-auto">
          <button
            onClick={() => setTab('preview')}
            class={`flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition duration-150 ${
              tab === 'preview'
                ? 'bg-brand-500 text-white shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye class="h-3.5 w-3.5" /> Preview Letter
          </button>
          <button
            onClick={() => setTab('edit')}
            class={`flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition duration-150 ${
              tab === 'edit'
                ? 'bg-brand-500 text-white shadow-glow-indigo'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 class="h-3.5 w-3.5" /> Edit Markdown
          </button>
        </div>

        {/* Action button bar */}
        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
          
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            class="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition duration-150"
            title="Copy draft to clipboard"
          >
            {copied ? (
              <>
                <Check class="h-3.5 w-3.5 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy class="h-3.5 w-3.5" /> Copy Letter
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            class="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-tr from-brand-600 to-indigo-500 hover:brightness-115 rounded-xl transition duration-150 shadow-glow-indigo"
            title="Download appeal as .md"
          >
            <Download class="h-3.5 w-3.5" /> Download (.md)
          </button>
        </div>

      </div>

      {/* Editor Content Area */}
      <div class="glass-panel rounded-3xl overflow-hidden border border-slate-900 flex-grow flex flex-col min-h-[450px]">
        {isGenerating ? (
          <div class="flex-grow flex flex-col items-center justify-center p-8 gap-3 text-center">
            <svg class="animate-spin h-10 w-10 text-brand-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div>
              <p class="text-sm font-bold text-white">Re-drafting Legal Argument...</p>
              <p class="text-xs text-slate-500 mt-1">Applying regulatory ground protocols and structuring prayer clauses</p>
            </div>
          </div>
        ) : tab === 'preview' ? (
          <div 
            class="flex-grow p-6 md:p-8 overflow-y-auto max-h-[500px] text-sm text-slate-300 prose prose-invert select-text"
            dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(editableMarkdown) }}
          />
        ) : (
          <div class="flex-grow flex flex-col h-full min-h-[400px]">
            <textarea
              value={editableMarkdown}
              onChange={(e) => setEditableMarkdown(e.target.value)}
              class="flex-grow w-full bg-slate-950/80 p-5 text-slate-200 font-mono text-xs focus:outline-none resize-none overflow-y-auto leading-relaxed border-0"
              placeholder="# Markdown format..."
              rows={25}
            ></textarea>
          </div>
        )}
      </div>

      {/* Manual Circumstantial Context Aggregator */}
      <div class="glass-panel p-5 rounded-2xl flex flex-col gap-3">
        <div>
          <h4 class="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            <FileText class="h-4 w-4 text-indigo-400" /> Inject Additional Case Circumstances
          </h4>
          <p class="text-xs text-slate-400 mt-0.5">Describe custom contexts (e.g. details of weather, road work, or speedometer readings) to enrich the appeal.</p>
        </div>
        
        <form onSubmit={handleContextSubmit} class="flex gap-2">
          <input
            type="text"
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
            placeholder="e.g. Speedometer showed exactly 60 km/h; road signs were covered by a heavy tree branch."
            class="flex-grow bg-slate-950 border border-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none transition duration-200"
          />
          <button
            type="submit"
            disabled={customContext.trim().length === 0}
            class="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-semibold text-indigo-400 hover:text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Update <Send class="h-3 w-3" />
          </button>
        </form>
      </div>

      {/* Submission Checklist */}
      <div class="glass-panel p-5 rounded-2xl flex flex-col gap-3 border border-slate-900">
        <h4 class="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
          📬 Filing & Representation Guidelines
        </h4>
        <div class="flex flex-col gap-2 mt-1">
          {appealResult.recommended_actions.map((action, idx) => (
            <div 
              key={idx}
              onClick={() => toggleAction(idx)}
              class="flex items-start gap-3 p-2.5 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 border border-slate-900 cursor-pointer transition duration-150"
            >
              <input
                type="checkbox"
                checked={!!checkedActions[idx]}
                onChange={() => {}} // Controlled manually by div click
                class="mt-1 h-3.5 w-3.5 rounded border-slate-800 bg-slate-950 text-brand-600 focus:ring-brand-500 focus:ring-offset-slate-900"
              />
              <span class={`text-xs leading-normal select-none ${checkedActions[idx] ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                {action}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
