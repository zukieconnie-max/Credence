import React from 'react';
import { 
  Shield, 
  Coins, 
  CreditCard, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  FileCheck,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  BusinessPlan, 
  CollateralItem, 
  ComputedMetrics, 
  ExistingDebtItem 
} from '../types/businessPlan';
import { 
  formatCurrency, 
  formatPercent, 
  generateAmortizationSchedule 
} from '../utils/financialCalculations';
import { DonutPieChart } from './charts/DonutPieChart';

interface CollateralAndDebtTabProps {
  plan: BusinessPlan;
  metrics: ComputedMetrics;
  onChangePlan: (updated: BusinessPlan) => void;
}

export const CollateralAndDebtTab: React.FC<CollateralAndDebtTabProps> = ({
  plan,
  metrics,
  onChangePlan,
}) => {
  const currency = plan.currency || 'USD';
  const fmt = (num: number, hideDec: boolean = true) => formatCurrency(num, hideDec, currency);

  const amortSchedule = generateAmortizationSchedule(
    plan.loanRequest.amount,
    plan.loanRequest.interestRatePct,
    plan.loanRequest.termMonths
  );

  // Collateral management
  const addCollateral = () => {
    const newItem: CollateralItem = {
      id: `collateral-${Date.now()}`,
      assetType: 'machinery_equipment',
      description: 'Machinery / Equipment Asset',
      costBasis: 100000,
      fairMarketValue: 100000,
      advanceRatePct: 70,
      priorLiens: 0,
    };
    onChangePlan({
      ...plan,
      collateral: [...plan.collateral, newItem],
    });
  };

  const removeCollateral = (id: string) => {
    onChangePlan({
      ...plan,
      collateral: plan.collateral.filter((c) => c.id !== id),
    });
  };

  const updateCollateral = (id: string, field: keyof CollateralItem, value: any) => {
    onChangePlan({
      ...plan,
      collateral: plan.collateral.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  // Existing debt management
  const addDebt = () => {
    const newDebt: ExistingDebtItem = {
      id: `debt-${Date.now()}`,
      creditorName: 'Equipment Lender / Bank',
      originalAmount: 150000,
      currentBalance: 80000,
      interestRatePct: 7.0,
      monthlyPayment: 2500,
      maturityDate: '2028-12-31',
      refinanceWithNewLoan: false,
    };
    onChangePlan({
      ...plan,
      existingDebts: [...plan.existingDebts, newDebt],
    });
  };

  const removeDebt = (id: string) => {
    onChangePlan({
      ...plan,
      existingDebts: plan.existingDebts.filter((d) => d.id !== id),
    });
  };

  const updateDebt = (id: string, field: keyof ExistingDebtItem, value: any) => {
    onChangePlan({
      ...plan,
      existingDebts: plan.existingDebts.map((d) =>
        d.id === id ? { ...d, [field]: value } : d
      ),
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Collateral Schedule & Advance Rate Coverage (Lenders' Secondary Repayment Source) */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Collateral Schedule & Loan-to-Value (LTV) Coverage
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Banks apply regulatory advance rate haircuts to determine liquidation value if secondary repayment is triggered.
            </p>
          </div>

          <button
            type="button"
            onClick={addCollateral}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-400 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/80 rounded transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Collateral Asset
          </button>
        </div>

        {/* LTV & Collateral Summary Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-[#162032] border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block font-sans">Total Collateral FMV</span>
            <span className="text-lg font-bold font-mono text-slate-100 tabular-nums">
              {fmt(metrics.totalCollateralFMV)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-sans">Discounted Liquidation Value</span>
            <span className="text-lg font-bold font-mono text-amber-400 tabular-nums">
              {fmt(metrics.totalDiscountedCollateral)}
            </span>
            <span className="text-[10px] text-slate-500 font-sans">After bank advance haircuts</span>
          </div>
          <div>
            <span className="text-slate-400 block font-sans">Loan-to-Value (LTV)</span>
            <span className={`text-lg font-bold font-mono tabular-nums ${
              metrics.loanToValuePct <= 85 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {metrics.loanToValuePct.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 font-sans">Target: ≤ 80-85%</span>
          </div>
          <div>
            <span className="text-slate-400 block font-sans">Coverage Ratio</span>
            <span className={`text-lg font-bold font-mono tabular-nums ${
              metrics.meetsCollateralBenchmark ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {metrics.collateralCoverageRatio.toFixed(2)}x
            </span>
            <span className="text-[10px] text-slate-500 font-sans">
              {metrics.meetsCollateralBenchmark ? 'Fully Secured (≥0.85x)' : 'Under-collateralized'}
            </span>
          </div>
        </div>

        {/* Visual Distribution of Collateral */}
        {plan.collateral.length > 0 && (
          <div className="p-4 bg-[#0a0f1d] border border-slate-800/80 rounded-lg">
            <DonutPieChart
              title="Collateral Asset Composition (FMV)"
              subtitle="Breakdown of pledged asset categories"
              slices={plan.collateral.map((item, idx) => ({
                id: item.id,
                label: item.description,
                value: item.fairMarketValue,
                color: ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'][idx % 6],
              }))}
              currency={currency}
            />
          </div>
        )}

        {/* Collateral Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 bg-[#162032]">
                <th className="py-2.5 px-3 font-semibold">Asset Description</th>
                <th className="py-2.5 px-3 font-semibold">Asset Category</th>
                <th className="py-2.5 px-3 text-right font-semibold">Market Value (FMV)</th>
                <th className="py-2.5 px-3 text-right font-semibold">Bank Advance %</th>
                <th className="py-2.5 px-3 text-right font-semibold">Prior Liens</th>
                <th className="py-2.5 px-3 text-right font-semibold">Discounted Value</th>
                <th className="py-2.5 px-2 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {plan.collateral.map((item) => {
                const discountedVal = Math.max(
                  0,
                  item.fairMarketValue * (item.advanceRatePct / 100) - item.priorLiens
                );
                return (
                  <tr key={item.id} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-sans">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateCollateral(item.id, 'description', e.target.value)}
                        className="bg-transparent border-b border-transparent focus:border-amber-400 focus:outline-none text-slate-200 text-xs w-full"
                      />
                    </td>
                    <td className="py-2 px-3 font-sans">
                      <select
                        value={item.assetType}
                        onChange={(e) => updateCollateral(item.id, 'assetType', e.target.value)}
                        className="bg-[#0f172a] border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-300"
                      >
                        <option value="commercial_real_estate">Commercial Real Estate (80%)</option>
                        <option value="machinery_equipment">Machinery & Equipment (70%)</option>
                        <option value="accounts_receivable">Accounts Receivable (75%)</option>
                        <option value="inventory">Inventory & Goods (50%)</option>
                        <option value="cash_deposits">Cash / Pledged Deposits (100%)</option>
                        <option value="other">Other Assets (25%)</option>
                      </select>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={item.fairMarketValue}
                        onChange={(e) =>
                          updateCollateral(item.id, 'fairMarketValue', parseFloat(e.target.value) || 0)
                        }
                        className="w-24 bg-[#0f172a] border border-slate-700 rounded px-2 py-1 text-right text-xs text-slate-200"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          value={item.advanceRatePct}
                          onChange={(e) =>
                            updateCollateral(item.id, 'advanceRatePct', parseFloat(e.target.value) || 0)
                          }
                          className="w-14 bg-[#0f172a] border border-slate-700 rounded px-1.5 py-1 text-right text-xs text-slate-200"
                        />
                        <span className="text-slate-400 text-xs">%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={item.priorLiens}
                        onChange={(e) =>
                          updateCollateral(item.id, 'priorLiens', parseFloat(e.target.value) || 0)
                        }
                        className="w-20 bg-[#0f172a] border border-slate-700 rounded px-2 py-1 text-right text-xs text-rose-300"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-semibold text-amber-400 tabular-nums">
                      {fmt(discountedVal)}
                    </td>
                    <td className="py-2 px-2 text-center font-sans">
                      <button
                        type="button"
                        onClick={() => removeCollateral(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Existing Debt Schedule */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              Existing Liabilities & Debt Schedule
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Current outstanding promissory notes, equipment leases, or revolving credit lines.
            </p>
          </div>

          <button
            type="button"
            onClick={addDebt}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-400 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/80 rounded transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Existing Note
          </button>
        </div>

        {plan.existingDebts.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-[#1e293b]/30 rounded-lg border border-slate-800">
            No existing funded debt listed. Applicant operates with a clean liability structure.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 bg-[#162032]">
                  <th className="py-2 px-3 font-semibold">Creditor / Note</th>
                  <th className="py-2 px-3 text-right font-semibold">Current Balance</th>
                  <th className="py-2 px-3 text-right font-semibold">Interest Rate</th>
                  <th className="py-2 px-3 text-right font-semibold">Monthly Payment</th>
                  <th className="py-2 px-3 text-center font-semibold">Refinance with Loan?</th>
                  <th className="py-2 px-2 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {plan.existingDebts.map((debt) => (
                  <tr key={debt.id} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-sans">
                      <input
                        type="text"
                        value={debt.creditorName}
                        onChange={(e) => updateDebt(debt.id, 'creditorName', e.target.value)}
                        className="bg-transparent border-b border-transparent focus:border-amber-400 focus:outline-none text-slate-200 text-xs w-full"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        value={debt.currentBalance}
                        onChange={(e) =>
                          updateDebt(debt.id, 'currentBalance', parseFloat(e.target.value) || 0)
                        }
                        className="w-24 bg-[#0f172a] border border-slate-700 rounded px-2 py-1 text-right text-xs text-slate-200"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          step="0.1"
                          value={debt.interestRatePct}
                          onChange={(e) =>
                            updateDebt(debt.id, 'interestRatePct', parseFloat(e.target.value) || 0)
                          }
                          className="w-14 bg-[#0f172a] border border-slate-700 rounded px-1.5 py-1 text-right text-xs text-slate-200"
                        />
                        <span className="text-slate-400 text-xs">%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right text-slate-200">
                      <input
                        type="number"
                        value={debt.monthlyPayment}
                        onChange={(e) =>
                          updateDebt(debt.id, 'monthlyPayment', parseFloat(e.target.value) || 0)
                        }
                        className="w-20 bg-[#0f172a] border border-slate-700 rounded px-2 py-1 text-right text-xs text-slate-200"
                      />
                    </td>
                    <td className="py-2 px-3 text-center font-sans">
                      <input
                        type="checkbox"
                        checked={debt.refinanceWithNewLoan}
                        onChange={(e) => updateDebt(debt.id, 'refinanceWithNewLoan', e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                      />
                    </td>
                    <td className="py-2 px-2 text-center font-sans">
                      <button
                        type="button"
                        onClick={() => removeDebt(debt.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Requested Loan Amortization Schedule Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-400" />
              Proposed Loan Amortization Schedule
            </h3>
            <p className="text-xs text-slate-400">
              Breakdown of annual principal paydown and interest cost over the financing horizon.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Term: {plan.loanRequest.termMonths} Months ({plan.loanRequest.interestRatePct}% Rate)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 bg-[#162032]">
                <th className="py-2 px-3 font-semibold">Period</th>
                <th className="py-2 px-3 text-right font-semibold">Beginning Balance</th>
                <th className="py-2 px-3 text-right font-semibold">Annual Payment (P+I)</th>
                <th className="py-2 px-3 text-right font-semibold">Principal Repayment</th>
                <th className="py-2 px-3 text-right font-semibold">Interest Expense</th>
                <th className="py-2 px-3 text-right font-semibold">Ending Loan Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {amortSchedule.map((row) => (
                <tr key={row.period} className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 font-sans text-slate-300 font-medium">{row.label}</td>
                  <td className="py-2 px-3 text-right text-slate-300 tabular-nums">
                    {fmt(row.beginningBalance)}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-100 font-semibold tabular-nums">
                    {fmt(row.payment)}
                  </td>
                  <td className="py-2 px-3 text-right text-emerald-400 tabular-nums">
                    {fmt(row.principal)}
                  </td>
                  <td className="py-2 px-3 text-right text-rose-300/80 tabular-nums">
                    {fmt(row.interest)}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-amber-400 tabular-nums">
                    {fmt(row.endingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
