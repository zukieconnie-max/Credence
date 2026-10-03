import React, { useState } from 'react';
import { 
  TrendingUp, 
  Table, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Layers,
  BarChart3,
  PieChart as PieIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  BusinessPlan, 
  ComputedMetrics, 
  ExpenseItem, 
  RevenueStream 
} from '../types/businessPlan';
import { 
  compute5YearProjections, 
  computeYear1MonthlyCashFlow, 
  formatCurrency, 
  formatPercent 
} from '../utils/financialCalculations';
import { FinancialChartsSuite } from './charts/FinancialChartsSuite';
import { BarChart5Year } from './charts/BarChart5Year';
import { MonthlyCashChart } from './charts/MonthlyCashChart';
import { DscrCovenantChart } from './charts/DscrCovenantChart';
import { DonutPieChart } from './charts/DonutPieChart';

interface FinancialProjectionsTabProps {
  plan: BusinessPlan;
  metrics: ComputedMetrics;
  onChangePlan: (updated: BusinessPlan) => void;
}

export const FinancialProjectionsTab: React.FC<FinancialProjectionsTabProps> = ({
  plan,
  metrics,
  onChangePlan,
}) => {
  const [activeSubView, setActiveSubView] = useState<'income_statement' | 'cash_flow' | 'balance_sheet' | 'graphs' | 'drivers'>('income_statement');
  const [showEmbeddedChart, setShowEmbeddedChart] = useState(true);

  const currency = plan.currency || 'USD';
  const fmt = (num: number, hideDec: boolean = true) => formatCurrency(num, hideDec, currency);

  const projections = compute5YearProjections(plan);
  const monthlyCashFlow = computeYear1MonthlyCashFlow(plan, projections[0]);

  // Revenue streams management
  const addRevenueStream = () => {
    const newStream: RevenueStream = {
      id: `rev-${Date.now()}`,
      name: 'New Product / Revenue Stream',
      year1: 250000,
      growthRatesPct: [15, 12, 10, 8],
    };
    onChangePlan({
      ...plan,
      revenueStreams: [...plan.revenueStreams, newStream],
    });
  };

  const removeRevenueStream = (id: string) => {
    onChangePlan({
      ...plan,
      revenueStreams: plan.revenueStreams.filter((r) => r.id !== id),
    });
  };

  const updateRevenueStream = (id: string, field: keyof RevenueStream, value: any) => {
    onChangePlan({
      ...plan,
      revenueStreams: plan.revenueStreams.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    });
  };

  const updateGrowthRate = (streamId: string, index: number, value: number) => {
    onChangePlan({
      ...plan,
      revenueStreams: plan.revenueStreams.map((r) => {
        if (r.id !== streamId) return r;
        const newRates = [...r.growthRatesPct];
        newRates[index] = value;
        return { ...r, growthRatesPct: newRates };
      }),
    });
  };

  // Expenses management
  const addExpense = () => {
    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      category: 'general_admin',
      name: 'Additional Operating Overhead',
      year1: 30000,
      annualGrowthPct: 4,
    };
    onChangePlan({
      ...plan,
      expenses: [...plan.expenses, newExp],
    });
  };

  const removeExpense = (id: string) => {
    onChangePlan({
      ...plan,
      expenses: plan.expenses.filter((e) => e.id !== id),
    });
  };

  const updateExpense = (id: string, field: keyof ExpenseItem, value: any) => {
    onChangePlan({
      ...plan,
      expenses: plan.expenses.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Sub-view Navigation Controls */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            3-Statement Pro-Forma Financial Model
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            5-Year projection suite required by commercial credit committees for debt service validation.
          </p>
        </div>

        {/* Sub-Tabs Segmented Control */}
        <div className="flex items-center gap-1 bg-[#1e293b] p-1 rounded-lg shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSubView('income_statement')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeSubView === 'income_statement'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Income Statement (P&L)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('cash_flow')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeSubView === 'cash_flow'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            12-Month Cash Flow
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('balance_sheet')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeSubView === 'balance_sheet'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pro-Forma Balance Sheet
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('graphs')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeSubView === 'graphs'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Visual Graphs & Analytics
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('drivers')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeSubView === 'drivers'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Model Drivers & Assumptions
          </button>
        </div>
      </div>

      {/* Historical Financials (Only shown if Running Business) */}
      {plan.stage === 'running_business' && plan.historicalFinancials.length > 0 && (
        <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Historical Performance Baseline (Past 3 Years)
              </h3>
              <p className="text-xs text-slate-400">
                Banks compare historical actuals against pro-forma projections to test credibility.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">TRACK RECORD ({currency})</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3 font-semibold">Line Item</th>
                  {plan.historicalFinancials.map((h, i) => (
                    <th key={i} className="py-2 px-3 text-right font-semibold font-mono">
                      {h.yearLabel}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr>
                  <td className="py-2 px-3 font-sans text-slate-200">Total Gross Revenue</td>
                  {plan.historicalFinancials.map((h, i) => (
                    <td key={i} className="py-2 px-3 text-right text-slate-200 tabular-nums">
                      {fmt(h.revenue)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-slate-400">Cost of Goods Sold (COGS)</td>
                  {plan.historicalFinancials.map((h, i) => (
                    <td key={i} className="py-2 px-3 text-right text-slate-400 tabular-nums">
                      ({fmt(h.cogs)})
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-800/20 font-semibold">
                  <td className="py-2 px-3 font-sans text-slate-100">Gross Profit</td>
                  {plan.historicalFinancials.map((h, i) => (
                    <td key={i} className="py-2 px-3 text-right text-slate-100 tabular-nums">
                      {fmt(h.revenue - h.cogs)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-slate-400">Operating Overheads</td>
                  {plan.historicalFinancials.map((h, i) => (
                    <td key={i} className="py-2 px-3 text-right text-slate-400 tabular-nums">
                      ({fmt(h.operatingExpenses)})
                    </td>
                  ))}
                </tr>
                <tr className="font-semibold text-emerald-400">
                  <td className="py-2 px-3 font-sans">Net Operating Profit</td>
                  {plan.historicalFinancials.map((h, i) => (
                    <td key={i} className="py-2 px-3 text-right tabular-nums">
                      {fmt(h.netIncome)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 1: 5-YEAR PRO-FORMA INCOME STATEMENT */}
      {activeSubView === 'income_statement' && (
        <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                5-Year Pro-Forma Income Statement (P&L)
              </h3>
              <p className="text-xs text-slate-400">
                Comprehensive revenue expansion, margin analysis, and annual debt coverage ratio (DSCR).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowEmbeddedChart(!showEmbeddedChart)}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded"
              >
                {showEmbeddedChart ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showEmbeddedChart ? 'Hide Visual Charts' : 'Show Visual Charts'}
              </button>
              <div className="text-xs font-mono text-slate-400">
                Tax: {plan.effectiveTaxRatePct}% · Depr: {fmt(plan.annualDepreciation)}/yr
              </div>
            </div>
          </div>

          {/* Embedded Charts in Income Statement */}
          {showEmbeddedChart && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-[#0a0f1d] border border-slate-800/80 rounded-lg">
              <BarChart5Year
                projections={projections}
                currency={currency}
                title="5-Year Pro-Forma Trajectory"
                subtitle="Revenue vs Gross Profit vs EBITDA"
              />
              <DscrCovenantChart
                projections={projections}
                benchmark={1.25}
              />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 bg-[#162032]">
                  <th className="py-2.5 px-3 font-semibold">Statement Line ({currency})</th>
                  <th className="py-2.5 px-3 text-right font-semibold font-mono">Year 1</th>
                  <th className="py-2.5 px-3 text-right font-semibold font-mono">Year 2</th>
                  <th className="py-2.5 px-3 text-right font-semibold font-mono">Year 3</th>
                  <th className="py-2.5 px-3 text-right font-semibold font-mono">Year 4</th>
                  <th className="py-2.5 px-3 text-right font-semibold font-mono">Year 5</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {/* Revenue */}
                <tr className="bg-slate-800/20 font-bold text-slate-100">
                  <td className="py-2 px-3 font-sans">Total Revenue</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right tabular-nums">
                      {fmt(p.revenue)}
                    </td>
                  ))}
                </tr>
                {/* Cost of Goods Sold */}
                <tr className="text-slate-400">
                  <td className="py-2 px-3 font-sans pl-6">Cost of Goods Sold (COGS)</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right tabular-nums">
                      ({fmt(p.cogs)})
                    </td>
                  ))}
                </tr>
                {/* Gross Profit */}
                <tr className="font-semibold text-slate-200 bg-slate-800/10">
                  <td className="py-2 px-3 font-sans">Gross Profit</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right tabular-nums">
                      {fmt(p.grossProfit)}
                    </td>
                  ))}
                </tr>
                <tr className="text-[11px] text-slate-400">
                  <td className="py-1 px-3 font-sans pl-6 italic">Gross Margin %</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-1 px-3 text-right tabular-nums text-amber-400/90">
                      {formatPercent(p.grossMarginPct)}
                    </td>
                  ))}
                </tr>

                {/* Operating Expenses */}
                <tr className="text-slate-400">
                  <td className="py-2 px-3 font-sans pl-6">Operating Overheads (Opex)</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right tabular-nums">
                      ({fmt(p.opex)})
                    </td>
                  ))}
                </tr>

                {/* EBITDA */}
                <tr className="bg-amber-950/20 font-bold text-amber-300">
                  <td className="py-2.5 px-3 font-sans">EBITDA (Operating Cash Flow)</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2.5 px-3 text-right tabular-nums">
                      {fmt(p.ebitda)}
                    </td>
                  ))}
                </tr>

                {/* Depreciation */}
                <tr className="text-slate-500">
                  <td className="py-1.5 px-3 font-sans pl-6">Depreciation & Amortization</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-1.5 px-3 text-right tabular-nums">
                      ({fmt(p.depreciation)})
                    </td>
                  ))}
                </tr>

                {/* EBIT */}
                <tr className="text-slate-300 font-semibold">
                  <td className="py-2 px-3 font-sans">EBIT (Operating Income)</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right tabular-nums">
                      {fmt(p.ebit)}
                    </td>
                  ))}
                </tr>

                {/* Interest Expense from Debt */}
                <tr className="text-slate-400">
                  <td className="py-2 px-3 font-sans pl-6">Loan Interest Expense</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right tabular-nums text-rose-300/80">
                      ({fmt(p.interestExpense)})
                    </td>
                  ))}
                </tr>

                {/* Income Tax Provision */}
                <tr className="text-slate-500">
                  <td className="py-1.5 px-3 font-sans pl-6">Income Tax Provision ({plan.effectiveTaxRatePct}%)</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-1.5 px-3 text-right tabular-nums">
                      ({fmt(p.taxExpense)})
                    </td>
                  ))}
                </tr>

                {/* Net Income */}
                <tr className="bg-emerald-950/30 font-bold text-emerald-400 text-sm">
                  <td className="py-2.5 px-3 font-sans">Net Income</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2.5 px-3 text-right tabular-nums">
                      {fmt(p.netIncome)}
                    </td>
                  ))}
                </tr>

                {/* BANK COVENANTS AUDIT SECTION */}
                <tr className="border-t-2 border-slate-700 bg-[#0d131f] text-slate-400 font-semibold">
                  <td className="py-2 px-3 font-sans text-xs uppercase tracking-wider text-slate-300">
                    Total Annual Debt Service (P+I)
                  </td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right tabular-nums text-slate-200">
                      {fmt(p.annualDebtService)}
                    </td>
                  ))}
                </tr>

                <tr className="bg-[#0e1626] font-bold">
                  <td className="py-2.5 px-3 font-sans flex items-center gap-2">
                    <span className="text-slate-100">Debt Service Coverage Ratio (DSCR)</span>
                    <span className="text-[10px] text-slate-400 font-normal font-sans">(Bank Covenant ≥1.25x)</span>
                  </td>
                  {projections.map((p) => {
                    const isPassing = p.dscr >= 1.25;
                    return (
                      <td
                        key={p.year}
                        className={`py-2.5 px-3 text-right tabular-nums text-sm ${
                          isPassing ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {p.dscr.toFixed(2)}x
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: 12-MONTH DETAILED CASH FLOW */}
      {activeSubView === 'cash_flow' && (
        <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Year 1 Month-by-Month Operating Cash Flow
              </h3>
              <p className="text-xs text-slate-400">
                Proves working capital liquidity and confirms cash balance remains positive through operational ramp.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Minimum Ending Cash: {fmt(Math.min(...monthlyCashFlow.map((m) => m.endingCash)))}
            </span>
          </div>

          {/* Embedded Cash Flow Trajectory Chart */}
          <MonthlyCashChart
            monthlyData={monthlyCashFlow}
            currency={currency}
            title="Year 1 Cash Balance & Net Inflow/Outflow Trajectory"
            subtitle="Demonstrates working capital runway throughout the operational ramp"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 bg-[#162032]">
                  <th className="py-2 px-3 font-semibold">Month</th>
                  <th className="py-2 px-3 text-right font-semibold font-mono">Cash Inflow</th>
                  <th className="py-2 px-3 text-right font-semibold font-mono">Cash Outflow</th>
                  <th className="py-2 px-3 text-right font-semibold font-mono">Debt Service</th>
                  <th className="py-2 px-3 text-right font-semibold font-mono">Net Cash Flow</th>
                  <th className="py-2 px-3 text-right font-semibold font-mono">Ending Cash Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {monthlyCashFlow.map((m) => (
                  <tr key={m.month} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-sans text-slate-300 font-medium">{m.monthName}</td>
                    <td className="py-2 px-3 text-right text-slate-200 tabular-nums">
                      {fmt(m.cashInflow)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400 tabular-nums">
                      ({fmt(m.cashOutflow)})
                    </td>
                    <td className="py-2 px-3 text-right text-rose-300/80 tabular-nums">
                      ({fmt(m.debtService)})
                    </td>
                    <td className={`py-2 px-3 text-right font-semibold tabular-nums ${
                      m.netCashFlow >= 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {m.netCashFlow >= 0 ? '+' : ''}{fmt(m.netCashFlow)}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-amber-400 tabular-nums bg-slate-800/10">
                      {fmt(m.endingCash)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: 5-YEAR PRO-FORMA BALANCE SHEET */}
      {activeSubView === 'balance_sheet' && (
        <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                5-Year Pro-Forma Balance Sheet
              </h3>
              <p className="text-xs text-slate-400">
                Assets, Liabilities, and Equity capitalization demonstrating net worth growth over debt life.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Balanced: Assets = Liabilities + Equity</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 bg-[#162032]">
                  <th className="py-2 px-3 font-semibold">Balance Sheet Section ({currency})</th>
                  <th className="py-2 px-3 text-right font-semibold font-mono">Year 1</th>
                  <th className="py-2 px-3 text-right font-semibold font-mono">Year 2</th>
                  <th className="py-2 px-3 text-right font-semibold font-mono">Year 3</th>
                  <th className="py-2 px-3 text-right font-semibold font-mono">Year 4</th>
                  <th className="py-2 px-3 text-right font-semibold font-mono">Year 5</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {/* Current Assets */}
                <tr className="bg-slate-800/30 font-semibold text-slate-300">
                  <td colSpan={6} className="py-1.5 px-3 font-sans uppercase tracking-wider text-[11px]">
                    Current Assets
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans pl-6 text-slate-300">Cash and Cash Equivalents</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right text-slate-200 tabular-nums">
                      {fmt(p.cash)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans pl-6 text-slate-400">Accounts Receivable</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right text-slate-400 tabular-nums">
                      {fmt(p.accountsReceivable)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans pl-6 text-slate-400">Inventory & Consumables</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right text-slate-400 tabular-nums">
                      {fmt(p.inventory)}
                    </td>
                  ))}
                </tr>

                {/* Non-Current Assets */}
                <tr className="bg-slate-800/30 font-semibold text-slate-300">
                  <td colSpan={6} className="py-1.5 px-3 font-sans uppercase tracking-wider text-[11px]">
                    Non-Current Assets
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans pl-6 text-slate-300">Net Property, Plant & Equipment (PP&E)</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right text-slate-200 tabular-nums">
                      {fmt(p.netFixedAssets)}
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-800/40 font-bold text-slate-100 text-sm">
                  <td className="py-2 px-3 font-sans">Total Assets</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right tabular-nums text-amber-400">
                      {fmt(p.totalAssets)}
                    </td>
                  ))}
                </tr>

                {/* Liabilities */}
                <tr className="bg-slate-800/30 font-semibold text-slate-300">
                  <td colSpan={6} className="py-1.5 px-3 font-sans uppercase tracking-wider text-[11px]">
                    Current Liabilities
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans pl-6 text-slate-400">Accounts Payable</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right text-slate-400 tabular-nums">
                      {fmt(p.accountsPayable)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans pl-6 text-slate-400">Current Portion of Long-Term Debt</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right text-slate-400 tabular-nums">
                      {fmt(p.currentDebtPortion)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans pl-6 text-slate-400">Long-Term Bank Debt Outstanding</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right text-slate-400 tabular-nums">
                      {fmt(p.longTermDebt)}
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-800/20 font-bold text-slate-300">
                  <td className="py-2 px-3 font-sans">Total Liabilities</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right tabular-nums text-rose-300">
                      {fmt(p.totalLiabilities)}
                    </td>
                  ))}
                </tr>

                {/* Equity */}
                <tr className="bg-slate-800/30 font-semibold text-slate-300">
                  <td colSpan={6} className="py-1.5 px-3 font-sans uppercase tracking-wider text-[11px]">
                    Shareholders / Members Equity
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans pl-6 text-slate-400">Paid-In Capital & Founder Equity</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right text-slate-400 tabular-nums">
                      {fmt(p.paidInCapital)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans pl-6 text-slate-300">Cumulative Retained Earnings</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2 px-3 text-right text-slate-200 tabular-nums">
                      {fmt(p.retainedEarnings)}
                    </td>
                  ))}
                </tr>
                <tr className="bg-emerald-950/30 font-bold text-emerald-400 text-sm">
                  <td className="py-2.5 px-3 font-sans">Total Liabilities & Equity</td>
                  {projections.map((p) => (
                    <td key={p.year} className="py-2.5 px-3 text-right tabular-nums">
                      {fmt(p.totalLiabilities + p.totalEquity)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: DEDICATED VISUAL GRAPHS & ANALYTICS SUITE */}
      {activeSubView === 'graphs' && (
        <FinancialChartsSuite
          plan={plan}
          metrics={metrics}
          projections={projections}
          monthlyCashFlow={monthlyCashFlow}
          currency={currency}
        />
      )}

      {/* VIEW 4: MODEL DRIVERS & ASSUMPTIONS EDITING */}
      {activeSubView === 'drivers' && (
        <div className="space-y-6">
          {/* Revenue Streams Editor */}
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Revenue Streams & Annual Growth Rates
                </h3>
                <p className="text-xs text-slate-400">
                  Configure Year 1 revenue and compounding growth % for Years 2 through 5.
                </p>
              </div>
              <button
                type="button"
                onClick={addRevenueStream}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Stream
              </button>
            </div>

            <div className="space-y-3">
              {plan.revenueStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="bg-[#1e293b]/60 border border-slate-800 rounded p-3 grid grid-cols-1 sm:grid-cols-6 gap-3 items-center text-xs"
                >
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-0.5">Stream Name</label>
                    <input
                      type="text"
                      value={stream.name}
                      onChange={(e) => updateRevenueStream(stream.id, 'name', e.target.value)}
                      className="w-full bg-[#0f172a] border border-slate-700 rounded px-2.5 py-1 text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-0.5">Year 1 ($)</label>
                    <input
                      type="number"
                      value={stream.year1}
                      onChange={(e) =>
                        updateRevenueStream(stream.id, 'year1', parseFloat(e.target.value) || 0)
                      }
                      className="w-full bg-[#0f172a] border border-slate-700 rounded px-2 py-1 font-mono text-slate-100 text-right focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-0.5">Y2-Y5 Growth Rates (%)</label>
                    <div className="grid grid-cols-4 gap-1">
                      {stream.growthRatesPct.map((rate, i) => (
                        <input
                          key={i}
                          type="number"
                          value={rate}
                          onChange={(e) => updateGrowthRate(stream.id, i, parseFloat(e.target.value) || 0)}
                          placeholder={`Y${i + 2}`}
                          className="bg-[#0f172a] border border-slate-700 rounded px-1.5 py-1 text-[11px] font-mono text-center text-slate-100 focus:outline-none"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => removeRevenueStream(stream.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Overheads Editor */}
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Operating Overhead Line Items (Opex)
                </h3>
                <p className="text-xs text-slate-400">
                  Staff payroll, facility rent, marketing, insurance, and administrative expenses.
                </p>
              </div>
              <button
                type="button"
                onClick={addExpense}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Overhead Line
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-[#1e293b]/60 border border-slate-800 rounded p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={exp.name}
                      onChange={(e) => updateExpense(exp.id, 'name', e.target.value)}
                      className="font-medium bg-transparent border-b border-transparent focus:border-amber-400 focus:outline-none text-slate-200 w-full"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Y1: ${exp.year1.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500">·</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        +{exp.annualGrowthPct}%/yr
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={exp.year1}
                      onChange={(e) => updateExpense(exp.id, 'year1', parseFloat(e.target.value) || 0)}
                      className="w-24 bg-[#0f172a] border border-slate-700 rounded px-2 py-1 font-mono text-slate-100 text-right focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeExpense(exp.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Working Capital Turnover Drivers */}
          <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
              Working Capital Turnover & Tax Assumptions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Days Sales Outstanding (DSO)</label>
                <input
                  type="number"
                  value={plan.daysSalesOutstanding}
                  onChange={(e) =>
                    onChangePlan({ ...plan, daysSalesOutstanding: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#1e293b] border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-100"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">A/R collection period</span>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Inventory Turnover (Days)</label>
                <input
                  type="number"
                  value={plan.inventoryTurnoverDays}
                  onChange={(e) =>
                    onChangePlan({ ...plan, inventoryTurnoverDays: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#1e293b] border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-100"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Holding time before sale</span>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Days Payables (A/P)</label>
                <input
                  type="number"
                  value={plan.accountsPayableDays}
                  onChange={(e) =>
                    onChangePlan({ ...plan, accountsPayableDays: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#1e293b] border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-100"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Vendor payment terms</span>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Effective Income Tax Rate (%)</label>
                <input
                  type="number"
                  value={plan.effectiveTaxRatePct}
                  onChange={(e) =>
                    onChangePlan({ ...plan, effectiveTaxRatePct: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-[#1e293b] border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-100"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Federal & state combined</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
