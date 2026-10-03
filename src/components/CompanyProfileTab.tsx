import React from 'react';
import { 
  Building, 
  Users, 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { 
  BusinessPlan, 
  ComputedMetrics, 
  Guarantor, 
  LegalStructure 
} from '../types/businessPlan';
import { formatCurrency, formatPercent } from '../utils/financialCalculations';

interface CompanyProfileTabProps {
  plan: BusinessPlan;
  metrics: ComputedMetrics;
  onChangePlan: (updated: BusinessPlan) => void;
  onRequestAiNarrative?: (section: string) => void;
}

export const CompanyProfileTab: React.FC<CompanyProfileTabProps> = ({
  plan,
  metrics,
  onChangePlan,
  onRequestAiNarrative,
}) => {
  const updateEntity = (field: string, value: any) => {
    onChangePlan({
      ...plan,
      entityInfo: {
        ...plan.entityInfo,
        [field]: value,
      },
    });
  };

  const updateProfile = (field: string, value: any) => {
    onChangePlan({
      ...plan,
      businessProfile: {
        ...plan.businessProfile,
        [field]: value,
      },
    });
  };

  // Guarantors management
  const addGuarantor = () => {
    const newGuarantor: Guarantor = {
      id: `guarantor-${Date.now()}`,
      name: 'New Managing Partner',
      title: 'Principal / Officer',
      ownershipPct: 20,
      creditScore: 740,
      tangibleNetWorth: 500000,
      liquidAssets: 150000,
      personalGuaranteePledged: true,
      yearsExperience: 10,
      bio: 'Principal background and operational experience.',
    };
    onChangePlan({
      ...plan,
      guarantors: [...plan.guarantors, newGuarantor],
    });
  };

  const removeGuarantor = (id: string) => {
    onChangePlan({
      ...plan,
      guarantors: plan.guarantors.filter((g) => g.id !== id),
    });
  };

  const updateGuarantor = (id: string, field: keyof Guarantor, value: any) => {
    onChangePlan({
      ...plan,
      guarantors: plan.guarantors.map((g) =>
        g.id === id ? { ...g, [field]: value } : g
      ),
    });
  };

  const totalOwnershipPct = plan.guarantors.reduce((sum, g) => sum + g.ownershipPct, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Entity & Organization Details Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              Borrower Legal Entity & Facility Overview
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Official corporate registration and physical operating infrastructure evaluated by lenders.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">KYC / CIP COMPLIANCE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Legal Business Name
            </label>
            <input
              type="text"
              value={plan.entityInfo.companyName}
              onChange={(e) => updateEntity('companyName', e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              DBA / Trade Name (if different)
            </label>
            <input
              type="text"
              value={plan.entityInfo.dba}
              onChange={(e) => updateEntity('dba', e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Legal Structure
            </label>
            <select
              value={plan.entityInfo.legalStructure}
              onChange={(e) => updateEntity('legalStructure', e.target.value as LegalStructure)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            >
              <option value="LLC">Limited Liability Company (LLC)</option>
              <option value="C-Corp">C-Corporation</option>
              <option value="S-Corp">S-Corporation</option>
              <option value="Partnership">General / Limited Partnership</option>
              <option value="Sole-Prop">Sole Proprietorship</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              State of Incorporation
            </label>
            <input
              type="text"
              value={plan.entityInfo.stateOfIncorporation}
              onChange={(e) => updateEntity('stateOfIncorporation', e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Date Established / Formed
            </label>
            <input
              type="date"
              value={plan.entityInfo.dateEstablished}
              onChange={(e) => updateEntity('dateEstablished', e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Federal EIN / Tax ID
            </label>
            <input
              type="text"
              value={plan.entityInfo.ein}
              onChange={(e) => updateEntity('ein', e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
              placeholder="XX-XXXXXXX"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Primary NAICS Industry Code
            </label>
            <input
              type="text"
              value={plan.entityInfo.naicsCode}
              onChange={(e) => updateEntity('naicsCode', e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
              placeholder="e.g. 541511"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              NAICS Description / Sector
            </label>
            <input
              type="text"
              value={plan.entityInfo.naicsDescription}
              onChange={(e) => updateEntity('naicsDescription', e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Primary Operating Facility Address
            </label>
            <input
              type="text"
              value={plan.entityInfo.streetAddress}
              onChange={(e) => updateEntity('streetAddress', e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 mb-2"
              placeholder="Street Address..."
            />
            <input
              type="text"
              value={plan.entityInfo.cityStateZip}
              onChange={(e) => updateEntity('cityStateZip', e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              placeholder="City, State, Zip..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Facility Square Footage & Lease
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={plan.entityInfo.facilitySqFt}
                onChange={(e) => updateEntity('facilitySqFt', parseInt(e.target.value) || 0)}
                placeholder="Sq Ft"
                className="bg-[#1e293b] border border-slate-700 rounded px-2 py-2 text-xs font-mono text-slate-100 focus:outline-none"
              />
              <input
                type="number"
                value={plan.entityInfo.monthlyRent}
                onChange={(e) => updateEntity('monthlyRent', parseFloat(e.target.value) || 0)}
                placeholder="Rent $/mo"
                className="bg-[#1e293b] border border-slate-700 rounded px-2 py-2 text-xs font-mono text-slate-100 focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Monthly rent: {formatCurrency(plan.entityInfo.monthlyRent)}
            </span>
          </div>
        </div>
      </div>

      {/* Principal Guarantors & Ownership Registry (Critical Bank Underwriting Standard) */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Ownership Cap Table & Principal Guarantors
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Federal banking regulation & SBA SOP 50 10 7 mandate unconditional personal guarantees from all individuals with ≥20% equity.
            </p>
          </div>

          <button
            type="button"
            onClick={addGuarantor}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-400 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/80 rounded transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Principal / Owner
          </button>
        </div>

        {/* Guarantor Compliance Alert if someone >= 20% hasn't signed */}
        {!metrics.allGuarantorsSigned && (
          <div className="bg-rose-950/40 border border-rose-800 rounded-lg p-4 flex items-start gap-3 text-rose-200 text-xs">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-rose-300">
                Lending Covenant Exception: Missing Personal Guarantee
              </span>
              <p className="text-slate-300 mt-0.5">
                The following owners hold 20% or greater equity without an unconditional personal guarantee:{' '}
                <strong className="text-rose-300">{metrics.majorOwnersMissingGuarantees.join(', ')}</strong>.
                Commercial underwriting committees will decline or require an exception memorandum.
              </p>
            </div>
          </div>
        )}

        {/* Guarantor Cards */}
        <div className="space-y-4">
          {plan.guarantors.map((guarantor) => (
            <div
              key={guarantor.id}
              className="bg-[#1e293b]/50 border border-slate-800 rounded-lg p-4 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-amber-400 border border-slate-700">
                    {guarantor.name.slice(0, 2).toUpperCase() || 'OP'}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={guarantor.name}
                      onChange={(e) => updateGuarantor(guarantor.id, 'name', e.target.value)}
                      className="text-sm font-semibold bg-transparent border-b border-transparent focus:border-amber-400 focus:outline-none text-slate-100"
                      placeholder="Principal Full Name..."
                    />
                    <input
                      type="text"
                      value={guarantor.title}
                      onChange={(e) => updateGuarantor(guarantor.id, 'title', e.target.value)}
                      className="block text-xs text-slate-400 bg-transparent border-b border-transparent focus:border-amber-400 focus:outline-none"
                      placeholder="Corporate Title..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Personal Guarantee Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer bg-[#0f172a] px-3 py-1.5 rounded border border-slate-700 text-xs">
                    <input
                      type="checkbox"
                      checked={guarantor.personalGuaranteePledged}
                      onChange={(e) =>
                        updateGuarantor(guarantor.id, 'personalGuaranteePledged', e.target.checked)
                      }
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                    />
                    <span className={guarantor.personalGuaranteePledged ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                      Personal Guarantee Pledged
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removeGuarantor(guarantor.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Remove Principal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Financial Profile Fields */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Equity Ownership (%)</label>
                  <input
                    type="number"
                    value={guarantor.ownershipPct}
                    onChange={(e) => updateGuarantor(guarantor.id, 'ownershipPct', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">FICO Credit Score</label>
                  <input
                    type="number"
                    value={guarantor.creditScore}
                    onChange={(e) => updateGuarantor(guarantor.id, 'creditScore', parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                    {guarantor.creditScore >= 720 ? 'Prime (720+)' : guarantor.creditScore >= 680 ? 'Standard' : 'Sub-prime'}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tangible Net Worth ($)</label>
                  <input
                    type="number"
                    value={guarantor.tangibleNetWorth}
                    onChange={(e) => updateGuarantor(guarantor.id, 'tangibleNetWorth', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Liquid Assets ($)</label>
                  <input
                    type="number"
                    value={guarantor.liquidAssets}
                    onChange={(e) => updateGuarantor(guarantor.id, 'liquidAssets', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="col-span-2 sm:col-span-4">
                  <label className="block text-slate-400 mb-1">Executive Biography & Track Record</label>
                  <textarea
                    rows={2}
                    value={guarantor.bio}
                    onChange={(e) => updateGuarantor(guarantor.id, 'bio', e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400 leading-relaxed"
                    placeholder="Past operational leadership, degrees, previous business exits..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ownership Verification */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
          <span className="text-slate-400 font-sans">Total Registered Ownership:</span>
          <span className={`font-bold tabular-nums ${totalOwnershipPct === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {totalOwnershipPct}% {totalOwnershipPct !== 100 && '(Cap table should equal 100%)'}
          </span>
        </div>
      </div>

      {/* Qualitative Underwriting Narrative: Market, Concentration & Moat */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              Operational Narrative & Credit Risk Mitigation
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              The operational story explaining repayment durability and competitive defenses to the loan committee.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">
                Executive Summary & Business Model
              </label>
            </div>
            <textarea
              rows={3}
              value={plan.businessProfile.executiveSummary}
              onChange={(e) => updateProfile('executiveSummary', e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Value Proposition & Core Offerings
              </label>
              <textarea
                rows={3}
                value={plan.businessProfile.valueProposition}
                onChange={(e) => updateProfile('valueProposition', e.target.value)}
                className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Competitive Moat & Defensibility
              </label>
              <textarea
                rows={3}
                value={plan.businessProfile.competitiveMoat}
                onChange={(e) => updateProfile('competitiveMoat', e.target.value)}
                className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>
          </div>

          {/* Customer Concentration Analysis (Crucial Bank Risk) */}
          <div className="bg-[#1e293b]/40 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Customer Concentration Exposure
                </span>
                <span className="text-[11px] text-slate-400">
                  Lenders penalize concentration where a single customer exceeds 15-20% of revenue.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">Max Single Client:</span>
                <div className="relative w-24">
                  <input
                    type="number"
                    step="0.1"
                    value={plan.businessProfile.topCustomerConcentrationPct}
                    onChange={(e) =>
                      updateProfile('topCustomerConcentrationPct', parseFloat(e.target.value) || 0)
                    }
                    className="w-full bg-[#0f172a] border border-slate-700 rounded px-2 py-1 text-xs font-mono text-right text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                  <span className="absolute right-2 top-1 text-slate-400 text-xs">%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Customer Diversification & Concentration Risk Mitigation Plan
              </label>
              <textarea
                rows={2}
                value={plan.businessProfile.customerConcentrationMitigation}
                onChange={(e) => updateProfile('customerConcentrationMitigation', e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400 leading-relaxed"
                placeholder="Explain why loss of the largest client would not induce loan default..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Identified Operational & Market Risks
              </label>
              <textarea
                rows={2}
                value={plan.businessProfile.operationalRisks}
                onChange={(e) => updateProfile('operationalRisks', e.target.value)}
                className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Formal Mitigation & Contingency Protocols
              </label>
              <textarea
                rows={2}
                value={plan.businessProfile.riskMitigationStrategies}
                onChange={(e) => updateProfile('riskMitigationStrategies', e.target.value)}
                className="w-full bg-[#1e293b] border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
