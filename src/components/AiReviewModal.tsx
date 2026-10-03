import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  Loader2,
  BookmarkCheck
} from 'lucide-react';
import { BusinessPlan, ComputedMetrics, UnderwriterReview } from '../types/businessPlan';

interface AiReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: BusinessPlan;
  metrics: ComputedMetrics;
  onSaveReview: (review: UnderwriterReview) => void;
}

export const AiReviewModal: React.FC<AiReviewModalProps> = ({
  isOpen,
  onClose,
  plan,
  metrics,
  onSaveReview,
}) => {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<UnderwriterReview | null>(plan.underwriterReview || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const runCreditReview = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/ai/credit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessPlan: {
            ...plan,
            computedMetrics: metrics,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const newReview: UnderwriterReview = {
        overallRating: data.overallRating || 'Conditional Approval / Moderate Risk',
        underwriterScore: data.underwriterScore || 78,
        executiveSummary: data.executiveSummary || '',
        keyStrengths: data.keyStrengths || [],
        keyWeaknesses: data.keyWeaknesses || [],
        recommendedCovenants: data.recommendedCovenants || [],
        sensitivityStressVerdict: data.sensitivityStressVerdict || '',
        reviewedAt: new Date().toISOString(),
        aiNotice: data.aiNotice,
      };

      setReview(newReview);
      onSaveReview(newReview);
    } catch (err: any) {
      console.error('Error requesting AI underwriter review:', err);
      setErrorMsg(err.message || 'Failed to complete credit underwriting review.');
    } finally {
      setLoading(false);
    }
  };

  const getRatingBadge = (rating: string) => {
    if (rating.includes('Approved') || rating.includes('Low')) {
      return 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
    }
    if (rating.includes('Conditional') || rating.includes('Moderate')) {
      return 'bg-amber-950/80 text-amber-400 border-amber-800';
    }
    return 'bg-rose-950/80 text-rose-400 border-rose-800';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#162032]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Institutional AI Credit Underwriter
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                OCC & SBA 7(a) Policy Stress-Test Engine
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {!review && !loading && (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-semibold text-slate-100">
                  Ready to Stress-Test Credit Worthiness
                </h3>
                <p className="text-slate-400 text-xs">
                  The model evaluates your DSCR ({metrics.year1DSCR.toFixed(2)}x), {metrics.equityInjectionPct.toFixed(1)}% equity injection, collateral coverage, customer concentration, and historical performance against Tier-1 commercial lending policy.
                </p>
              </div>
              <button
                onClick={runCreditReview}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Commercial Underwriting Review</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-16 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-400" />
              <div className="space-y-1">
                <span className="font-semibold text-slate-200 text-sm block">
                  Simulating Commercial Credit Committee Review...
                </span>
                <span className="text-slate-400 text-[11px] block">
                  Testing cash flow debt covenants, advance liquidation rates, and downside sensitivity.
                </span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Underwriting Review Notice</span>
              </div>
              <p>{errorMsg}</p>
              <button
                onClick={runCreditReview}
                className="mt-2 text-xs px-3 py-1 bg-rose-900/60 hover:bg-rose-900 border border-rose-700 rounded text-rose-200"
              >
                Retry Review
              </button>
            </div>
          )}

          {review && !loading && (
            <div className="space-y-6">
              {/* Verdict Banner */}
              <div className="p-4 rounded-lg bg-[#162032] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Underwriting Committee Disposition
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono border ${getRatingBadge(review.overallRating)}`}>
                      {review.overallRating}
                    </span>
                    <span className="font-mono text-xs text-slate-300">
                      Score: <strong className="text-amber-400">{review.underwriterScore}/100</strong>
                    </span>
                  </div>
                </div>

                <button
                  onClick={runCreditReview}
                  className="text-xs text-slate-400 hover:text-slate-200 self-start sm:self-auto flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Re-Evaluate</span>
                </button>
              </div>

              {/* Underwriter Credit Memorandum */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Senior Underwriter Credit Memorandum
                </h4>
                <div className="bg-[#1e293b]/60 border border-slate-800 rounded-lg p-4 text-slate-300 leading-relaxed font-sans text-xs">
                  {review.executiveSummary}
                </div>
              </div>

              {/* Strengths and Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-900/60 rounded-lg p-4 space-y-2">
                  <h5 className="font-semibold text-emerald-400 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Credit Strengths & Mitigants
                  </h5>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    {review.keyStrengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 shrink-0 font-bold">·</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-950/20 border border-rose-900/60 rounded-lg p-4 space-y-2">
                  <h5 className="font-semibold text-rose-400 flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Credit Risks & Vulnerabilities
                  </h5>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    {review.keyWeaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 shrink-0 font-bold">·</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Mandatory Loan Covenants */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Recommended Loan Covenants & Conditions Precedent
                </h4>
                <div className="bg-[#1e293b]/60 border border-slate-800 rounded-lg p-3 space-y-1.5">
                  {review.recommendedCovenants.map((cov, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                      <span className="font-mono text-amber-400 shrink-0">{i + 1}.</span>
                      <span>{cov}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sensitivity Verdict */}
              {review.sensitivityStressVerdict && (
                <div className="p-3 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300 block mb-0.5">Stress Simulation Verdict:</span>
                  <p>{review.sensitivityStressVerdict}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between bg-[#162032] text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            {review?.reviewedAt ? `Evaluated ${new Date(review.reviewedAt).toLocaleTimeString()}` : 'Awaiting simulation'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Close
            </button>
            {review && (
              <button
                onClick={() => {
                  onSaveReview(review);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Attach to Dossier</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
