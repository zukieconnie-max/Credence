import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  ShieldCheck, 
  Coins, 
  Sliders, 
  Activity,
  Layers
} from 'lucide-react';
import { BusinessPlan, ComputedMetrics } from '../types/businessPlan';
import { 
  compute5YearProjections, 
  computeYear1MonthlyCashFlow 
} from '../utils/financialCalculations';
import { formatPlanCurrency } from '../utils/currency';
import { BarChart5Year } from './charts/BarChart5Year';
import { DscrCovenantChart } from './charts/DscrCovenantChart';
import { DonutPieChart, PieSlice } from './charts/DonutPieChart';
import { MonthlyCashChart } from './charts/MonthlyCashChart';

interface VisualGraphsTabProps {
  plan: BusinessPlan;
  metrics: ComputedMetrics;
  onChangePlan?: (updated: BusinessPlan) => void;
}

export const VisualGraphsTab: React.FC<VisualGraphsTabProps> = ({
  plan,
  metrics,
  onChangePlan,
}) => {
  const currency = plan.currency || 'USD';
  const projections = compute5YearProjections(plan);
  const monthlyCashFlow = computeYear1MonthlyCashFlow(plan, projections[0]);

  const [activeMetricType, setActiveMetricType] = useState<'revenue_ebitda' | 'profit_debt'>('revenue_ebitda');

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

  // Collateral Asset Slices
  const collateralSlices: PieSlice[] = plan.collateral.map((c, idx) => ({
    id: c.id,
    label: c.description,
    value: c.fairMarketValue,
    color: pieColors[idx % pieColors.length],
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Visual Analytics Suite
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Section 3.5</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-1 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Financial Projections, Covenant & Liquidity Graphs
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive chart deck visualizing profitability growth, loan covenant coverage, and capital allocations in {currency}.
          </p>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center gap-1 bg-[#1e293b] p-1 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setActiveMetricType('revenue_ebitda')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeMetricType === 'revenue_ebitda'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Revenue & EBITDA
          </button>
          <button
            type="button"
            onClick={() => setActiveMetricType('profit_debt')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeMetricType === 'profit_debt'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Profit vs Debt Service
          </button>
        </div>
      </div>

      {/* Row 1: 5-Year Trajectory Bar Chart */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-4">
        <BarChart5Year
          projections={projections}
          currency={currency}
          metricType={activeMetricType}
        />
      </div>

      {/* Row 2: DSCR Covenant Line & 12-Month Liquidity Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DscrCovenantChart
          projections={projections}
          benchmark={1.25}
        />
        <MonthlyCashChart
          monthlyData={monthlyCashFlow}
          currency={currency}
        />
      </div>

      {/* Row 3: Pie / Donut Charts Deck */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-amber-400" />
            Capital Allocations & Expense Distributions
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Interactive Donut Charts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DonutPieChart
            title="Sources of Funds"
            subtitle={`Equity: ${metrics.equityInjectionPct.toFixed(1)}%`}
            slices={sourcesSlices}
            currency={currency}
          />
          <DonutPieChart
            title="Uses of Proceeds"
            subtitle={`Total: ${formatPlanCurrency(metrics.totalUses, currency)}`}
            slices={usesSlices}
            currency={currency}
          />
          <DonutPieChart
            title="Year 1 Opex Distribution"
            subtitle={`Annual: ${formatPlanCurrency(projections[0]?.opex || 0, currency)}`}
            slices={opexSlices}
            currency={currency}
          />
          <DonutPieChart
            title="Pledged Collateral Assets"
            subtitle={`FMV: ${formatPlanCurrency(metrics.totalCollateralFMV, currency)}`}
            slices={collateralSlices}
            currency={currency}
          />
        </div>
      </div>

      {/* Row 4: Key Numerical Indicators alongside Graphs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#111827] border border-slate-800 rounded-lg p-5 text-xs font-mono">
        <div>
          <span className="text-slate-400 block font-sans text-[11px]">Year 1 Projected Revenue</span>
          <span className="text-base font-bold text-slate-100 tabular-nums">
            {formatPlanCurrency(projections[0]?.revenue || 0, currency)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block font-sans text-[11px]">Year 1 Operating EBITDA</span>
          <span className="text-base font-bold text-amber-400 tabular-nums">
            {formatPlanCurrency(projections[0]?.ebitda || 0, currency)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block font-sans text-[11px]">Debt Coverage (DSCR)</span>
          <span className={`text-base font-bold tabular-nums ${metrics.year1DSCR >= 1.25 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {metrics.year1DSCR.toFixed(2)}x
          </span>
        </div>
        <div>
          <span className="text-slate-400 block font-sans text-[11px]">Break-Even Sales</span>
          <span className="text-base font-bold text-slate-200 tabular-nums">
            {formatPlanCurrency(metrics.breakEvenRevenueYear1, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
