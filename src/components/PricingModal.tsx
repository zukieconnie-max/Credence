import React from 'react';
import { 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Landmark, 
  FileText, 
  Lock, 
  X, 
  Zap, 
  HelpCircle 
} from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPreview: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onOpenPreview,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-[#111827] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#162032]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-sans flex items-center gap-2">
                Transparent Institutional Pricing
              </h2>
              <p className="text-xs text-slate-400">
                Straightforward flat fee for institutional-grade commercial underwriting plans.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Content */}
        <div className="p-6 space-y-6">
          {/* Main Pricing Hero Card */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#162032] via-[#0f172a] to-[#162032] border-2 border-amber-500/50 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Full Commercial Underwriting Package
                </span>
                <h3 className="text-xl font-black text-slate-100 mt-1 font-sans">
                  Institutional Plan & Dossier
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete commercial bank loan application, 5-year pro-forma, covenants & certification.
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className="flex items-baseline gap-1 sm:justify-end">
                  <span className="text-4xl font-black text-amber-400 font-mono">$8</span>
                  <span className="text-xs text-slate-400 font-sans">USD</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                  Flat Fee · Per Plan · No Recurring Billing
                </span>
              </div>
            </div>

            {/* Inclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full 5-Year 3-Statement Model</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>OCC & SBA 7(a) SOP 50 10 7 Covenants</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>DSCR & Multi-Scenario Stress Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Collateral & Haircut Discount Valuation</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>High-Res SVG Charts & Amortization</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unwatermarked PDF Dossier Export</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI Commercial Loan Committee Review</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lifetime Plan Edits & Re-Exports</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPreview();
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Preview My Plan & Unlock for $8</span>
              </button>
            </div>
          </div>

          {/* Value Comparison / FAQ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#162032] rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Why a $8 Flat Fee?
              </span>
              <p className="text-slate-400 leading-relaxed">
                Traditional commercial advisors charge $1,500–$5,000 for bank underwriting dossiers. We provide institutional loan committee standards for an affordable flat fee of $8 per plan with zero monthly subscriptions.
              </p>
            </div>

            <div className="p-3 bg-[#162032] rounded-lg border border-slate-800 space-y-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                Preview Before You Pay
              </span>
              <p className="text-slate-400 leading-relaxed">
                You can write, edit, and test your financial projections completely free. Before paying, you inspect a full executive preview to verify every covenant and metric.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
