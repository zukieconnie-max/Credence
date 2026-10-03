import React, { useRef } from 'react';
import { 
  FolderOpen, 
  X, 
  Download, 
  Upload, 
  Check, 
  Layers, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { BusinessPlan } from '../types/businessPlan';
import { AVAILABLE_TEMPLATES } from '../data/industryTemplates';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePlan: BusinessPlan;
  onSelectTemplate: (plan: BusinessPlan) => void;
  onImportPlan: (plan: BusinessPlan) => void;
}

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  activePlan,
  onSelectTemplate,
  onImportPlan,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activePlan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${activePlan.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_business_plan.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.loanRequest && parsed.entityInfo) {
          onImportPlan(parsed);
          onClose();
        } else {
          alert('Invalid plan file format: missing required loanRequest or entityInfo.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#162032]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Industry Templates & File Management
              </h2>
              <span className="text-[11px] text-slate-400">
                Pre-configured institutional lending models or load from disk
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Templates Grid */}
          <div className="space-y-3">
            <span className="font-semibold text-slate-300 text-xs block">
              Pre-Configured Commercial Banking Templates
            </span>
            <div className="grid grid-cols-1 gap-3">
              {AVAILABLE_TEMPLATES.map((tmpl) => {
                const isSelected = activePlan.templateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => {
                      onSelectTemplate(tmpl.data);
                      onClose();
                    }}
                    className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-950/20 border-amber-500/80 shadow-sm'
                        : 'bg-[#1e293b]/50 border-slate-800 hover:border-slate-700 hover:bg-[#1e293b]/80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 text-sm">
                          {tmpl.name}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400">
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isSelected ? (
                        <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1.5 text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 flex items-center gap-1"
                        >
                          <span>Load Model</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Backup / Export / Import */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="font-semibold text-slate-300 text-xs block">
              Dossier Backup & Archival (JSON Format)
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Plan as JSON</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Import Plan from JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex justify-end bg-[#162032]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
