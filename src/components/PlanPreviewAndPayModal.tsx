import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Printer, 
  Download, 
  X, 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Receipt, 
  ExternalLink,
  Coins,
  ChevronRight,
  Landmark,
  Copy,
  Check,
  Settings,
  HelpCircle,
  Wallet
} from 'lucide-react';
import { BusinessPlan, ComputedMetrics } from '../types/businessPlan';
import { BusinessUser, PaymentReceipt } from '../types/auth';
import { formatCurrency, formatPercent, compute5YearProjections } from '../utils/financialCalculations';
import { BarChart5Year } from './charts/BarChart5Year';
import { DscrCovenantChart } from './charts/DscrCovenantChart';
import { AuthService } from '../utils/authService';
import { MerchantBankService, MerchantBankConfig } from '../utils/merchantBankService';
import { BankPayoutSettingsModal } from './BankPayoutSettingsModal';

interface PlanPreviewAndPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: BusinessPlan;
  metrics: ComputedMetrics;
  user: BusinessUser | null;
  onPlanPaid: (updatedPlan: BusinessPlan, receipt: PaymentReceipt) => void;
  onOpenAuth: () => void;
  onTriggerPrint: () => void;
  onOpenBankSettings?: () => void;
}

export const PlanPreviewAndPayModal: React.FC<PlanPreviewAndPayModalProps> = ({
  isOpen,
  onClose,
  plan,
  metrics,
  user,
  onPlanPaid,
  onOpenAuth,
  onTriggerPrint,
  onOpenBankSettings,
}) => {
  const [activeStep, setActiveStep] = useState<'preview' | 'checkout' | 'receipt'>(
    plan.isPaid ? 'receipt' : 'preview'
  );
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'google_pay' | 'ach_transfer'>('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('884');
  const [cardZip, setCardZip] = useState('78705');
  const [cardName, setCardName] = useState(user?.fullName || 'Authorized Corporate Officer');
  const [billingEmail, setBillingEmail] = useState(user?.workEmail || 'billing@company.com');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<PaymentReceipt | null>(plan.paymentReceipt || null);

  // Connected Merchant Bank State & Settings
  const [merchantBank, setMerchantBank] = useState<MerchantBankConfig>(() => MerchantBankService.getConfig());
  const [isBankSettingsOpen, setIsBankSettingsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Bank Form State for editing
  const [editBankName, setEditBankName] = useState(merchantBank.bankName);
  const [editAccountHolder, setEditAccountHolder] = useState(merchantBank.accountHolder);
  const [editRouting, setEditRouting] = useState(merchantBank.routingNumber);
  const [editAccount, setEditAccount] = useState(merchantBank.accountNumber);
  const [editSwift, setEditSwift] = useState(merchantBank.swiftBic);
  const [editSchedule, setEditSchedule] = useState(merchantBank.payoutSchedule);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveBankSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MerchantBankConfig = {
      ...merchantBank,
      bankName: editBankName,
      accountHolder: editAccountHolder,
      routingNumber: editRouting,
      accountNumber: editAccount,
      swiftBic: editSwift,
      payoutSchedule: editSchedule,
    };
    setMerchantBank(updated);
    MerchantBankService.saveConfig(updated);
    setIsBankSettingsOpen(false);
  };

  const currency = plan.currency || 'USD';
  const projections = compute5YearProjections(plan);

  if (!isOpen) return null;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const receipt: PaymentReceipt = {
        id: `rcpt_${Date.now()}`,
        planId: plan.id,
        planTitle: plan.title,
        amount: 8.0,
        currency,
        paymentMethod,
        last4: cardNumber.replace(/\D/g, '').slice(-4) || '4242',
        cardBrand: 'Visa Commercial Business',
        transactionId: `tx_credence_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        paidAt: new Date().toISOString(),
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'completed',
        billingEmail,
        billingName: cardName,
      };

      // Save to auth service
      AuthService.recordPurchase(plan.id, receipt);

      // Update plan state
      const updatedPlan: BusinessPlan = {
        ...plan,
        isPaid: true,
        paymentReceipt: receipt,
        updatedAt: new Date().toISOString(),
      };

      setCompletedReceipt(receipt);
      setIsProcessing(false);
      setActiveStep('receipt');
      onPlanPaid(updatedPlan, receipt);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-6 bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#162032] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 font-sans">
                  {plan.title || 'Commercial Business Plan'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Flat Fee $8.00 / Plan
                </span>
                {plan.isPaid && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Paid & Certified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Review your complete commercial credit underwriting package before unlocking official PDF certification.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Step Indicators */}
            <div className="hidden sm:flex items-center gap-1 bg-[#1e293b] p-1 rounded-lg text-xs">
              <button
                onClick={() => setActiveStep('preview')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeStep === 'preview'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Plan Preview
              </button>
              <button
                onClick={() => setActiveStep(plan.isPaid ? 'receipt' : 'checkout')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeStep === 'checkout' || activeStep === 'receipt'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {plan.isPaid ? '2. Official Receipt' : '2. Unlock for $8'}
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: EXECUTIVE PLAN PREVIEW */}
          {activeStep === 'preview' && (
            <div className="space-y-6">
              {/* Pre-Payment Notice / Call to Action Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-600/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                      Pre-Payment Executive Verification Preview
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Verify all credit metrics, debt service coverage, and capital allocations below. Once satisfied, unlock the unwatermarked official package for a flat fee of $8.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStep(plan.isPaid ? 'receipt' : 'checkout')}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow shrink-0 flex items-center gap-2"
                >
                  <span>{plan.isPaid ? 'View Certified Receipt' : 'Looks Good — Unlock for $8'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Document Watermark Container */}
              <div className="relative border border-slate-700/80 rounded-xl p-6 sm:p-8 bg-[#111827] space-y-6 shadow-inner">
                {/* Diagonal subtle watermark background */}
                {!plan.isPaid && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-5">
                    <span className="text-6xl sm:text-8xl font-black uppercase text-slate-100 rotate-[-25deg] select-none tracking-widest">
                      PREVIEW ONLY • $8
                    </span>
                  </div>
                )}

                {/* Dossier Header Exhibit */}
                <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold block">
                      COMMERCIAL CREDIT APPLICATION & UNDERWRITING MEMO
                    </span>
                    <h3 className="text-xl font-bold text-slate-100 mt-0.5 font-serif">
                      {plan.entityInfo.companyName}
                    </h3>
                    <div className="text-xs text-slate-400 font-sans space-y-0.5 mt-0.5">
                      {plan.entityInfo.dba && plan.entityInfo.dba !== plan.entityInfo.companyName && (
                        <span className="block text-slate-300">
                          Trade Name (Doing Business As): {plan.entityInfo.dba}
                        </span>
                      )}
                      <span className="block font-mono text-[11px]">
                        Corporate Structure: {plan.entityInfo.legalStructure} · State: {plan.entityInfo.stateOfIncorporation} · Industry Code: {plan.entityInfo.naicsCode}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs text-slate-300 space-y-0.5">
                    <span className="block text-slate-400">Facility Requested:</span>
                    <span className="text-base font-bold text-amber-400">
                      {formatCurrency(plan.loanRequest.amount, true, currency)}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      {plan.loanRequest.termMonths} Mo @ {plan.loanRequest.interestRatePct}% ({plan.loanRequest.facilityType.replace(/_/g, ' ').toUpperCase()})
                    </span>
                  </div>
                </div>

                {/* Underwriting Health Radar & Covenants */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-[#162032] rounded border border-slate-800 space-y-1">
                    <span className="text-slate-400 block font-sans">DSCR Coverage</span>
                    <span className={`text-xl font-mono font-bold ${
                      metrics.year1DSCR >= 1.25 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {metrics.year1DSCR.toFixed(2)}x
                    </span>
                    <span className="text-[10px] text-slate-500 block">Bank Policy: ≥1.25x</span>
                  </div>

                  <div className="p-3 bg-[#162032] rounded border border-slate-800 space-y-1">
                    <span className="text-slate-400 block font-sans">Borrower Equity</span>
                    <span className={`text-xl font-mono font-bold ${
                      metrics.meetsEquityBenchmark ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {metrics.equityInjectionPct.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">SBA Benchmark: ≥10%</span>
                  </div>

                  <div className="p-3 bg-[#162032] rounded border border-slate-800 space-y-1">
                    <span className="text-slate-400 block font-sans">Loan-to-Value (LTV)</span>
                    <span className={`text-xl font-mono font-bold ${
                      metrics.loanToValuePct <= 85 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {metrics.loanToValuePct.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">Haircut Adjusted</span>
                  </div>

                  <div className="p-3 bg-[#162032] rounded border border-slate-800 space-y-1">
                    <span className="text-slate-400 block font-sans">Monthly Debt Service</span>
                    <span className="text-xl font-mono font-bold text-slate-100">
                      {formatCurrency(metrics.monthlyPayment, false, currency)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">P+I Service / Month</span>
                  </div>
                </div>

                {/* Visual Chart Exhibit (Embedded Preview) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <BarChart5Year
                    projections={projections}
                    currency={currency}
                    title="5-Year Pro-Forma Revenue & EBITDA Trajectory"
                    subtitle="Underwriting scale trajectory"
                  />
                  <DscrCovenantChart
                    projections={projections}
                    benchmark={1.25}
                  />
                </div>

                {/* 5-Year Statement Summary Table Preview */}
                <div className="overflow-x-auto">
                  <span className="text-xs font-semibold text-slate-300 block mb-2 font-mono uppercase">
                    5-Year Pro-Forma Operating Summary Table
                  </span>
                  <table className="w-full text-xs text-left border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-slate-700 bg-[#162032] text-slate-400">
                        <th className="py-2 px-3 font-sans">Statement Line ({currency})</th>
                        <th className="py-2 px-3 text-right">Year 1</th>
                        <th className="py-2 px-3 text-right">Year 2</th>
                        <th className="py-2 px-3 text-right">Year 3</th>
                        <th className="py-2 px-3 text-right">Year 4</th>
                        <th className="py-2 px-3 text-right">Year 5</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="py-2 px-3 font-sans font-bold text-slate-200">Gross Revenue</td>
                        {projections.map((p) => (
                          <td key={p.year} className="py-2 px-3 text-right tabular-nums">
                            {formatCurrency(p.revenue, true, currency)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-sans text-slate-400">Operating Expenses</td>
                        {projections.map((p) => (
                          <td key={p.year} className="py-2 px-3 text-right tabular-nums text-slate-400">
                            ({formatCurrency(p.opex, true, currency)})
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-amber-950/20 font-bold text-amber-300">
                        <td className="py-2 px-3 font-sans">EBITDA (Cash Flow)</td>
                        {projections.map((p) => (
                          <td key={p.year} className="py-2 px-3 text-right tabular-nums">
                            {formatCurrency(p.ebitda, true, currency)}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-emerald-950/20 font-bold text-emerald-400">
                        <td className="py-2 px-3 font-sans">Net Income</td>
                        {projections.map((p) => (
                          <td key={p.year} className="py-2 px-3 text-right tabular-nums">
                            {formatCurrency(p.netIncome, true, currency)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Niche SWOT & Strategic Risk Response Preview */}
                {plan.swotAnalysis && plan.swotAnalysis.items.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#162032] border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold uppercase tracking-wider text-xs font-mono">
                          Niche SWOT & Strategic Response Package
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                          {plan.swotAnalysis.items.length} Evaluated Areas
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Target Niche: {plan.swotAnalysis.nicheFocus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {plan.swotAnalysis.items.slice(0, 4).map((item) => {
                        const badgeColor = {
                          strengths: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
                          weaknesses: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
                          opportunities: 'text-sky-400 border-sky-500/30 bg-sky-950/20',
                          threats: 'text-rose-400 border-rose-500/30 bg-rose-950/20',
                        }[item.category];

                        return (
                          <div key={item.id} className="p-3 rounded-lg bg-[#0f172a] border border-slate-800 space-y-1.5">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${badgeColor}`}>
                                {item.category.slice(0, -1)}
                              </span>
                              <span className="text-[10px] text-amber-300 font-mono">
                                Area: {item.nicheArea}
                              </span>
                            </div>
                            <span className="font-semibold text-slate-200 block text-xs truncate">
                              {item.title}
                            </span>
                            <div className="p-1.5 rounded bg-slate-900/90 border-l-2 border-amber-400 text-[10px] text-slate-300">
                              <span className="text-amber-400 font-mono font-semibold block">Response Plan:</span>
                              <span className="line-clamp-2">{item.strategicResponse}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Audit & Compliance Badges */}
                <div className="p-3 bg-slate-900/80 rounded border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sources & Uses 100% Balanced</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Principal Personal Guarantees Formatted</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>SBA 7(a) & Commercial Bank Compliant</span>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  Flat Fee: <span className="font-bold text-amber-400">$8.00 USD</span> · Instant unlock of certified unwatermarked dossier.
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Keep Editing
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(plan.isPaid ? 'receipt' : 'checkout')}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{plan.isPaid ? 'View Receipt' : 'Proceed to Checkout ($8.00)'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CHECKOUT & PAYMENT GATING ($8 FLAT FEE) */}
          {activeStep === 'checkout' && !plan.isPaid && (
            <form onSubmit={handleProcessPayment} className="space-y-6 max-w-2xl mx-auto">
              {/* Pricing Overview Card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#162032] to-[#111827] border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                      OFFICIAL COMMERCIAL DOSSIER CERTIFICATION
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                      Commercial Business Plan & Underwriting Package
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400 font-mono">$8.00</span>
                    <span className="text-[11px] text-slate-400 block">Flat Fee / Lifetime Plan</span>
                  </div>
                </div>

                {/* Line Item Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>5-Year 3-Statement Financial Projections Suite</span>
                    <span className="font-mono text-emerald-400">Included ($0)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>OCC & SBA 7(a) SOP 50 10 7 Credit Memorandum</span>
                    <span className="font-mono text-emerald-400">Included ($0)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>DSCR, LTV & Multi-Scenario Stress Simulation</span>
                    <span className="font-mono text-emerald-400">Included ($0)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>High-Resolution Vector Charts & Amortization Schedules</span>
                    <span className="font-mono text-emerald-400">Included ($0)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Unwatermarked Institutional PDF Dossier & JSON Export</span>
                    <span className="font-mono text-emerald-400">Included ($0)</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-slate-100">
                    <span>Total Amount Due</span>
                    <span className="font-mono text-amber-400">$8.00 USD</span>
                  </div>
                </div>
              </div>

              {/* Connected Merchant Bank Payout Banner */}
              <div className="p-3.5 rounded-xl bg-[#162032] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-inner">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-slate-200">Merchant Receiving Bank:</span>
                      <span className="font-mono text-emerald-400 font-bold">{merchantBank.bankName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({merchantBank.accountNumber})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Payments of $8.00 USD settle directly into your connected commercial account on a {merchantBank.payoutSchedule.replace(/_/g, ' ')} payout schedule via {merchantBank.gatewayProvider.toUpperCase()} merchant gateway.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditBankName(merchantBank.bankName);
                    setEditAccountHolder(merchantBank.accountHolder);
                    setEditRouting(merchantBank.routingNumber);
                    setEditAccount(merchantBank.accountNumber);
                    setEditSwift(merchantBank.swiftBic);
                    setEditSchedule(merchantBank.payoutSchedule);
                    setIsBankSettingsOpen(true);
                  }}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 shrink-0 self-start sm:self-center transition-colors shadow-sm"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>Configure Bank Details</span>
                </button>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'credit_card'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-semibold'
                        : 'border-slate-800 bg-[#162032] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'apple_pay'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-semibold'
                        : 'border-slate-800 bg-[#162032] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('google_pay')}
                    className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'google_pay'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-semibold'
                        : 'border-slate-800 bg-[#162032] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>G Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ach_transfer')}
                    className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'ach_transfer'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-semibold'
                        : 'border-slate-800 bg-[#162032] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Direct Bank Wire</span>
                  </button>
                </div>
              </div>

              {/* Form Body: Either Direct Bank Transfer OR Card Inputs */}
              {paymentMethod === 'ach_transfer' ? (
                <div className="space-y-4 bg-[#111827] p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        Direct Commercial Bank Deposit Wire Instructions
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Transfer $8.00 USD directly to our commercial depository account from any bank via ACH or Wire.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Direct Settlement
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Beneficiary / Account Holder</span>
                      <span className="font-semibold text-slate-100 block font-mono">{merchantBank.accountHolder}</span>
                    </div>

                    <div className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Receiving Financial Institution</span>
                      <span className="font-semibold text-slate-100 block font-mono">{merchantBank.bankName}</span>
                    </div>

                    <div className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-mono">Routing Number (ABA / ACH)</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(merchantBank.routingNumber, 'routing')}
                          className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 font-mono"
                        >
                          {copiedKey === 'routing' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'routing' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <span className="font-bold text-slate-100 block font-mono text-sm">{merchantBank.routingNumber}</span>
                    </div>

                    <div className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-mono">Account Number</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(merchantBank.accountNumber, 'account')}
                          className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 font-mono"
                        >
                          {copiedKey === 'account' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'account' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <span className="font-bold text-slate-100 block font-mono text-sm">{merchantBank.accountNumber}</span>
                    </div>

                    <div className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-mono">SWIFT / BIC (International)</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(merchantBank.swiftBic, 'swift')}
                          className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 font-mono"
                        >
                          {copiedKey === 'swift' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'swift' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <span className="font-semibold text-slate-100 block font-mono">{merchantBank.swiftBic}</span>
                    </div>

                    <div className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-mono">Wire Transfer Memo / Ref ID</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(`PLAN-${plan.id.slice(-6).toUpperCase()}-8USD`, 'memo')}
                          className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 font-mono"
                        >
                          {copiedKey === 'memo' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'memo' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <span className="font-bold text-amber-400 block font-mono">PLAN-{plan.id.slice(-6).toUpperCase()}-8USD</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Invoice & Notification Email
                    </label>
                    <input
                      type="email"
                      required
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      placeholder="treasury@company.com"
                      className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              ) : (
                /* Card Inputs */
                <div className="space-y-3 bg-[#111827] p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Cardholder / Corporate Officer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Dr. Marcus Vance"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Expiry</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">CVC</label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="CVC"
                      className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">ZIP / Postal</label>
                    <input
                      type="text"
                      required
                      value={cardZip}
                      onChange={(e) => setCardZip(e.target.value)}
                      placeholder="78705"
                      className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Invoice & Receipt Destination Email
                  </label>
                  <input
                    type="email"
                    required
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="officer@company.com"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Tax invoice, corporate receipt, and certified dossier copy will be sent here.
                  </span>
                </div>
              </div>
              )}

              {/* Payment CTA */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing Institutional Authorization...' : 'Pay $8.00 Flat Fee & Unlock Official Package'}</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-Bit SSL Encrypted Commercial Transaction · Instant Lifetime Access</span>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT RECEIPT & UNLOCKED ACCESS */}
          {(activeStep === 'receipt' || plan.isPaid) && (
            <div className="space-y-6 max-w-xl mx-auto text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold block">
                  TRANSACTION COMPLETED • PLAN CERTIFIED
                </span>
                <h3 className="text-xl font-bold text-slate-100">
                  Official Commercial Package Unlocked
                </h3>
                <p className="text-xs text-slate-400">
                  Your business plan is certified and ready for submission to bank credit officers, loan committees, and SBA underwriters.
                </p>
              </div>

              {/* Receipt Box */}
              {completedReceipt && (
                <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 text-left text-xs space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Receipt className="w-4 h-4 text-amber-400" />
                      <span className="font-sans font-bold">Official Invoice Receipt</span>
                    </div>
                    <span className="text-amber-400 font-bold">{completedReceipt.invoiceNumber}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-sans">Business Entity</span>
                      <span className="text-slate-200 font-sans">{plan.entityInfo.companyName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-sans">Amount Paid</span>
                      <span className="text-emerald-400 font-bold">$8.00 USD (Flat Fee)</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-sans">Transaction ID</span>
                      <span className="text-slate-300">{completedReceipt.transactionId}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-sans">Payment Date</span>
                      <span className="text-slate-300">
                        {new Date(completedReceipt.paidAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTriggerPrint();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save Official PDF Dossier</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                >
                  Return to Workstation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connected Depository Bank Settings Modal */}
      <BankPayoutSettingsModal
        isOpen={isBankSettingsOpen}
        onClose={() => {
          setIsBankSettingsOpen(false);
          setMerchantBank(MerchantBankService.getConfig());
        }}
        onConfigSaved={(updated) => setMerchantBank(updated)}
      />
    </div>
  );
};
