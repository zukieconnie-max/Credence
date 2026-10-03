import React, { useState } from 'react';
import { BarChart5Year } from './BarChart5Year';
import { DscrCovenantChart } from './DscrCovenantChart';
import { DonutPieChart, PieSlice } from './DonutPieChart';
import { MonthlyCashChart } from './MonthlyCashChart';
import { 
  BusinessPlan, 
  ComputedMetrics, 
  ProjectedYearStatement, 
  MonthlyCashFlowMonth 
} from '../../types/businessPlan';
import { formatPlanCurrency } from '../../utils/currency';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  ShieldCheck, 
  Coins 
} from 'lucide-react';

interface FinancialChartsSuiteProps {
  plan: BusinessPlan;
  metrics: ComputedMetrics;
  projections: ProjectedYearStatement[];
  monthlyCashFlow: MonthlyCashFlowMonth[];
  currency?: string;
  isPrintView?: boolean;
}

export const FinancialChartsSuite: React.FC<FinancialChartsSuiteProps> = ({
  plan,
  metrics,
  projections,
  monthlyCashFlow,
  currency = 'USD',
  isPrintView = false,
}) => {
  const [metricType, setMetricType] = useState<'revenue_ebitda' | 'profit_debt'>('revenue_ebitda');

  // Palette colors for Pie Charts
  const pieColors = [
    '#38bdf8', // light blue
    '#818cf8', // indigo
    '#f59e0b', // amber
    '#34d399', // emerald
    '#f43f5e', // rose
    '#fb923c', // orange
    '#a78bfa', // purple
    '#2dd4bf', // teal
  ];

  // Sources Pie Slices
  const sourcesSlices: PieSlice[] = plan.sourcesAndUses.sources.map((s, idx) => ({
    id: s.id,
    label: s.sourceName,
    value: s.amount,
    color: pieColors[idx % pieColors.length],
  }));

  // Uses Pie Slices
  const usesSlices: PieSlice[] = plan.sourcesAndUses.uses.map((u, idx) => ({
    id: u.id,
    label: u.description,
    value: u.amount,
    color: pieColors[idx % pieColors.length],
  }));

  // Operating Expenses Slices
  const opexSlices: PieSlice[] = plan.expenses.map((e, idx) => ({
    id: e.id,
    label: e.name,
    value: e.year1,
    color: pieColors[idx % pieColors.length],
  }));

  return (
    <div className="space-y-6">
      {/* Visual Controls (Screen only) */}
      {!isPrintView && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111827] border border-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-200">Financial Visualizations & Graph Deck</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono">Currency: {currency}</span>
          </div>

          <div className="flex items-center gap-1 bg-[#1e293b] p-1 rounded">
            <button
              type="button"
              onClick={() => setMetricType('revenue_ebitda')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                metricType === 'revenue_ebitda'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Revenue & EBITDA Trajectory
            </button>
            <button
              type="button"
              onClick={() => setMetricType('profit_debt')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                metricType === 'profit_debt'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Net Profit vs Debt Service
            </button>
          </div>
        </div>
      )}

      {/* Row 1: 5-Year Trajectory Bar Chart */}
      <div className="print-avoid-break">
        <BarChart5Year
          projections={projections}
          currency={currency}
          metricType={metricType}
        />
      </div>

      {/* Row 2: DSCR Covenant Benchmark Line & 12-Month Liquidity Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print-avoid-break">
        <DscrCovenantChart projections={projections} benchmark={1.25} />
        <MonthlyCashChart monthlyData={monthlyCashFlow} currency={currency} />
      </div>

      {/* Row 3: Donut / Pie Charts (Sources, Uses & Expense Distribution) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print-avoid-break">
        <DonutPieChart
          title="Capital Sources Breakdown"
          subtitle={`Borrower Equity: ${metrics.equityInjectionPct.toFixed(1)}%`}
          slices={sourcesSlices}
          currency={currency}
        />
        <DonutPieChart
          title="Proceeds Allocation (Uses)"
          subtitle={`Total CapEx: ${formatPlanCurrency(metrics.totalUses, currency)}`}
          slices={usesSlices}
          currency={currency}
        />
        <DonutPieChart
          title="Year 1 Operating Overheads"
          subtitle={`Annual Opex: ${formatPlanCurrency(projections[0]?.opex || 0, currency)}`}
          slices={opexSlices}
          currency={currency}
        />
      </div>
    </div>
  );
};
