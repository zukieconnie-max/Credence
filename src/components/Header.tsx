import React, { useState } from 'react';
import { 
  Building2, 
  FileCheck, 
  Sparkles, 
  Printer, 
  FolderOpen, 
  Layers, 
  ShieldCheck, 
  AlertCircle,
  Coins,
  BarChart3,
  User,
  LogOut,
  Tag,
  CheckCircle2,
  Lock,
  ChevronDown,
  Landmark
} from 'lucide-react';
import { BusinessPlan, ComputedMetrics } from '../types/businessPlan';
import { BusinessUser } from '../types/auth';
import { SUPPORTED_CURRENCIES, formatPlanCurrency } from '../utils/currency';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  plan: BusinessPlan;
  metrics: ComputedMetrics;
  user: BusinessUser | null;
  onOpenAiReview: () => void;
  onOpenTemplates: () => void;
  onTriggerPrint: () => void;
  onOpenPlanManager: () => void;
  onChangeCurrency: (currency: string) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSignOut: () => void;
  onOpenPricing: () => void;
  onOpenPreviewAndPay: () => void;
  onOpenBankSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  plan,
  metrics,
  user,
  onOpenAiReview,
  onOpenTemplates,
  onTriggerPrint,
  onOpenPlanManager,
  onChangeCurrency,
  onOpenAuth,
  onSignOut,
  onOpenPricing,
  onOpenPreviewAndPay,
  onOpenBankSettings,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Credit Request' },
    { id: 'company', label: 'Entity & Guarantors' },
    { id: 'swot', label: 'SWOT & Strategy' },
    { id: 'financials', label: '5-Year Projections' },
    { id: 'visual_graphs', label: 'Visual Graphs' },
    { id: 'collateral', label: 'Collateral & Debt' },
    { id: 'ratios', label: 'Ratios & Stress Test' },
    { id: 'dossier', label: 'Bank Dossier' },
  ];

  const isDscrPassing = metrics.year1DSCR >= 1.25;
  const isEquityPassing = metrics.meetsEquityBenchmark;
  const activeCurrency = plan.currency || 'USD';

  return (
    <header className="no-print sticky top-0 z-30 bg-[#0b0f17]/95 backdrop-blur border-b border-slate-800 text-slate-100">
      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-sm shadow-sm">
            CR
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-slate-100 text-base leading-none">
              Credence
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase mt-1">
              Commercial Credit Suite
            </span>
          </div>
        </div>

        {/* Zone 2: Clean text navigation tabs */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm font-medium">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-2.5 py-1.5 rounded transition-colors whitespace-nowrap text-xs xl:text-xs font-medium flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.id === 'visual_graphs' && <BarChart3 className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Pricing $8/Plan Link */}
          <button
            onClick={onOpenPricing}
            className="px-2.5 py-1.5 rounded text-xs font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 transition-colors flex items-center gap-1"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Pricing ($8/Plan)</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action buttons + Regional Currency + User Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Regional Currency Picker */}
          <div className="flex items-center gap-1 bg-[#1e293b]/90 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200">
            <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={activeCurrency}
              onChange={(e) => onChangeCurrency(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-mono focus:outline-none cursor-pointer"
              title="Select Regional Currency"
            >
              {SUPPORTED_CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code} className="bg-slate-900 text-slate-200">
                  {curr.code} ({curr.symbol}) - {curr.name}
                </option>
              ))}
            </select>
          </div>

          {/* Check Preview & Pay $8 Button */}
          {plan.isPaid ? (
            <button
              onClick={onOpenPreviewAndPay}
              title="Plan Certified & Unlocked"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 rounded transition-all shadow-sm whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Certified ($8 Paid)</span>
            </button>
          ) : (
            <button
              onClick={onOpenPreviewAndPay}
              title="Review executive preview and unlock official dossier for $8 flat fee"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded transition-all shadow-sm whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Preview & Pay ($8)</span>
            </button>
          )}

          <button
            onClick={onOpenTemplates}
            title="Load Pre-configured Bank Scenarios"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded transition-colors whitespace-nowrap"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Templates</span>
          </button>

          <button
            onClick={onOpenAiReview}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded transition-all shadow-sm whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Underwriter</span>
          </button>

          {/* User Account / Corporate Profile Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 bg-[#1e293b] hover:bg-slate-800 border border-slate-700 rounded-lg text-xs transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                  {user.fullName.charAt(0)}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="font-semibold text-slate-200 truncate max-w-[100px] leading-tight">
                    {user.businessName}
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Verified
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#111827] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <span className="font-bold text-slate-100 block">{user.businessName}</span>
                    <span className="text-slate-400 block text-[11px]">{user.fullName} · {user.jobTitle}</span>
                    <span className="text-slate-500 font-mono text-[10px] mt-0.5 block">{user.workEmail}</span>
                    <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Business Officer
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenPricing();
                      }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-2"
                    >
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Commercial Pricing ($8 Flat Fee)</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenPreviewAndPay();
                      }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-2"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{plan.isPaid ? 'View Plan Receipt' : 'Preview & Unlock Active Plan'}</span>
                    </button>

                    {onOpenBankSettings && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenBankSettings();
                        }}
                        className="w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-2"
                      >
                        <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Receiving Bank & Payouts</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full px-4 py-2 text-left text-rose-400 hover:bg-slate-800/80 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-2.5 py-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/80 rounded transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-bar: Active Dossier & Real-Time Underwriting Indicators */}
      <div className="bg-[#0e1422] border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
            {plan.title}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{plan.stage === 'running_business' ? 'Operating Business' : 'New Venture Idea'}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono text-slate-300">{formatPlanCurrency(plan.loanRequest.amount, activeCurrency)} {plan.loanRequest.facilityType.replace(/_/g, ' ').toUpperCase()}</span>
          {plan.isPaid && (
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Certified
            </span>
          )}
        </div>

        {/* Real-Time Bank Underwriting Covenants Pill-Free Status */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">DSCR (Y1):</span>
            <span className={`font-semibold tabular-nums ${isDscrPassing ? 'text-emerald-400' : 'text-rose-400'}`}>
              {metrics.year1DSCR.toFixed(2)}x
            </span>
            <span className="text-[10px] text-slate-500 font-sans">
              ({isDscrPassing ? '>=1.25x Pass' : 'Tight/Fail'})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Equity Injection:</span>
            <span className={`font-semibold tabular-nums ${isEquityPassing ? 'text-emerald-400' : 'text-amber-400'}`}>
              {metrics.equityInjectionPct.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 font-sans">
              ({isEquityPassing ? 'Compliant' : 'Needs >=10%'})
            </span>
          </div>

          <div className="flex items-center gap-1.5 hidden sm:flex">
            <span className="text-slate-400">LTV:</span>
            <span className={`font-semibold tabular-nums ${metrics.loanToValuePct <= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {metrics.loanToValuePct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

