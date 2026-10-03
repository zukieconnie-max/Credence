import React from 'react';
import { 
  DollarSign, 
  HelpCircle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Landmark,
  Calculator,
  Coins,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  BusinessPlan, 
  ComputedMetrics, 
  LoanFacilityType, 
  SourceItem, 
  UseItem 
} from '../types/businessPlan';
import { formatCurrency, formatPercent } from '../utils/financialCalculations';
import { SUPPORTED_CURRENCIES, getCurrencyConfig, formatPlanCurrency } from '../utils/currency';
import { DonutPieChart, PieSlice } from './charts/DonutPieChart';

interface CreditOverviewTabProps {
  plan: BusinessPlan;
  metrics: ComputedMetrics;
  onChangePlan: (updated: BusinessPlan) => void;
}

export const CreditOverviewTab: React.FC<CreditOverviewTabProps> = ({
  plan,
  metrics,
  onChangePlan,
}) => {
  const currency = plan.currency || 'USD';
  const currencyConfig = getCurrencyConfig(currency);

  const updateCurrency = (currCode: string) => {
    onChangePlan({
      ...plan,
      currency: currCode,
    });
  };

  const updateLoanRequest = (field: string, value: any) => {
    onChangePlan({
      ...plan,
      loanRequest: {
        ...plan.loanRequest,
        [field]: value,
      },
    });
  };

  const updateStage = (stage: 'running_business' | 'business_idea') => {
    onChangePlan({
      ...plan,
      stage,
    });
  };

  // Sources management
  const addSource = () => {
    const newSource: SourceItem = {
      id: `source-${Date.now()}`,
      sourceName: 'Additional Funding Source',
      category: 'borrower_cash_equity',
      amount: 50000,
    };
    onChangePlan({
      ...plan,
      sourcesAndUses: {
        ...plan.sourcesAndUses,
        sources: [...plan.sourcesAndUses.sources, newSource],
      },
    });
  };

  const removeSource = (id: string) => {
    onChangePlan({
      ...plan,
      sourcesAndUses: {
        ...plan.sourcesAndUses,
        sources: plan.sourcesAndUses.sources.filter((s) => s.id !== id),
      },
    });
  };

  const updateSource = (id: string, field: keyof SourceItem, value: any) => {
    onChangePlan({
      ...plan,
      sourcesAndUses: {
        ...plan.sourcesAndUses,
        sources: plan.sourcesAndUses.sources.map((s) =>
          s.id === id ? { ...s, [field]: value } : s
        ),
      },
    });
  };

  // Uses management
  const addUse = () => {
    const newUse: UseItem = {
      id: `use-${Date.now()}`,
      description: 'Capital Expenditure / Use',
      category: 'working_capital',
      amount: 50000,
    };
    onChangePlan({
      ...plan,
      sourcesAndUses: {
        ...plan.sourcesAndUses,
        uses: [...plan.sourcesAndUses.uses, newUse],
      },
    });
  };

  const removeUse = (id: string) => {
    onChangePlan({
      ...plan,
      sourcesAndUses: {
        ...plan.sourcesAndUses,
        uses: plan.sourcesAndUses.uses.filter((u) => u.id !== id),
      },
    });
  };

  const updateUse = (id: string, field: keyof UseItem, value: any) => {
    onChangePlan({
      ...plan,
      sourcesAndUses: {
        ...plan.sourcesAndUses,
        uses: plan.sourcesAndUses.uses.map((u) =>
          u.id === id ? { ...u, [field]: value } : u
        ),
      },
    });
  };

  const isSourcesUsesBalanced = Math.abs(metrics.sourcesUsesDelta) < 1;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner: Stage & Plan Title */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Commercial Credit Facility Term Sheet
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Section 1.0</span>
          </div>
          <input
            type="text"
            value={plan.title}
            onChange={(e) => onChangePlan({ ...plan, title: e.target.value })}
            className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-slate-700 focus:border-amber-400 focus:outline-none text-slate-100 w-full"
            placeholder="Plan Title..."
          />
        </div>

        {/* Business Stage Segmented Control (Functional tab buttons) */}
        <div className="flex items-center gap-1 bg-[#1e293b] p-1 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => updateStage('running_business')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              plan.stage === 'running_business'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Running Business (Historical Data)
          </button>
          <button
            type="button"
            onClick={() => updateStage('business_idea')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              plan.stage === 'business_idea'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            New Venture Idea / Startup
          </button>
        </div>
      </div>

      {/* Grid: Loan Facility Inputs + Calculated Underwriting Amortization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loan Request Terms Inputs */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-400" />
              Requested Credit Facility Structure
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Facility Currency:</span>
              <div className="flex items-center gap-1 bg-[#1e293b] border border-slate-700 rounded px-2 py-1 text-xs">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <select
                  value={currency}
                  onChange={(e) => updateCurrency(e.target.value)}
                  className="bg-transparent text-slate-200 text-xs font-mono focus:outline-none cursor-pointer"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Requested Loan Amount ({currencyConfig.symbol})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">{currencyConfig.symbol}</span>
                <input
                  type="number"
                  value={plan.loanRequest.amount}
                  onChange={(e) => updateLoanRequest('amount', Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 pl-9 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Facility / Program Type
              </label>
              <select
                value={plan.loanRequest.facilityType}
                onChange={(e) => updateLoanRequest('facilityType', e.target.value as LoanFacilityType)}
                className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              >
                <option value="commercial_term_loan">Commercial Term Loan (Direct)</option>
                <option value="sba_7a">SBA 7(a) Guarantee Loan</option>
                <option value="sba_504">SBA 504 Real Estate / Equipment</option>
                <option value="revolving_line_of_credit">Revolving Line of Credit (LOC)</option>
                <option value="equipment_financing">Equipment Financing / Lease</option>
                <option value="commercial_real_estate">Commercial Mortgage (CRE)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Loan Term (Months)
              </label>
              <input
                type="number"
                value={plan.loanRequest.termMonths}
                onChange={(e) => updateLoanRequest('termMonths', Math.max(6, parseInt(e.target.value) || 12))}
                className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-400"
              />
              <span className="text-[11px] text-slate-500 mt-1 block font-mono">
                {(plan.loanRequest.termMonths / 12).toFixed(1)} Years
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Assumed Interest Rate (% per annum)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.05"
                  value={plan.loanRequest.interestRatePct}
                  onChange={(e) => updateLoanRequest('interestRatePct', parseFloat(e.target.value) || 0)}
                  className="w-2/3 bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                />
                <select
                  value={plan.loanRequest.rateType}
                  onChange={(e) => updateLoanRequest('rateType', e.target.value as 'fixed' | 'variable')}
                  className="w-1/3 bg-[#1e293b] border border-slate-700 rounded px-2 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="fixed">Fixed</option>
                  <option value="variable">Variable</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Specific Purpose & Use of Proceeds
              </label>
              <textarea
                rows={2}
                value={plan.loanRequest.purpose}
                onChange={(e) => updateLoanRequest('purpose', e.target.value)}
                placeholder="Describe exact business objective (e.g. acquire equipment, build out facility, provide working capital)..."
                className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Calculated Debt Service Card */}
        <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-400" />
                Debt Service Requirements
              </h3>
              <span className="text-[10px] font-mono text-slate-400">AMORTIZED</span>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <span className="text-xs text-slate-400 block">Monthly Loan Payment (P+I)</span>
                <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  {formatCurrency(metrics.monthlyPayment, false, currency)}
                </span>
                <span className="text-[11px] text-slate-500 block">Principal + Interest</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
                <div>
                  <span className="text-xs text-slate-400 block">Annual Debt Service</span>
                  <span className="text-sm font-semibold font-mono text-slate-200 tabular-nums">
                    {formatCurrency(metrics.annualDebtService, true, currency)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Total Lifetime Interest</span>
                  <span className="text-sm font-semibold font-mono text-slate-200 tabular-nums">
                    {formatCurrency(metrics.totalInterestOverLife, true, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b]/70 rounded p-3 text-xs space-y-1.5 border border-slate-800">
            <span className="font-semibold text-slate-300 block">Commercial Credit Note:</span>
            <p className="text-slate-400 leading-relaxed">
              Financial institutions will test that your Net Operating Income (EBITDA) is at least <strong className="text-slate-200">1.25x</strong> this annual debt service to avoid loan covenant default.
            </p>
          </div>
        </div>
      </div>

      {/* Sources & Uses of Funds Matrix (Mandatory for Commercial Underwriting) */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              Sources & Uses of Funds Schedule
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Every bank credit committee requires a balanced Sources and Uses statement detailing borrower cash equity contribution.
            </p>
          </div>

          {/* Equity Compliance Marker */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span>Borrower Equity Injection:</span>
            <span className={`font-bold px-2 py-0.5 rounded ${
              metrics.meetsEquityBenchmark ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
            }`}>
              {metrics.equityInjectionPct.toFixed(1)}% ({formatCurrency(metrics.borrowerEquityAmount, true, currency)})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sources Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Sources of Capital</h3>
              <button
                type="button"
                onClick={addSource}
                className="text-xs flex items-center gap-1 text-amber-400 hover:text-amber-300"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Source
              </button>
            </div>

            <div className="space-y-2">
              {plan.sourcesAndUses.sources.map((source) => (
                <div key={source.id} className="flex items-center gap-2 bg-[#1e293b]/60 p-2 rounded border border-slate-800">
                  <input
                    type="text"
                    value={source.sourceName}
                    onChange={(e) => updateSource(source.id, 'sourceName', e.target.value)}
                    className="flex-1 bg-transparent border-b border-transparent focus:border-amber-400 focus:outline-none text-xs text-slate-200"
                    placeholder="Source description..."
                  />
                  <select
                    value={source.category}
                    onChange={(e) => updateSource(source.id, 'category', e.target.value)}
                    className="bg-[#0f172a] border border-slate-700 text-[11px] text-slate-300 rounded px-2 py-1 focus:outline-none"
                  >
                    <option value="senior_bank_debt">Senior Bank Debt</option>
                    <option value="borrower_cash_equity">Borrower Cash Equity</option>
                    <option value="subordinated_debt">Subordinated Debt</option>
                    <option value="seller_financing">Seller Note</option>
                    <option value="grant_other">Grant / Other</option>
                  </select>
                  <div className="relative w-28">
                    <span className="absolute left-2 top-1.5 text-slate-400 text-xs font-mono">{currencyConfig.symbol}</span>
                    <input
                      type="number"
                      value={source.amount}
                      onChange={(e) => updateSource(source.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#0f172a] border border-slate-700 rounded px-2 py-1 pl-6 text-xs font-mono text-right text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSource(source.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Remove source"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400 font-sans">Total Sources:</span>
              <span className="font-bold text-slate-100 tabular-nums">
                {formatCurrency(metrics.totalSources, true, currency)}
              </span>
            </div>
          </div>

          {/* Uses Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Uses of Capital</h3>
              <button
                type="button"
                onClick={addUse}
                className="text-xs flex items-center gap-1 text-amber-400 hover:text-amber-300"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Use
              </button>
            </div>

            <div className="space-y-2">
              {plan.sourcesAndUses.uses.map((use) => (
                <div key={use.id} className="flex items-center gap-2 bg-[#1e293b]/60 p-2 rounded border border-slate-800">
                  <input
                    type="text"
                    value={use.description}
                    onChange={(e) => updateUse(use.id, 'description', e.target.value)}
                    className="flex-1 bg-transparent border-b border-transparent focus:border-amber-400 focus:outline-none text-xs text-slate-200"
                    placeholder="Use description..."
                  />
                  <select
                    value={use.category}
                    onChange={(e) => updateUse(use.id, 'category', e.target.value)}
                    className="bg-[#0f172a] border border-slate-700 text-[11px] text-slate-300 rounded px-2 py-1 focus:outline-none"
                  >
                    <option value="machinery_equipment">Machinery & Equipment</option>
                    <option value="leasehold_improvements">Leasehold Improvements</option>
                    <option value="real_estate">Real Estate Purchase</option>
                    <option value="inventory">Inventory & Supplies</option>
                    <option value="working_capital">Working Capital Reserve</option>
                    <option value="refinance_debt">Refinance Existing Debt</option>
                    <option value="closing_legal_fees">Closing & Legal Fees</option>
                  </select>
                  <div className="relative w-28">
                    <span className="absolute left-2 top-1.5 text-slate-400 text-xs font-mono">{currencyConfig.symbol}</span>
                    <input
                      type="number"
                      value={use.amount}
                      onChange={(e) => updateUse(use.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#0f172a] border border-slate-700 rounded px-2 py-1 pl-6 text-xs font-mono text-right text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeUse(use.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Remove use"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400 font-sans">Total Uses:</span>
              <span className="font-bold text-slate-100 tabular-nums">
                {formatCurrency(metrics.totalUses, true, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Charts: Sources & Uses Graphic Distribution */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <PieIcon className="w-3.5 h-3.5 text-amber-400" />
            Visual Capital Breakdown (Sources vs Uses)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DonutPieChart
              title="Sources of Funding"
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
              title="Allocation of Proceeds"
              subtitle="Capital Deployment"
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

        {/* Balance Status Footer */}
        <div className={`p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
          isSourcesUsesBalanced 
            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200' 
            : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {isSourcesUsesBalanced ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div className="text-xs">
              <span className="font-semibold block">
                {isSourcesUsesBalanced ? 'Sources and Uses are Balanced (100% Accounted)' : 'Variance Detected: Sources do not equal Uses'}
              </span>
              <span className="text-slate-400">
                {isSourcesUsesBalanced 
                  ? 'Ready for credit committee submission.' 
                  : `Delta of ${formatCurrency(Math.abs(metrics.sourcesUsesDelta), true, currency)} must be resolved.`}
              </span>
            </div>
          </div>

          <div className="text-xs font-mono text-right shrink-0">
            <span className="text-slate-400 block font-sans">Required Equity Threshold:</span>
            <span className={metrics.meetsEquityBenchmark ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
              {metrics.meetsEquityBenchmark ? 'Passed (≥ 10%)' : 'Caution: < 10% Equity Injection'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
