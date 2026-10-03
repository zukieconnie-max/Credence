import React, { useState } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  AlertTriangle, 
  Sliders, 
  RefreshCcw, 
  TrendingDown, 
  Activity,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { BusinessPlan, ComputedMetrics } from '../types/businessPlan';
import { 
  compute5YearProjections, 
  formatCurrency, 
  formatPercent 
} from '../utils/financialCalculations';

interface UnderwritingRatiosTabProps {
  plan: BusinessPlan;
  metrics: ComputedMetrics;
  onChangePlan: (updated: BusinessPlan) => void;
}

export const UnderwritingRatiosTab: React.FC<UnderwritingRatiosTabProps> = ({
  plan,
  metrics,
  onChangePlan,
}) => {
  const currency = plan.currency || 'USD';
  const fmt = (num: number, hideDec: boolean = true) => formatCurrency(num, hideDec, currency);

  // Custom stress slider state
  const [customRevDrop, setCustomRevDrop] = useState<number>(plan.stressRevenueDropPct || 15);
  const [customCogsHike, setCustomCogsHike] = useState<number>(plan.stressCogsIncreasePct || 5);
  const [customRateHikeBps, setCustomRateHikeBps] = useState<number>(plan.stressInterestRateHikeBps || 200);

  // Compute Base Case (1.0x Rev, 1.0x COGS, 0 bps)
  const baseProjections = compute5YearProjections(plan, 1.0, 1.0, 0);
  const baseY1 = baseProjections[0];

  // Compute Moderate Stress Case (-15% Rev, +5% COGS, +100 bps)
  const moderateProjections = compute5YearProjections(plan, 0.85, 1.05, 100);
  const moderateY1 = moderateProjections[0];

  // Compute Severe Bank Stress Case (-25% Rev, +10% COGS, +250 bps)
  const severeProjections = compute5YearProjections(plan, 0.75, 1.10, 250);
  const severeY1 = severeProjections[0];

  // Compute Custom Interactive Stress Case
  const customProjections = compute5YearProjections(
    plan,
    1 - customRevDrop / 100,
    1 + customCogsHike / 100,
    customRateHikeBps
  );
  const customY1 = customProjections[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Credit Committee Assessment
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">OCC & SBA Underwriting Standards</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1">
              Financial Covenants & Multi-Scenario Stress Testing
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-400">
            DSCR Benchmark: ≥ 1.25x · Current Ratio: ≥ 1.35x · Max LTV: ≤ 80%
          </div>
        </div>
      </div>

      {/* Ratios Matrix: 4 Key Credit Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Pillar 1: DSCR */}
        <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Debt Service Coverage (DSCR)</span>
            <span className="text-[10px] font-mono text-slate-500">PRIMARY COVENANT</span>
          </div>

          <div className="space-y-1">
            <span className={`text-3xl font-bold font-mono tabular-nums ${
              metrics.year1DSCR >= 1.25 ? 'text-emerald-400' : metrics.year1DSCR >= 1.0 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {metrics.year1DSCR.toFixed(2)}x
            </span>
            <span className="text-xs text-slate-400 block">Year 1 Net Cash Flow Coverage</span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span className="font-semibold block text-slate-300">Bank Guidance:</span>
            {metrics.year1DSCR >= 1.25 ? (
              <span className="text-emerald-400">Exceeds standard 1.25x commercial credit policy threshold.</span>
            ) : metrics.year1DSCR >= 1.0 ? (
              <span className="text-amber-400">Tight margin. May require debt restructuring or additional equity.</span>
            ) : (
              <span className="text-rose-400">Default risk: Operating income does not cover debt payments.</span>
            )}
          </div>
        </div>

        {/* Pillar 2: Break-Even & Safety Margin */}
        <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Break-Even Sales (Y1)</span>
            <span className="text-[10px] font-mono text-slate-500">RESILIENCE</span>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
              {formatCurrency(metrics.breakEvenRevenueYear1)}
            </span>
            <span className="text-xs text-amber-400 block font-mono">
              Margin of Safety: {metrics.marginOfSafetyPctYear1}%
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            Revenue can decline by <strong className="text-slate-200">{metrics.marginOfSafetyPctYear1}%</strong> before the business experiences operating losses.
          </div>
        </div>

        {/* Pillar 3: Liquidity (Current Ratio) */}
        <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Current Ratio</span>
            <span className="text-[10px] font-mono text-slate-500">LIQUIDITY</span>
          </div>

          <div className="space-y-1">
            <span className={`text-3xl font-bold font-mono tabular-nums ${
              metrics.year1CurrentRatio >= 1.35 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {metrics.year1CurrentRatio.toFixed(2)}x
            </span>
            <span className="text-xs text-slate-400 block">Current Assets / Current Liabilities</span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            {metrics.year1CurrentRatio >= 1.35
              ? 'Adequate working capital buffer for short-term liabilities.'
              : 'Caution: Working capital reserves below bank benchmark of 1.35x.'}
          </div>
        </div>

        {/* Pillar 4: Leverage (Debt-to-Equity) */}
        <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Debt-to-Equity (Y1)</span>
            <span className="text-[10px] font-mono text-slate-500">LEVERAGE</span>
          </div>

          <div className="space-y-1">
            <span className={`text-3xl font-bold font-mono tabular-nums ${
              metrics.year1DebtToEquity <= 3.5 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {metrics.year1DebtToEquity.toFixed(2)}x
            </span>
            <span className="text-xs text-slate-400 block">Total Liabilities / Tangible Equity</span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            Standard commercial credit cap is 3.0x - 4.0x debt-to-worth leverage.
          </div>
        </div>
      </div>

      {/* 3-Scenario Stress Testing Matrix */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Underwriter Sensitivity & Downside Scenarios
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison of management base case against standard credit committee recession shocks.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">DOWNSIDE SIMULATION</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 bg-[#162032]">
                <th className="py-2.5 px-3 font-semibold">Underwriting Metric</th>
                <th className="py-2.5 px-3 text-right font-semibold font-mono">
                  Base Case (Plan)
                </th>
                <th className="py-2.5 px-3 text-right font-semibold font-mono text-amber-400">
                  Moderate Downside (-15% Rev, +5% COGS)
                </th>
                <th className="py-2.5 px-3 text-right font-semibold font-mono text-rose-400">
                  Severe Stress (-25% Rev, +10% COGS, +250bps)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              <tr>
                <td className="py-2 px-3 font-sans text-slate-300">Projected Year 1 Revenue</td>
                <td className="py-2 px-3 text-right text-slate-200 tabular-nums">
                  {fmt(baseY1.revenue)}
                </td>
                <td className="py-2 px-3 text-right text-slate-300 tabular-nums">
                  {fmt(moderateY1.revenue)}
                </td>
                <td className="py-2 px-3 text-right text-slate-300 tabular-nums">
                  {fmt(severeY1.revenue)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-400">Gross Profit</td>
                <td className="py-2 px-3 text-right text-slate-200 tabular-nums">
                  {fmt(baseY1.grossProfit)}
                </td>
                <td className="py-2 px-3 text-right text-slate-300 tabular-nums">
                  {fmt(moderateY1.grossProfit)}
                </td>
                <td className="py-2 px-3 text-right text-slate-300 tabular-nums">
                  {fmt(severeY1.grossProfit)}
                </td>
              </tr>
              <tr className="bg-slate-800/20 font-semibold">
                <td className="py-2 px-3 font-sans text-slate-200">EBITDA (Operating Cash)</td>
                <td className="py-2 px-3 text-right text-amber-300 tabular-nums">
                  {fmt(baseY1.ebitda)}
                </td>
                <td className="py-2 px-3 text-right text-amber-300 tabular-nums">
                  {fmt(moderateY1.ebitda)}
                </td>
                <td className="py-2 px-3 text-right text-amber-300 tabular-nums">
                  {fmt(severeY1.ebitda)}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-400">Annual Debt Service (P+I)</td>
                <td className="py-2 px-3 text-right text-slate-300 tabular-nums">
                  {fmt(baseY1.annualDebtService)}
                </td>
                <td className="py-2 px-3 text-right text-slate-300 tabular-nums">
                  {fmt(moderateY1.annualDebtService)}
                </td>
                <td className="py-2 px-3 text-right text-slate-300 tabular-nums">
                  {fmt(severeY1.annualDebtService)}
                </td>
              </tr>
              <tr className="bg-[#162032] font-bold text-sm">
                <td className="py-2.5 px-3 font-sans text-slate-100">
                  Stressed DSCR (Coverage)
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400">
                  {baseY1.dscr.toFixed(2)}x
                </td>
                <td className={`py-2.5 px-3 text-right tabular-nums ${
                  moderateY1.dscr >= 1.25 ? 'text-emerald-400' : moderateY1.dscr >= 1.0 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {moderateY1.dscr.toFixed(2)}x
                </td>
                <td className={`py-2.5 px-3 text-right tabular-nums ${
                  severeY1.dscr >= 1.25 ? 'text-emerald-400' : severeY1.dscr >= 1.0 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {severeY1.dscr.toFixed(2)}x
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-300">Net Income</td>
                <td className="py-2 px-3 text-right text-emerald-400 tabular-nums">
                  {fmt(baseY1.netIncome)}
                </td>
                <td className={`py-2 px-3 text-right tabular-nums ${moderateY1.netIncome >= 0 ? 'text-slate-200' : 'text-rose-400'}`}>
                  {fmt(moderateY1.netIncome)}
                </td>
                <td className={`py-2 px-3 text-right tabular-nums ${severeY1.netIncome >= 0 ? 'text-slate-200' : 'text-rose-400'}`}>
                  {fmt(severeY1.netIncome)}
                </td>
              </tr>
              <tr className="font-sans text-xs">
                <td className="py-2.5 px-3 font-semibold text-slate-300">Underwriter Verdict</td>
                <td className="py-2.5 px-3 text-right text-emerald-400 font-semibold">
                  Policy Compliant (Pass)
                </td>
                <td className={`py-2.5 px-3 text-right font-semibold ${
                  moderateY1.dscr >= 1.25 ? 'text-emerald-400' : moderateY1.dscr >= 1.0 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {moderateY1.dscr >= 1.25 ? 'Fully Solvent' : moderateY1.dscr >= 1.0 ? 'Tight (Requires Buffer)' : 'Debt Service Breached'}
                </td>
                <td className={`py-2.5 px-3 text-right font-semibold ${
                  severeY1.dscr >= 1.0 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {severeY1.dscr >= 1.0 ? 'Narrow Survival' : 'Insolvent Under Shock'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Custom Stress Sliders */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Interactive Loan Committee Stress Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Simulate tailored economic shocks to test whether debt repayment holds.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setCustomRevDrop(15);
              setCustomCogsHike(5);
              setCustomRateHikeBps(200);
            }}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
          >
            <RefreshCcw className="w-3 h-3" />
            Reset Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-300">Revenue Contraction Shock</span>
              <span className="font-mono text-amber-400 font-bold">-{customRevDrop}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={customRevDrop}
              onChange={(e) => setCustomRevDrop(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Simulates sudden sales drop</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-300">Direct Cost Inflation (COGS)</span>
              <span className="font-mono text-amber-400 font-bold">+{customCogsHike}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={customCogsHike}
              onChange={(e) => setCustomCogsHike(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Simulates raw material/labor cost increase</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-300">Prime Rate Hike (bps)</span>
              <span className="font-mono text-amber-400 font-bold">+{customRateHikeBps} bps (+{(customRateHikeBps / 100).toFixed(2)}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="25"
              value={customRateHikeBps}
              onChange={(e) => setCustomRateHikeBps(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Simulates Federal Reserve interest rate hikes</span>
          </div>
        </div>

        {/* Live Simulator Results Box */}
        <div className="p-4 rounded-lg bg-[#162032] border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 block font-sans">Simulated Stress DSCR</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-mono tabular-nums ${
                customY1.dscr >= 1.25 ? 'text-emerald-400' : customY1.dscr >= 1.0 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {customY1.dscr.toFixed(2)}x
              </span>
              <span className="text-xs text-slate-400 font-sans">
                (Operating Cash: {fmt(customY1.ebitda)} vs Debt: {fmt(customY1.annualDebtService)})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {customY1.dscr >= 1.25 ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Passes Bank Policy Under Shock</span>
              </div>
            ) : customY1.dscr >= 1.0 ? (
              <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded border border-amber-800">
                <AlertTriangle className="w-4 h-4" />
                <span>Warning: Covenant Tight Under Shock</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/60 px-3 py-1.5 rounded border border-rose-800">
                <XCircle className="w-4 h-4" />
                <span>Default: Debt Insolvent Under Shock</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
