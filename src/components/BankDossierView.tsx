import React from 'react';
import { 
  Printer, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Landmark, 
  Building, 
  Users, 
  DollarSign, 
  Table,
  BarChart3,
  PieChart as PieIcon,
  Target,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { BusinessPlan, ComputedMetrics } from '../types/businessPlan';
import { 
  compute5YearProjections, 
  formatCurrency, 
  formatPercent 
} from '../utils/financialCalculations';
import { BarChart5Year } from './charts/BarChart5Year';
import { DscrCovenantChart } from './charts/DscrCovenantChart';
import { DonutPieChart } from './charts/DonutPieChart';

interface BankDossierViewProps {
  plan: BusinessPlan;
  metrics: ComputedMetrics;
  onTriggerPrint: () => void;
  onOpenPreviewAndPay: () => void;
}

export const BankDossierView: React.FC<BankDossierViewProps> = ({
  plan,
  metrics,
  onTriggerPrint,
  onOpenPreviewAndPay,
}) => {
  const currency = plan.currency || 'USD';
  const fmt = (num: number, hideDec: boolean = true) => formatCurrency(num, hideDec, currency);

  const projections = compute5YearProjections(plan);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrintClick = () => {
    if (!plan.isPaid) {
      // Prompt user to preview and pay before printing
      onOpenPreviewAndPay();
    } else {
      onTriggerPrint();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Pre-Payment Notification Banner (If not yet paid) */}
      {!plan.isPaid && (
        <div className="no-print p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  Draft Preview Mode · Official Certification Required
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  Flat Fee: $8.00
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Check executive preview and unlock official bank certification, unwatermarked PDF dossier, and institutional audit.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPreviewAndPay}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow shrink-0 flex items-center gap-1.5"
          >
            <span>Preview & Unlock for $8</span>
          </button>
        </div>
      )}

      {/* Action Header for Screen View */}
      <div className="no-print bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            Official Commercial Bank Dossier & Underwriting Credit Memorandum
          </h2>
          <p className="text-xs text-slate-400">
            Institutional presentation formatted for Bank Loan Committees, Credit Underwriters, and SBA Lenders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {!plan.isPaid && (
            <button
              onClick={onOpenPreviewAndPay}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-all shadow"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Check Preview & Pay ($8)</span>
            </button>
          )}

          <button
            onClick={handlePrintClick}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-all shadow ${
              plan.isPaid
                ? 'text-slate-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400'
                : 'text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>{plan.isPaid ? 'Print Official PDF Dossier' : 'Print Dossier (Preview)'}</span>
          </button>
        </div>
      </div>

      {/* THE OFFICIAL BANK DOSSIER (Printable Document Container) */}
      <div className="print-card bg-[#0f172a] text-slate-200 border border-slate-800 rounded-lg p-8 sm:p-12 space-y-8 shadow-xl">
        
        {/* Dossier Header & Document Meta */}
        <div className="border-b-2 border-slate-700 pb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 block font-semibold">
                CONFIDENTIAL CREDIT MEMORANDUM & COMMERCIAL LOAN APPLICATION
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1 font-editorial tracking-tight">
                {plan.entityInfo.companyName}
              </h1>
              {plan.entityInfo.dba && plan.entityInfo.dba !== plan.entityInfo.companyName && (
                <span className="text-xs text-slate-400 font-sans block mt-0.5">
                  Doing Business As: {plan.entityInfo.dba}
                </span>
              )}
            </div>

            <div className="text-left sm:text-right text-xs font-mono text-slate-400 space-y-0.5">
              <div>Date: {currentDate}</div>
              <div>Entity Structure: {plan.entityInfo.legalStructure} ({plan.entityInfo.stateOfIncorporation})</div>
              <div>Tax ID (EIN): {plan.entityInfo.ein || 'Pending'}</div>
              <div>Industry Code (NAICS): {plan.entityInfo.naicsCode}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-900/80 rounded border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block font-sans text-[11px]">Requested Facility</span>
              <span className="font-semibold text-slate-200 font-mono">
                {plan.loanRequest.facilityType.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-sans text-[11px]">Facility Amount</span>
              <span className="font-bold text-amber-400 font-mono text-sm tabular-nums">
                {fmt(plan.loanRequest.amount)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-sans text-[11px]">Proposed Term & Rate</span>
              <span className="font-semibold text-slate-200 font-mono">
                {plan.loanRequest.termMonths} Mo @ {plan.loanRequest.interestRatePct}% {plan.loanRequest.rateType}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-sans text-[11px]">Monthly P+I Service</span>
              <span className="font-bold text-slate-100 font-mono text-sm tabular-nums">
                {fmt(metrics.monthlyPayment, false)}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Underwriting Summary */}
        <div className="space-y-3 print-avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            1. Executive Underwriting Summary & Purpose of Funds
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {plan.businessProfile.executiveSummary || 'Executive summary not provided.'}
          </p>
          <div className="bg-slate-900/60 p-3 rounded border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-amber-400 block">Stated Loan Purpose:</span>
            <p className="italic text-slate-300 leading-relaxed">
              "{plan.loanRequest.purpose}"
            </p>
          </div>
        </div>

        {/* Section 2: Sources & Uses of Funds Matrix */}
        <div className="space-y-4 print-avoid-break">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              2. Sources & Uses of Funds Schedule
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Borrower Equity: {metrics.equityInjectionPct.toFixed(1)}% ({fmt(metrics.borrowerEquityAmount)})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Sources */}
            <div>
              <span className="font-semibold text-slate-400 block mb-1 text-[11px] uppercase tracking-wide">
                Sources of Financing
              </span>
              <table className="w-full border-collapse">
                <tbody>
                  {plan.sourcesAndUses.sources.map((s) => (
                    <tr key={s.id} className="border-b border-slate-800/80">
                      <td className="py-1.5 text-slate-300">{s.sourceName}</td>
                      <td className="py-1.5 text-right font-mono text-slate-200 tabular-nums">
                        {fmt(s.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t border-slate-700 bg-slate-900/40">
                    <td className="py-2 text-slate-100">Total Sources</td>
                    <td className="py-2 text-right font-mono text-slate-100 tabular-nums">
                      {fmt(metrics.totalSources)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Uses */}
            <div>
              <span className="font-semibold text-slate-400 block mb-1 text-[11px] uppercase tracking-wide">
                Uses of Proceeds
              </span>
              <table className="w-full border-collapse">
                <tbody>
                  {plan.sourcesAndUses.uses.map((u) => (
                    <tr key={u.id} className="border-b border-slate-800/80">
                      <td className="py-1.5 text-slate-300">{u.description}</td>
                      <td className="py-1.5 text-right font-mono text-slate-200 tabular-nums">
                        {fmt(u.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t border-slate-700 bg-slate-900/40">
                    <td className="py-2 text-slate-100">Total Uses</td>
                    <td className="py-2 text-right font-mono text-slate-100 tabular-nums">
                      {fmt(metrics.totalUses)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Distribution Graphs for Sources & Uses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-900/40 rounded border border-slate-800/80">
            <DonutPieChart
              title="Sources Breakdown"
              subtitle="Capital Providers"
              slices={plan.sourcesAndUses.sources.map((s, idx) => ({
                id: s.id,
                label: s.sourceName,
                value: s.amount,
                color: ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][idx % 5],
              }))}
              currency={currency}
            />
            <DonutPieChart
              title="Uses Breakdown"
              subtitle="Proceeds Allocation"
              slices={plan.sourcesAndUses.uses.map((u, idx) => ({
                id: u.id,
                label: u.description,
                value: u.amount,
                color: ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f43f5e', '#64748b'][idx % 7],
              }))}
              currency={currency}
            />
          </div>
        </div>

        {/* Section 3: Ownership Cap Table & Principal Guarantors */}
        <div className="space-y-3 print-avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            3. Ownership Structure & Principal Guarantor Registry
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 bg-slate-900/60">
                  <th className="py-2 px-3">Principal Name</th>
                  <th className="py-2 px-3">Corporate Title</th>
                  <th className="py-2 px-3 text-right">Ownership</th>
                  <th className="py-2 px-3 text-right">FICO Score</th>
                  <th className="py-2 px-3 text-right">Tangible Net Worth</th>
                  <th className="py-2 px-3 text-right">Liquid Assets</th>
                  <th className="py-2 px-3 text-center">Personal Guarantee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {plan.guarantors.map((g) => (
                  <tr key={g.id}>
                    <td className="py-2 px-3 font-sans text-slate-200 font-semibold">{g.name}</td>
                    <td className="py-2 px-3 font-sans text-slate-400">{g.title}</td>
                    <td className="py-2 px-3 text-right text-slate-200 tabular-nums">{g.ownershipPct}%</td>
                    <td className="py-2 px-3 text-right text-slate-200 tabular-nums">{g.creditScore}</td>
                    <td className="py-2 px-3 text-right text-slate-200 tabular-nums">{formatCurrency(g.tangibleNetWorth)}</td>
                    <td className="py-2 px-3 text-right text-slate-200 tabular-nums">{formatCurrency(g.liquidAssets)}</td>
                    <td className="py-2 px-3 text-center font-sans">
                      {g.personalGuaranteePledged ? (
                        <span className="text-emerald-400 font-semibold">Pledged (Yes)</span>
                      ) : (
                        <span className="text-rose-400 font-semibold">Not Pledged</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Niche Market SWOT & Strategic Risk Response Matrix */}
        {plan.swotAnalysis && plan.swotAnalysis.items.length > 0 && (
          <div className="space-y-4 print-avoid-break">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                4. Niche Market SWOT & Strategic Risk Response Matrix
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Niche: {plan.swotAnalysis.nicheFocus}
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="text-slate-300">
                <span className="text-slate-400 font-mono uppercase text-[10px] block">Market Positioning:</span>
                <span className="font-semibold text-slate-200">
                  {plan.swotAnalysis.nicheFocus} ({plan.swotAnalysis.competitivePosition.replace(/_/g, ' ').toUpperCase()})
                </span>
              </div>
              <div className="text-slate-400 text-[11px] font-mono">
                Lifecycle: {plan.swotAnalysis.marketMaturity.replace(/_/g, ' ').toUpperCase()} · {plan.swotAnalysis.items.length} Evaluated Areas
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {(['strengths', 'weaknesses', 'opportunities', 'threats'] as const).map((cat) => {
                const catItems = (plan.swotAnalysis?.items || []).filter((i) => i.category === cat);
                if (catItems.length === 0) return null;
                const catLabels = {
                  strengths: { label: 'Strengths (Internal Edge)', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/10' },
                  weaknesses: { label: 'Weaknesses (Operational Gaps)', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-950/10' },
                  opportunities: { label: 'Opportunities (Market Tailwinds)', color: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-950/10' },
                  threats: { label: 'Threats (External Headwinds)', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-950/10' },
                }[cat];

                return (
                  <div key={cat} className={`p-3.5 rounded border ${catLabels.border} ${catLabels.bg} space-y-2.5`}>
                    <span className={`font-bold uppercase tracking-wide text-[11px] font-mono block ${catLabels.color}`}>
                      {catLabels.label} ({catItems.length})
                    </span>
                    <div className="space-y-2.5">
                      {catItems.map((item) => (
                        <div key={item.id} className="p-2.5 rounded bg-slate-900/80 border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-slate-200 text-xs">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              Area: {item.nicheArea}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="p-2 rounded bg-slate-950/80 border-l-2 border-amber-400 text-[11px] text-slate-300 space-y-0.5">
                            <span className="font-mono text-[10px] text-amber-400 uppercase font-semibold block">
                              Strategic Response Plan:
                            </span>
                            <p className="text-slate-200">
                              {item.strategicResponse}
                            </p>
                            {(item.assignedOwner || item.budgetOrCapitalRequired || item.impactOnFinancials) && (
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 pt-1 text-[10px] font-mono text-slate-400">
                                {item.assignedOwner && <span>Lead: {item.assignedOwner}</span>}
                                {item.budgetOrCapitalRequired ? <span>Budget: {fmt(item.budgetOrCapitalRequired)}</span> : null}
                                {item.impactOnFinancials && <span className="text-emerald-400">Impact: {item.impactOnFinancials}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 5: 5-Year Pro-Forma Income Statement & DSCR Audit */}
        <div className="space-y-4 print-avoid-break">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              5. 5-Year Pro-Forma Financial Summary & Debt Service Coverage
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Avg 5-Year DSCR: {metrics.average5YearDSCR.toFixed(2)}x
            </span>
          </div>

          {/* Embedded Print-Ready Vector Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-slate-900/40 rounded border border-slate-800/80">
            <BarChart5Year
              projections={projections}
              currency={currency}
              title="5-Year Revenue & EBITDA Trend"
              subtitle="Institutional financial scale model"
            />
            <DscrCovenantChart
              projections={projections}
              benchmark={1.25}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 bg-slate-900/60 font-mono">
                  <th className="py-2 px-3 font-sans">Financial Indicator ({currency})</th>
                  <th className="py-2 px-3 text-right">Year 1</th>
                  <th className="py-2 px-3 text-right">Year 2</th>
                  <th className="py-2 px-3 text-right">Year 3</th>
                  <th className="py-2 px-3 text-right">Year 4</th>
                  <th className="py-2 px-3 text-right">Year 5</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                <tr className="font-semibold text-slate-100">
                  <td className="py-1.5 px-3 font-sans">Total Revenue</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-1.5 px-3 text-right tabular-nums">
                      {fmt(p.revenue)}
                    </td>
                  ))}
                </tr>
                <tr className="text-slate-400">
                  <td className="py-1.5 px-3 font-sans">Gross Profit</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-1.5 px-3 text-right tabular-nums text-slate-200">
                      {fmt(p.grossProfit)}
                    </td>
                  ))}
                </tr>
                <tr className="bg-amber-950/20 font-bold text-amber-300">
                  <td className="py-1.5 px-3 font-sans">EBITDA (Operating Cash Flow)</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-1.5 px-3 text-right tabular-nums">
                      {fmt(p.ebitda)}
                    </td>
                  ))}
                </tr>
                <tr className="text-slate-400">
                  <td className="py-1.5 px-3 font-sans">Annual Debt Service (P+I)</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-1.5 px-3 text-right tabular-nums text-slate-200">
                      {fmt(p.annualDebtService)}
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-900/80 font-bold">
                  <td className="py-2 px-3 font-sans text-slate-100">
                    Debt Service Coverage Ratio (DSCR)
                  </td>
                  {projections.map((p) => (
                    <td
                      key={p.year}
                      className={`py-2 px-3 text-right tabular-nums text-sm ${
                        p.dscr >= 1.25 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {p.dscr.toFixed(2)}x
                    </td>
                  ))}
                </tr>
                <tr className="font-semibold text-emerald-400">
                  <td className="py-1.5 px-3 font-sans">Net Income</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-1.5 px-3 text-right tabular-nums">
                      {fmt(p.netIncome)}
                    </td>
                  ))}
                </tr>
                <tr className="text-slate-400">
                  <td className="py-1.5 px-3 font-sans">Total Assets (End of Year)</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-1.5 px-3 text-right tabular-nums text-slate-300">
                      {fmt(p.totalAssets)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 6: Collateral & Secondary Source of Repayment */}
        <div className="space-y-3 print-avoid-break">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              6. Collateral Schedule & Advance Rate Liquidation Valuation
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Loan-to-Value: {metrics.loanToValuePct.toFixed(1)}% · Coverage: {metrics.collateralCoverageRatio.toFixed(2)}x
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 bg-slate-900/60 font-mono">
                  <th className="py-2 px-3 font-sans">Collateral Asset Description</th>
                  <th className="py-2 px-3 text-right">Appraised FMV</th>
                  <th className="py-2 px-3 text-right">Advance Rate</th>
                  <th className="py-2 px-3 text-right">Prior Liens</th>
                  <th className="py-2 px-3 text-right">Discounted Net Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {plan.collateral.map((c) => {
                  const netVal = Math.max(0, c.fairMarketValue * (c.advanceRatePct / 100) - c.priorLiens);
                  return (
                    <tr key={c.id}>
                      <td className="py-1.5 px-3 font-sans text-slate-300">{c.description}</td>
                      <td className="py-1.5 px-3 text-right text-slate-200 tabular-nums">{fmt(c.fairMarketValue)}</td>
                      <td className="py-1.5 px-3 text-right text-slate-400 tabular-nums">{c.advanceRatePct}%</td>
                      <td className="py-1.5 px-3 text-right text-slate-400 tabular-nums">{fmt(c.priorLiens)}</td>
                      <td className="py-1.5 px-3 text-right text-amber-400 font-semibold tabular-nums">{fmt(netVal)}</td>
                    </tr>
                  );
                })}
                <tr className="font-bold border-t border-slate-700 bg-slate-900/60">
                  <td className="py-2 px-3 font-sans text-slate-100">Total Net Collateral Available</td>
                  <td className="py-2 px-3 text-right text-slate-100 tabular-nums">{fmt(metrics.totalCollateralFMV)}</td>
                  <td className="py-2 px-3 text-right text-slate-400">-</td>
                  <td className="py-2 px-3 text-right text-slate-400">-</td>
                  <td className="py-2 px-3 text-right text-amber-400 tabular-nums text-sm">
                    {fmt(metrics.totalDiscountedCollateral)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 7: Commercial Underwriting Covenants & Compliance Matrix */}
        <div className="space-y-3 print-avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            7. Credit Covenants & Loan Policy Compliance Matrix
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Debt Service Coverage (DSCR)</span>
                <span className={`font-mono font-bold ${metrics.year1DSCR >= 1.25 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {metrics.year1DSCR >= 1.25 ? 'PASSED (≥1.25x)' : 'EXCEPTION (<1.25x)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Applicant projects Year 1 DSCR of {metrics.year1DSCR.toFixed(2)}x against bank underwriting covenant of 1.25x minimum.
              </p>
            </div>

            <div className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Borrower Equity Injection</span>
                <span className={`font-mono font-bold ${metrics.meetsEquityBenchmark ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {metrics.meetsEquityBenchmark ? 'PASSED (≥10%)' : 'EXCEPTION (<10%)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Borrower cash injection represents {metrics.equityInjectionPct.toFixed(1)}% of total capital uses.
              </p>
            </div>

            <div className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Collateral & LTV Benchmark</span>
                <span className={`font-mono font-bold ${metrics.meetsCollateralBenchmark ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {metrics.meetsCollateralBenchmark ? 'FULLY SECURED' : 'PARTIALLY SECURED'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Discounted collateral coverage ratio is {metrics.collateralCoverageRatio.toFixed(2)}x with a {metrics.loanToValuePct.toFixed(1)}% LTV.
              </p>
            </div>

            <div className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Principal Guarantor Compliance</span>
                <span className={`font-mono font-bold ${metrics.allGuarantorsSigned ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {metrics.allGuarantorsSigned ? 'COMPLIANT' : 'NON-COMPLIANT'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {metrics.allGuarantorsSigned
                  ? 'All owners with ≥20% equity have pledged full, unconditional personal guarantees.'
                  : `Missing personal guarantees for: ${metrics.majorOwnersMissingGuarantees.join(', ')}.`}
              </p>
            </div>
          </div>
        </div>

        {/* Section 8: Formal Signature & Execution Block */}
        <div className="space-y-6 pt-6 border-t-2 border-slate-700 print-avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            8. Borrower Attestation & Execution Signatures
          </h2>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            The undersigned authorized officer(s) and individual guarantor(s) hereby certify that all financial statements, projections, and operational narratives submitted herein are accurate, complete, and prepared in good faith for the purpose of obtaining commercial credit.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            {plan.guarantors.map((g) => (
              <div key={g.id} className="space-y-4 border-t border-slate-700 pt-3">
                <div className="h-8 border-b border-dashed border-slate-500"></div>
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold text-slate-200">{g.name}</div>
                  <div className="text-slate-400">{g.title} · Guarantor ({g.ownershipPct}%)</div>
                  <div className="text-[11px] text-slate-500">Date: __________________________</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bank Officer Action Section */}
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-4 mt-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block border-b border-slate-800 pb-2">
              For Commercial Bank & Credit Committee Use Only
            </span>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-slate-600 rounded"></div>
                <span className="text-slate-300">Recommended for Approval</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-slate-600 rounded"></div>
                <span className="text-slate-300">Conditional Approval</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-slate-600 rounded"></div>
                <span className="text-slate-300">Declined / Exception</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-3 border-t border-slate-800 text-xs">
              <div>
                <div className="h-6 border-b border-dashed border-slate-600"></div>
                <span className="text-[11px] text-slate-400 mt-1 block">Commercial Loan Officer Signature</span>
              </div>
              <div>
                <div className="h-6 border-b border-dashed border-slate-600"></div>
                <span className="text-[11px] text-slate-400 mt-1 block">Senior Credit Officer / Committee Chair</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
