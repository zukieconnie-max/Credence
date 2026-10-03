import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Target, 
  DollarSign, 
  UserCheck, 
  Search, 
  Filter, 
  Sparkles, 
  Edit3, 
  Trash2, 
  LayoutGrid, 
  ListFilter, 
  Compass, 
  Info,
  ChevronDown,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  BusinessPlan, 
  SwotCategory, 
  SwotItem, 
  SwotPriority, 
  SwotResponseStatus, 
  SwotTimeframe,
  SwotAnalysis
} from '../types/businessPlan';
import { formatCurrency } from '../utils/financialCalculations';

interface SwotAnalysisTabProps {
  plan: BusinessPlan;
  onChangePlan: (updated: BusinessPlan) => void;
}

const DEFAULT_SWOT: SwotAnalysis = {
  nicheFocus: 'Commercial Niche Market Operations',
  marketMaturity: 'rapid_growth',
  competitivePosition: 'specialized_niche_player',
  lastUpdated: new Date().toISOString().split('T')[0],
  items: [],
};

const CATEGORY_META = {
  strengths: {
    label: 'Strengths',
    sublabel: 'Internal Competitive Moats & Advantages',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    borderClass: 'border-emerald-500/30',
    cardBg: 'bg-emerald-950/20',
    icon: ShieldCheck,
    verb: 'Leverage',
    help: 'Internal capabilities, proprietary assets, favorable cost structures, or certifications that give you a distinct edge in your niche.',
  },
  weaknesses: {
    label: 'Weaknesses',
    sublabel: 'Internal Vulnerabilities & Operational Gaps',
    color: 'amber',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    borderClass: 'border-amber-500/30',
    cardBg: 'bg-amber-950/20',
    icon: AlertTriangle,
    verb: 'Mitigate',
    help: 'Internal bottlenecks, key-person dependencies, limited history, or balance sheet gaps that could hinder execution if unaddressed.',
  },
  opportunities: {
    label: 'Opportunities',
    sublabel: 'External Market Tailwinds & Expansion Vectors',
    color: 'sky',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    borderClass: 'border-sky-500/30',
    cardBg: 'bg-sky-950/20',
    icon: TrendingUp,
    verb: 'Capitalize',
    help: 'External trends, regulatory tailwinds, shifting consumer preferences, or competitor vacuums in your niche market.',
  },
  threats: {
    label: 'Threats',
    sublabel: 'External Headwinds & Industry Risks',
    color: 'rose',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    borderClass: 'border-rose-500/30',
    cardBg: 'bg-rose-950/20',
    icon: AlertCircle,
    verb: 'Defend',
    help: 'Macro interest rate shifts, supply chain shocks, regulatory tightening, or aggressive competitor counter-moves in your niche.',
  },
};

const NICHE_AREA_SUGGESTIONS = [
  'Regulatory & Statutory Licensing',
  'Proprietary Tech & IP Moat',
  'Supplier & Raw Material Pricing Power',
  'Customer Acquisition Cost & CAC:LTV',
  'Gross Margin & Unit Economics',
  'Working Capital & Cash Conversion Cycle',
  'Labor, Specialized Talent & Retention',
  'Capacity Constraints & Facility Utilization',
  'Client / Payor Concentration',
  'Channel Partner & Referral Alliances',
  'Macro Economic & Interest Rate Sensitivity',
];

const CURATED_NICHE_SUGGESTION_PACKS = [
  {
    niche: 'Healthcare, Medical & Surgical Centers',
    items: [
      {
        category: 'strengths' as SwotCategory,
        nicheArea: 'Regulatory & Statutory Licensing',
        title: 'Accredited Certificate of Need (CON) Exclusivity',
        description: 'Exclusive state regulatory license granting statutory territorial rights for outpatient surgical cases.',
        priority: 'critical' as SwotPriority,
        strategicResponse: 'Establish binding exclusive contracts with leading regional orthopedic surgical groups to lock in high-margin cases.',
        responseStatus: 'implemented' as SwotResponseStatus,
        timeframe: 'ongoing' as SwotTimeframe,
        assignedOwner: 'Managing Member',
        budgetOrCapitalRequired: 30000,
        impactOnFinancials: 'Secures high-acuity surgical volumes with 65%+ gross margin.',
      },
      {
        category: 'weaknesses' as SwotCategory,
        nicheArea: 'Payer Reimbursement Cycles',
        title: 'Extended Payor Credentialing Lag (60-90 Days)',
        description: 'New physician associates incur billing delays while private insurance panels approve individual credentialing.',
        priority: 'high' as SwotPriority,
        strategicResponse: 'Implement automated digital pre-credentialing pipeline 120 days prior to surgeon employment start date.',
        responseStatus: 'in_progress' as SwotResponseStatus,
        timeframe: 'short_term_90d' as SwotTimeframe,
        assignedOwner: 'Practice Administrator',
        budgetOrCapitalRequired: 18000,
        impactOnFinancials: 'Recovers estimated $150K in first-year billable collections per physician.',
      },
      {
        category: 'opportunities' as SwotCategory,
        nicheArea: 'Payer Paradigm Shift',
        title: 'Commercial Insurer Mandates Favoring Outpatient ASCs',
        description: 'Private payers actively directing elective joint replacements from hospitals to outpatient centers to cut surgical costs.',
        priority: 'critical' as SwotPriority,
        strategicResponse: 'Negotiate bundled-rate pilot contracts with self-insured regional corporate employers offering 35% lower cost than hospital inpatient.',
        responseStatus: 'in_progress' as SwotResponseStatus,
        timeframe: 'medium_term_1y' as SwotTimeframe,
        assignedOwner: 'Business Development Director',
        budgetOrCapitalRequired: 40000,
        impactOnFinancials: 'Projects 85 additional surgical cases generating $750K in revenue.',
      },
      {
        category: 'threats' as SwotCategory,
        nicheArea: 'Payer Prior Authorization Friction',
        title: 'Algorithmic Insurance Pre-Authorization Delays & Denials',
        description: 'Increasing rate of commercial health plan appeals and pre-procedure authorization friction.',
        priority: 'high' as SwotPriority,
        strategicResponse: 'Implement AI-powered electronic prior authorization verification integrated directly into scheduling workflow.',
        responseStatus: 'implemented' as SwotResponseStatus,
        timeframe: 'ongoing' as SwotTimeframe,
        assignedOwner: 'Billing Director',
        budgetOrCapitalRequired: 25000,
        impactOnFinancials: 'Sustains 98% first-pass claim acceptance, keeping DSO under 35 days.',
      },
    ],
  },
  {
    niche: 'B2B Software, SaaS & Technology',
    items: [
      {
        category: 'strengths' as SwotCategory,
        nicheArea: 'Unit Economics & Margins',
        title: '80%+ Software Gross Margins with Annual Upfront Subscriptions',
        description: 'High recurring contract values paid annually upfront provide predictable cash flow and low working capital friction.',
        priority: 'high' as SwotPriority,
        strategicResponse: 'Incentivize 2-year upfront contracts with 8% multi-year incentives to maximize non-dilutive operating cash reserves.',
        responseStatus: 'implemented' as SwotResponseStatus,
        timeframe: 'ongoing' as SwotTimeframe,
        assignedOwner: 'VP of Sales',
        budgetOrCapitalRequired: 15000,
        impactOnFinancials: 'Increases upfront cash reserves by $280K annually.',
      },
      {
        category: 'weaknesses' as SwotCategory,
        nicheArea: 'Enterprise Sales Cycle Duration',
        title: 'Prolonged Enterprise Procurement & Security Reviews (6-9 Months)',
        description: 'Enterprise IT, legal, and Infosec reviews delay contract execution and create revenue lumpiness.',
        priority: 'high' as SwotPriority,
        strategicResponse: 'Fast-track SOC2 Type II automated compliance and offer standard 30-day proof-of-value sandbox pilots.',
        responseStatus: 'in_progress' as SwotResponseStatus,
        timeframe: 'short_term_90d' as SwotTimeframe,
        assignedOwner: 'VP of Security & Legal',
        budgetOrCapitalRequired: 50000,
        impactOnFinancials: 'Shortens sales cycles by 40%, accelerating ARR ramp.',
      },
      {
        category: 'opportunities' as SwotCategory,
        nicheArea: 'Regulatory & Data Compliance Mandates',
        title: 'Government & Corporate ESG / Data Compliance Requirements',
        description: 'New regulatory mandates require enterprise customers to audit and track multi-vendor data flows.',
        priority: 'high' as SwotPriority,
        strategicResponse: 'Launch dedicated compliance audit reporting add-on module with seamless 1-click export for clients.',
        responseStatus: 'planned' as SwotResponseStatus,
        timeframe: 'medium_term_1y' as SwotTimeframe,
        assignedOwner: 'Head of Product',
        budgetOrCapitalRequired: 65000,
        impactOnFinancials: 'Opens $320K in high-margin cross-sell annual recurring revenue.',
      },
      {
        category: 'threats' as SwotCategory,
        nicheArea: 'Competitor Consolidation',
        title: 'Legacy Suite Vendors Bundling Basic Add-on Features for Free',
        description: 'Large incumbent software platforms attempting to commoditize specialized features.',
        priority: 'critical' as SwotPriority,
        strategicResponse: 'Maintain deep best-of-breed integration hooks and open APIs, positioning as the essential neutral orchestration layer.',
        responseStatus: 'implemented' as SwotResponseStatus,
        timeframe: 'ongoing' as SwotTimeframe,
        assignedOwner: 'Chief Executive Officer',
        budgetOrCapitalRequired: 30000,
        impactOnFinancials: 'Protects 90%+ contract renewal rate and win rate against bundled products.',
      },
    ],
  },
  {
    niche: 'Food & Beverage, Roastery & Hospitality',
    items: [
      {
        category: 'strengths' as SwotCategory,
        nicheArea: 'Prime Real Estate & Foot Traffic',
        title: 'High-Density Downtown Corner Location with Commuter Flow',
        description: 'Over 12,000 daily foot-traffic pedestrian count in commercial and residential convergence corridor.',
        priority: 'high' as SwotPriority,
        strategicResponse: 'Install dual high-speed POS terminals and dedicated mobile pre-order pick-up station to maximize peak morning throughput.',
        responseStatus: 'implemented' as SwotResponseStatus,
        timeframe: 'immediate_30d' as SwotTimeframe,
        assignedOwner: 'General Manager',
        budgetOrCapitalRequired: 16000,
        impactOnFinancials: 'Increases peak 7-9 AM revenue by 28%.',
      },
      {
        category: 'weaknesses' as SwotCategory,
        nicheArea: 'Startup Track Record & Capex Absorption',
        title: 'Initial Buildout Capex and Ramp-Up Cash Flow Drag',
        description: 'Tenant improvements and architectural buildout require significant upfront liquidity before positive cash flow.',
        priority: 'critical' as SwotPriority,
        strategicResponse: 'Structure commercial financing with 6-month interest-only grace period and maintain $120K dedicated liquidity reserve.',
        responseStatus: 'implemented' as SwotResponseStatus,
        timeframe: 'ongoing' as SwotTimeframe,
        assignedOwner: 'Managing Partner',
        budgetOrCapitalRequired: 120000,
        impactOnFinancials: 'Insulates operation against ramp-up shortfall and guarantees debt covenant adherence.',
      },
      {
        category: 'opportunities' as SwotCategory,
        nicheArea: 'D2C Subscription & Wholesale Diversification',
        title: 'Wholesale B2B Coffee & Corporate Pantry Subscriptions',
        description: 'Local boutique hotels, co-working offices, and corporate campuses seeking locally roasted specialty coffee.',
        priority: 'high' as SwotPriority,
        strategicResponse: 'Launch dedicated B2B wholesale sales program with recurring bi-weekly bean deliveries and equipment maintenance.',
        responseStatus: 'in_progress' as SwotResponseStatus,
        timeframe: 'short_term_90d' as SwotTimeframe,
        assignedOwner: 'Head Roaster',
        budgetOrCapitalRequired: 20000,
        impactOnFinancials: 'Generates $140K in Year 1 wholesale revenue insulated from retail foot traffic.',
      },
      {
        category: 'threats' as SwotCategory,
        nicheArea: 'Raw Material Commodity Inflation',
        title: 'Global Green Coffee Bean Price Spikes & Tariffs',
        description: 'Extreme weather in coffee-growing regions causing worldwide specialty coffee bean price spikes.',
        priority: 'critical' as SwotPriority,
        strategicResponse: 'Execute direct-trade forward contracts with farm cooperatives locking in 12-month green coffee bean pricing.',
        responseStatus: 'implemented' as SwotResponseStatus,
        timeframe: 'ongoing' as SwotTimeframe,
        assignedOwner: 'Head Roaster & Sourcing Lead',
        budgetOrCapitalRequired: 35000,
        impactOnFinancials: 'Stabilizes product gross margins at 60%+ regardless of commodity spot volatility.',
      },
    ],
  },
];

export const SwotAnalysisTab: React.FC<SwotAnalysisTabProps> = ({
  plan,
  onChangePlan,
}) => {
  const currency = plan.currency || 'USD';
  const swot = plan.swotAnalysis || DEFAULT_SWOT;

  // View state
  const [viewMode, setViewMode] = useState<'matrix' | 'registry'>('matrix');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SwotItem | null>(null);
  const [isSuggestionDrawerOpen, setIsSuggestionDrawerOpen] = useState(false);

  // Form State for Adding / Editing
  const [formCategory, setFormCategory] = useState<SwotCategory>('strengths');
  const [formNicheArea, setFormNicheArea] = useState<string>('Regulatory & Statutory Licensing');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formPriority, setFormPriority] = useState<SwotPriority>('high');
  const [formStrategicResponse, setFormStrategicResponse] = useState<string>('');
  const [formResponseStatus, setFormResponseStatus] = useState<SwotResponseStatus>('planned');
  const [formTimeframe, setFormTimeframe] = useState<SwotTimeframe>('short_term_90d');
  const [formAssignedOwner, setFormAssignedOwner] = useState<string>('');
  const [formBudget, setFormBudget] = useState<string>('');
  const [formImpact, setFormImpact] = useState<string>('');

  // Niche metadata state
  const [nicheFocusInput, setNicheFocusInput] = useState<string>(swot.nicheFocus);

  // Handle updating parent plan with new SWOT object
  const updateSwot = (updatedSwot: SwotAnalysis) => {
    onChangePlan({
      ...plan,
      swotAnalysis: updatedSwot,
    });
  };

  const handleUpdateNicheFocus = (newFocus: string) => {
    setNicheFocusInput(newFocus);
    updateSwot({
      ...swot,
      nicheFocus: newFocus,
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

  const handleUpdateMarketMaturity = (val: any) => {
    updateSwot({
      ...swot,
      marketMaturity: val,
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

  const handleUpdateCompetitivePosition = (val: any) => {
    updateSwot({
      ...swot,
      competitivePosition: val,
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

  // Open modal for new item
  const openNewItemModal = (category: SwotCategory = 'strengths') => {
    setEditingItem(null);
    setFormCategory(category);
    setFormNicheArea('Unit Economics & Margins');
    setFormTitle('');
    setFormDescription('');
    setFormPriority('high');
    setFormStrategicResponse('');
    setFormResponseStatus('planned');
    setFormTimeframe('short_term_90d');
    setFormAssignedOwner('Executive Leadership');
    setFormBudget('15000');
    setFormImpact('');
    setIsAddModalOpen(true);
  };

  // Open modal for editing item
  const openEditItemModal = (item: SwotItem) => {
    setEditingItem(item);
    setFormCategory(item.category);
    setFormNicheArea(item.nicheArea);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormPriority(item.priority);
    setFormStrategicResponse(item.strategicResponse);
    setFormResponseStatus(item.responseStatus);
    setFormTimeframe(item.timeframe);
    setFormAssignedOwner(item.assignedOwner || '');
    setFormBudget(item.budgetOrCapitalRequired ? String(item.budgetOrCapitalRequired) : '');
    setFormImpact(item.impactOnFinancials || '');
    setIsAddModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formStrategicResponse.trim()) return;

    const newItem: SwotItem = {
      id: editingItem ? editingItem.id : `swot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: formCategory,
      nicheArea: formNicheArea.trim() || 'General Niche Risk/Opportunity',
      title: formTitle.trim(),
      description: formDescription.trim(),
      priority: formPriority,
      strategicResponse: formStrategicResponse.trim(),
      responseStatus: formResponseStatus,
      timeframe: formTimeframe,
      assignedOwner: formAssignedOwner.trim() || undefined,
      budgetOrCapitalRequired: formBudget ? parseFloat(formBudget) : undefined,
      impactOnFinancials: formImpact.trim() || undefined,
    };

    let updatedItems = [...swot.items];
    if (editingItem) {
      updatedItems = updatedItems.map((it) => (it.id === editingItem.id ? newItem : it));
    } else {
      updatedItems.push(newItem);
    }

    updateSwot({
      ...swot,
      items: updatedItems,
      lastUpdated: new Date().toISOString().split('T')[0],
    });

    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    updateSwot({
      ...swot,
      items: swot.items.filter((it) => it.id !== id),
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

  const handleQuickStatusChange = (id: string, newStatus: SwotResponseStatus) => {
    updateSwot({
      ...swot,
      items: swot.items.map((it) => (it.id === id ? { ...it, responseStatus: newStatus } : it)),
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

  const handleImportCuratedPack = (pack: typeof CURATED_NICHE_SUGGESTION_PACKS[0]) => {
    // Merge pack items avoiding exact duplicate titles
    const existingTitles = new Set(swot.items.map((i) => i.title.toLowerCase()));
    const itemsToAdd: SwotItem[] = pack.items
      .filter((i) => !existingTitles.has(i.title.toLowerCase()))
      .map((i) => ({
        ...i,
        id: `pack-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      }));

    updateSwot({
      ...swot,
      nicheFocus: swot.nicheFocus || pack.niche,
      items: [...swot.items, ...itemsToAdd],
      lastUpdated: new Date().toISOString().split('T')[0],
    });
    setIsSuggestionDrawerOpen(false);
  };

  // Filtered Items computation
  const filteredItems = useMemo(() => {
    return swot.items.filter((item) => {
      if (selectedCategoryFilter !== 'all' && item.category !== selectedCategoryFilter) return false;
      if (selectedPriorityFilter !== 'all' && item.priority !== selectedPriorityFilter) return false;
      if (selectedStatusFilter !== 'all' && item.responseStatus !== selectedStatusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesNiche = item.nicheArea.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesResponse = item.strategicResponse.toLowerCase().includes(q);
        if (!matchesTitle && !matchesNiche && !matchesDesc && !matchesResponse) return false;
      }
      return true;
    });
  }, [swot.items, selectedCategoryFilter, selectedPriorityFilter, selectedStatusFilter, searchQuery]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = swot.items.length;
    const strengths = swot.items.filter((i) => i.category === 'strengths').length;
    const weaknesses = swot.items.filter((i) => i.category === 'weaknesses').length;
    const opportunities = swot.items.filter((i) => i.category === 'opportunities').length;
    const threats = swot.items.filter((i) => i.category === 'threats').length;
    const respondedCount = swot.items.filter((i) => i.strategicResponse.trim().length > 0).length;
    const implementedCount = swot.items.filter((i) => i.responseStatus === 'implemented' || i.responseStatus === 'in_progress').length;
    const totalBudget = swot.items.reduce((sum, i) => sum + (i.budgetOrCapitalRequired || 0), 0);

    return {
      total,
      strengths,
      weaknesses,
      opportunities,
      threats,
      coveragePct: total > 0 ? Math.round((respondedCount / total) * 100) : 100,
      activeRatePct: total > 0 ? Math.round((implementedCount / total) * 100) : 0,
      totalBudget,
    };
  }, [swot.items]);

  return (
    <div className="space-y-6">
      {/* 1. Header & Niche Alignment Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 sm:p-7 shadow-lg space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Institutional Risk & Opportunity Framework
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Updated: {swot.lastUpdated || 'Current'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-sans tracking-tight">
              Niche Market SWOT & Strategic Business Response
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl mt-1">
              Identify domain-specific strengths, weaknesses, opportunities, and threats in your niche market. Crucially, formulate actionable business response strategies to capitalize on advantages and mitigate operating risks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsSuggestionDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Niche Strategy Packs</span>
            </button>

            <button
              onClick={() => openNewItemModal('strengths')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add SWOT Area & Response</span>
            </button>
          </div>
        </div>

        {/* Niche Metadata & Positioning Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-[#0b0f17] border border-slate-800 text-xs">
          <div>
            <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
              Target Niche / Micro-Market Focus
            </label>
            <input
              type="text"
              value={nicheFocusInput}
              onChange={(e) => setNicheFocusInput(e.target.value)}
              onBlur={() => handleUpdateNicheFocus(nicheFocusInput)}
              placeholder="e.g. Outpatient Ambulatory Surgery & Orthopedics"
              className="w-full bg-[#162032] border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-medium focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
              Niche Market Lifecycle Stage
            </label>
            <select
              value={swot.marketMaturity}
              onChange={(e) => handleUpdateMarketMaturity(e.target.value)}
              className="w-full bg-[#162032] border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-medium focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value="emerging">Emerging / Early Adoption</option>
              <option value="rapid_growth">Rapid Growth / Scaling</option>
              <option value="mature">Mature / Established Industry</option>
              <option value="consolidating">Consolidating / Late Lifecycle</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">
              Competitive Stance in Niche
            </label>
            <select
              value={swot.competitivePosition}
              onChange={(e) => handleUpdateCompetitivePosition(e.target.value)}
              className="w-full bg-[#162032] border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-medium focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value="market_leader">Market Leader / Dominant Share</option>
              <option value="challenger">Aggressive Challenger / Fast Mover</option>
              <option value="specialized_niche_player">Specialized Niche Specialist</option>
              <option value="new_entrant">Startup / New Market Entrant</option>
            </select>
          </div>
        </div>

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#162032] border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-mono">Response Plan Coverage</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono text-emerald-400">
                {stats.coveragePct}%
              </span>
              <span className="text-[10px] text-slate-500 font-sans">
                ({swot.items.length} of {swot.items.length} mapped)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">Every identified area has an active strategy</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#162032] border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-mono">Active Implementation</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono text-amber-400">
                {stats.activeRatePct}%
              </span>
              <span className="text-[10px] text-slate-500 font-sans">In Progress / Live</span>
            </div>
            <span className="text-[10px] text-slate-400 block">Meets bank credit committee diligence</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#162032] border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-mono">Capital & Reserves Allocated</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono text-slate-100">
                {formatCurrency(stats.totalBudget, true, currency)}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">Strategic budget across response actions</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#162032] border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px] font-mono">Quadrant Distribution</span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold mt-1">
              <span className="text-emerald-400">{stats.strengths}S</span>
              <span className="text-slate-600">·</span>
              <span className="text-amber-400">{stats.weaknesses}W</span>
              <span className="text-slate-600">·</span>
              <span className="text-sky-400">{stats.opportunities}O</span>
              <span className="text-slate-600">·</span>
              <span className="text-rose-400">{stats.threats}T</span>
            </div>
            <span className="text-[10px] text-slate-400 block">{stats.total} total niche assessments</span>
          </div>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111827] border border-slate-800 p-3 rounded-lg text-xs">
        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-[#1e293b] p-1 rounded">
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors font-medium ${
              viewMode === 'matrix'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>4-Quadrant Matrix</span>
          </button>
          <button
            onClick={() => setViewMode('registry')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors font-medium ${
              viewMode === 'registry'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Strategic Response Registry</span>
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-[#1e293b] border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-medium"
          >
            <option value="all">All Quadrants</option>
            <option value="strengths">Strengths Only</option>
            <option value="weaknesses">Weaknesses Only</option>
            <option value="opportunities">Opportunities Only</option>
            <option value="threats">Threats Only</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="bg-[#1e293b] border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-[#1e293b] border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-medium"
          >
            <option value="all">All Response Statuses</option>
            <option value="implemented">Implemented</option>
            <option value="in_progress">In Progress</option>
            <option value="planned">Planned</option>
            <option value="monitoring">Monitoring</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search niche or action..."
              className="bg-[#1e293b] border border-slate-700 rounded pl-7 pr-2.5 py-1 text-slate-200 placeholder-slate-500 w-36 sm:w-48 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* 3. Main Views */}
      {viewMode === 'matrix' ? (
        /* 4-QUADRANT INTERACTIVE MATRIX */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(['strengths', 'weaknesses', 'opportunities', 'threats'] as SwotCategory[]).map((catKey) => {
            const meta = CATEGORY_META[catKey];
            const Icon = meta.icon;
            const itemsInCat = filteredItems.filter((i) => i.category === catKey);

            return (
              <div
                key={catKey}
                className={`border rounded-xl p-5 ${meta.cardBg} ${meta.borderClass} space-y-4 shadow-sm flex flex-col`}
              >
                {/* Quadrant Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${meta.badgeClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-100 font-sans uppercase tracking-wide">
                          {meta.label}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                          {itemsInCat.length}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {meta.sublabel}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => openNewItemModal(catKey)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-800 rounded border border-slate-700 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Items List in this Quadrant */}
                <div className="flex-1 space-y-3">
                  {itemsInCat.length === 0 ? (
                    <div className="p-6 text-center rounded-lg border border-dashed border-slate-800 text-slate-500 text-xs space-y-2">
                      <p>No {meta.label.toLowerCase()} match your current filter.</p>
                      <button
                        onClick={() => openNewItemModal(catKey)}
                        className="text-amber-400 hover:text-amber-300 underline font-medium"
                      >
                        + Add a niche {meta.label.slice(0, -1).toLowerCase()}
                      </button>
                    </div>
                  ) : (
                    itemsInCat.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-3 hover:border-slate-700 transition-colors shadow-sm"
                      >
                        {/* Title & Niche Area Row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-amber-300 border border-slate-700">
                                Area: {item.nicheArea}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                                item.priority === 'critical'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : item.priority === 'high'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-700 text-slate-300'
                              }`}>
                                {item.priority}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-slate-100">
                              {item.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => openEditItemModal(item)}
                              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                              title="Edit Item"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Strategic Business Response Box */}
                        <div className="p-3 rounded-lg bg-[#162032] border-l-2 border-amber-400 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-amber-400 flex items-center gap-1 text-[11px] font-mono uppercase tracking-wide">
                              <Target className="w-3.5 h-3.5" />
                              Strategic Response Plan:
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                              item.responseStatus === 'implemented'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : item.responseStatus === 'in_progress'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              {item.responseStatus.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>

                          <p className="text-slate-200 leading-normal text-xs">
                            {item.strategicResponse}
                          </p>

                          {/* Footer Meta */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-700/60 text-[11px] text-slate-400 font-mono">
                            <div className="flex items-center gap-3">
                              {item.assignedOwner && (
                                <span className="flex items-center gap-1">
                                  <UserCheck className="w-3 h-3 text-slate-500" />
                                  {item.assignedOwner}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {item.timeframe.replace(/_/g, ' ')}
                              </span>
                            </div>

                            {item.budgetOrCapitalRequired ? (
                              <span className="text-emerald-400 font-semibold">
                                {formatCurrency(item.budgetOrCapitalRequired, true, currency)}
                              </span>
                            ) : null}
                          </div>

                          {item.impactOnFinancials && (
                            <div className="text-[11px] text-emerald-300/90 font-sans italic pt-0.5">
                              Impact: {item.impactOnFinancials}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DETAILED STRATEGIC RESPONSE REGISTRY VIEW */
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 font-sans">
                Full Strategic Risk & Opportunity Registry
              </h3>
              <p className="text-xs text-slate-400">
                Chronological and operational action register for management and bank loan underwriters.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Showing {filteredItems.length} of {swot.items.length} items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-700 bg-[#162032] text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Quadrant</th>
                  <th className="py-2.5 px-3">Niche Area & Title</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Strategic Response Plan</th>
                  <th className="py-2.5 px-3">Owner & Timeline</th>
                  <th className="py-2.5 px-3 text-right">Budget</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredItems.map((item) => {
                  const meta = CATEGORY_META[item.category];
                  return (
                    <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                      {/* Quadrant Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${meta.badgeClass}`}>
                          {item.category.slice(0, -1)}
                        </span>
                      </td>

                      {/* Niche Area & Title */}
                      <td className="py-3 px-3 max-w-xs">
                        <span className="text-[10px] text-amber-400 font-mono block">
                          Area: {item.nicheArea}
                        </span>
                        <span className="font-semibold text-slate-100 block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                          {item.description}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                          item.priority === 'critical'
                            ? 'bg-rose-500/20 text-rose-300'
                            : item.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {item.priority}
                        </span>
                      </td>

                      {/* Strategic Response */}
                      <td className="py-3 px-3 max-w-md">
                        <div className="p-2.5 rounded bg-[#162032] border border-slate-800 space-y-1">
                          <p className="text-slate-200 text-xs font-medium">
                            {item.strategicResponse}
                          </p>
                          {item.impactOnFinancials && (
                            <span className="text-[10px] text-emerald-400 font-mono block">
                              Impact: {item.impactOnFinancials}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Owner & Timeline */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-300 text-[11px] font-mono space-y-0.5">
                        <div className="font-medium text-slate-200">
                          {item.assignedOwner || 'Unassigned'}
                        </div>
                        <div className="text-slate-500">
                          {item.timeframe.replace(/_/g, ' ')}
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="py-3 px-3 text-right font-mono text-emerald-400 font-semibold whitespace-nowrap">
                        {item.budgetOrCapitalRequired
                          ? formatCurrency(item.budgetOrCapitalRequired, true, currency)
                          : '—'}
                      </td>

                      {/* Status Selector */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={item.responseStatus}
                          onChange={(e) => handleQuickStatusChange(item.id, e.target.value as SwotResponseStatus)}
                          className="bg-[#1e293b] border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 font-mono"
                        >
                          <option value="planned">Planned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="implemented">Implemented</option>
                          <option value="monitoring">Monitoring</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditItemModal(item)}
                            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MODAL: Add / Edit SWOT Item & Strategic Response */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-[#162032] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 font-sans">
                    {editingItem ? 'Edit Niche SWOT Area & Response' : 'Add Niche SWOT Area & Response Strategy'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Define the market area and how the business actively responds, mitigates, or capitalizes.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveItem} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Quadrant & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    SWOT Quadrant <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as SwotCategory)}
                    className="w-full bg-[#162032] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value="strengths">Strength (Internal Edge)</option>
                    <option value="weaknesses">Weakness (Internal Vulnerability)</option>
                    <option value="opportunities">Opportunity (External Tailwind)</option>
                    <option value="threats">Threat (External Headwind)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Priority / Impact Level <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as SwotPriority)}
                    className="w-full bg-[#162032] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value="critical">Critical (High Executive Attention)</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low / Monitoring</option>
                  </select>
                </div>
              </div>

              {/* Niche Specific Area */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Niche Domain Area / Dimension <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formNicheArea}
                  onChange={(e) => setFormNicheArea(e.target.value)}
                  placeholder="e.g. Regulatory CON License, Payor Reimbursement, Robotic Surgery Equipment..."
                  className="w-full bg-[#162032] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-medium focus:outline-none focus:border-amber-400"
                  required
                />
                {/* Suggestions pill bank */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500 font-mono py-0.5">Quick picks:</span>
                  {NICHE_AREA_SUGGESTIONS.slice(0, 5).map((sugg) => (
                    <button
                      key={sugg}
                      type="button"
                      onClick={() => setFormNicheArea(sugg)}
                      className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700/80 transition-colors"
                    >
                      {sugg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Item Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Exclusive Certificate of Need (CON) in Travis County"
                  className="w-full bg-[#162032] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-medium focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Detailed Operational Assessment / Context
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detail the circumstances, exact vulnerability, or distinctive capability..."
                  rows={2}
                  className="w-full bg-[#162032] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Crucial Part: Strategic Business Response Plan */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
                  <Target className="w-4 h-4" />
                  <span>Strategic Business Response Plan (Required)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  How does the business respond to this area? For strengths/opportunities, what is your offensive leverage action? For weaknesses/threats, what is your operational mitigation?
                </p>

                <textarea
                  value={formStrategicResponse}
                  onChange={(e) => setFormStrategicResponse(e.target.value)}
                  placeholder="e.g. Contractual pre-authorization guarantees with surgeons, dual-vendor sourcing agreements, $125K working capital reserve..."
                  rows={3}
                  className="w-full bg-[#162032] border border-amber-500/40 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400 font-medium"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                      Response Status
                    </label>
                    <select
                      value={formResponseStatus}
                      onChange={(e) => setFormResponseStatus(e.target.value as SwotResponseStatus)}
                      className="w-full bg-[#162032] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    >
                      <option value="planned">Planned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="implemented">Implemented</option>
                      <option value="monitoring">Monitoring</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                      Execution Horizon
                    </label>
                    <select
                      value={formTimeframe}
                      onChange={(e) => setFormTimeframe(e.target.value as SwotTimeframe)}
                      className="w-full bg-[#162032] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    >
                      <option value="immediate_30d">Immediate (30 Days)</option>
                      <option value="short_term_90d">Short-Term (90 Days)</option>
                      <option value="medium_term_1y">1-Year Strategic Horizon</option>
                      <option value="ongoing">Ongoing Policy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                      Assigned Lead / Role
                    </label>
                    <input
                      type="text"
                      value={formAssignedOwner}
                      onChange={(e) => setFormAssignedOwner(e.target.value)}
                      placeholder="e.g. Managing Partner / CFO"
                      className="w-full bg-[#162032] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                      Allocated Capital / Budget ({currency})
                    </label>
                    <input
                      type="number"
                      value={formBudget}
                      onChange={(e) => setFormBudget(e.target.value)}
                      placeholder="e.g. 25000"
                      className="w-full bg-[#162032] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                      Projected Financial Impact
                    </label>
                    <input
                      type="text"
                      value={formImpact}
                      onChange={(e) => setFormImpact(e.target.value)}
                      placeholder="e.g. +$240K Year 1 EBITDA / Prevents margin erosion"
                      className="w-full bg-[#162032] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow"
                >
                  {editingItem ? 'Save Updates' : 'Add to Niche SWOT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DRAWER / MODAL: Curated Niche Strategy Packs */}
      {isSuggestionDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-slate-700 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-[#162032] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 font-sans">
                    Niche Strategy & Response Starter Packs
                  </h3>
                  <p className="text-xs text-slate-400">
                    Import comprehensive, industry-tested SWOT items with built-in response plans tailored to your sector.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSuggestionDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {CURATED_NICHE_SUGGESTION_PACKS.map((pack) => (
                <div
                  key={pack.niche}
                  className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        {pack.niche}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Includes {pack.items.length} vetted niche assessments across all 4 quadrants with strategic responses.
                      </span>
                    </div>

                    <button
                      onClick={() => handleImportCuratedPack(pack)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium shadow-sm transition-colors text-xs shrink-0"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Import This Pack</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pack.items.map((it, idx) => {
                      const meta = CATEGORY_META[it.category];
                      return (
                        <div key={idx} className="p-3 rounded bg-[#162032] border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${meta.badgeClass}`}>
                              {it.category.slice(0, -1)}
                            </span>
                            <span className="text-[10px] text-amber-400 font-mono">
                              Area: {it.nicheArea}
                            </span>
                          </div>
                          <span className="font-semibold text-slate-200 block text-xs">
                            {it.title}
                          </span>
                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {it.description}
                          </p>
                          <div className="text-[10px] text-emerald-300 font-mono pt-1 border-t border-slate-700/60">
                            Response: {it.strategicResponse}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 border-t border-slate-800 bg-[#162032] flex justify-end">
              <button
                onClick={() => setIsSuggestionDrawerOpen(false)}
                className="px-4 py-1.5 rounded bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
