export type LegalStructure = 'LLC' | 'C-Corp' | 'S-Corp' | 'Partnership' | 'Sole-Prop';
export type BusinessStage = 'running_business' | 'business_idea' | 'expansion_stage';
export type LoanFacilityType = 
  | 'commercial_term_loan' 
  | 'sba_7a' 
  | 'sba_504' 
  | 'revolving_line_of_credit' 
  | 'equipment_financing' 
  | 'commercial_real_estate';

export interface LoanRequest {
  amount: number;
  facilityType: LoanFacilityType;
  termMonths: number;
  interestRatePct: number;
  rateType: 'fixed' | 'variable';
  gracePeriodMonths: number;
  purpose: string;
  repaymentFrequency: 'monthly' | 'quarterly';
}

export interface SourceItem {
  id: string;
  sourceName: string;
  category: 'senior_bank_debt' | 'subordinated_debt' | 'borrower_cash_equity' | 'seller_financing' | 'grant_other';
  amount: number;
}

export interface UseItem {
  id: string;
  description: string;
  category: 'real_estate' | 'leasehold_improvements' | 'machinery_equipment' | 'inventory' | 'working_capital' | 'refinance_debt' | 'closing_legal_fees';
  amount: number;
}

export interface SourcesAndUses {
  sources: SourceItem[];
  uses: UseItem[];
}

export interface EntityInfo {
  companyName: string;
  dba: string;
  legalStructure: LegalStructure;
  stateOfIncorporation: string;
  dateEstablished: string;
  ein: string;
  naicsCode: string;
  naicsDescription: string;
  streetAddress: string;
  cityStateZip: string;
  facilityType: 'leased' | 'owned';
  facilitySqFt: number;
  monthlyRent: number;
  leaseExpiration: string;
}

export interface Guarantor {
  id: string;
  name: string;
  title: string;
  ownershipPct: number;
  creditScore: number;
  tangibleNetWorth: number;
  liquidAssets: number;
  personalGuaranteePledged: boolean;
  yearsExperience: number;
  bio: string;
}

export interface BusinessProfile {
  executiveSummary: string;
  missionStatement: string;
  valueProposition: string;
  primaryProducts: string;
  targetMarket: string;
  topCustomerConcentrationPct: number; // Single customer max % of revenue
  customerConcentrationMitigation: string;
  competitiveMoat: string;
  keySuppliers: string;
  operationalRisks: string;
  riskMitigationStrategies: string;
}

export interface HistoricalYear {
  yearLabel: string;
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
}

export interface RevenueStream {
  id: string;
  name: string;
  year1: number;
  growthRatesPct: number[]; // [y2_growth, y3_growth, y4_growth, y5_growth]
}

export interface ExpenseItem {
  id: string;
  category: 
    | 'executive_payroll' 
    | 'staff_wages' 
    | 'facility_rent' 
    | 'marketing_acquisition' 
    | 'insurance' 
    | 'software_tech' 
    | 'utilities' 
    | 'professional_legal' 
    | 'general_admin' 
    | 'maintenance_other';
  name: string;
  year1: number;
  annualGrowthPct: number;
}

export interface MonthlyCashFlowMonth {
  month: number;
  monthName: string;
  cashInflow: number;
  cashOutflow: number;
  debtService: number;
  netCashFlow: number;
  endingCash: number;
}

export interface ProjectedYearStatement {
  year: number;
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMarginPct: number;
  opex: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  interestExpense: number;
  taxableIncome: number;
  taxExpense: number;
  netIncome: number;
  annualDebtService: number;
  dscr: number;
  // Pro-Forma Balance Sheet Items
  cash: number;
  accountsReceivable: number;
  inventory: number;
  netFixedAssets: number;
  totalAssets: number;
  accountsPayable: number;
  currentDebtPortion: number;
  longTermDebt: number;
  totalLiabilities: number;
  retainedEarnings: number;
  paidInCapital: number;
  totalEquity: number;
  isBalanced: boolean;
}

export interface CollateralItem {
  id: string;
  assetType: 'commercial_real_estate' | 'machinery_equipment' | 'accounts_receivable' | 'inventory' | 'cash_deposits' | 'other';
  description: string;
  costBasis: number;
  fairMarketValue: number;
  advanceRatePct: number; // e.g. 80% for CRE, 70% for equipment, 75% for A/R, 50% for Inventory
  priorLiens: number;
}

export interface ExistingDebtItem {
  id: string;
  creditorName: string;
  originalAmount: number;
  currentBalance: number;
  interestRatePct: number;
  monthlyPayment: number;
  maturityDate: string;
  refinanceWithNewLoan: boolean;
}

export interface AmortizationRow {
  period: number; // Year or Month
  label: string;
  beginningBalance: number;
  payment: number;
  principal: number;
  interest: number;
  endingBalance: number;
}

export interface ComputedMetrics {
  monthlyPayment: number;
  annualDebtService: number;
  totalInterestOverLife: number;
  totalSources: number;
  totalUses: number;
  sourcesUsesDelta: number;
  borrowerEquityAmount: number;
  equityInjectionPct: number;
  meetsEquityBenchmark: boolean;
  totalCollateralFMV: number;
  totalDiscountedCollateral: number;
  loanToValuePct: number;
  collateralCoverageRatio: number;
  meetsCollateralBenchmark: boolean;
  year1DSCR: number;
  average5YearDSCR: number;
  breakEvenRevenueYear1: number;
  marginOfSafetyPctYear1: number;
  year1CurrentRatio: number;
  year1DebtToEquity: number;
  year1NetMarginPct: number;
  allGuarantorsSigned: boolean;
  majorOwnersMissingGuarantees: string[];
}

export interface UnderwriterReview {
  overallRating: 'Approved / Low Risk' | 'Conditional Approval / Moderate Risk' | 'Heightened Scrutiny / Elevated Risk' | 'Decline / High Risk';
  underwriterScore: number;
  executiveSummary: string;
  keyStrengths: string[];
  keyWeaknesses: string[];
  recommendedCovenants: string[];
  sensitivityStressVerdict: string;
  reviewedAt?: string;
  aiNotice?: string;
}

export interface BusinessPlan {
  id: string;
  title: string;
  stage: BusinessStage;
  createdAt: string;
  updatedAt: string;
  templateId?: string;
  currency?: string; // Regional currency code (e.g. 'USD', 'EUR', 'GBP', etc.)
  
  // Modules
  loanRequest: LoanRequest;
  sourcesAndUses: SourcesAndUses;
  entityInfo: EntityInfo;
  guarantors: Guarantor[];
  businessProfile: BusinessProfile;
  historicalFinancials: HistoricalYear[];
  
  // Projections
  startingCash: number;
  revenueStreams: RevenueStream[];
  grossMarginPct: number;
  expenses: ExpenseItem[];
  annualDepreciation: number;
  effectiveTaxRatePct: number;
  daysSalesOutstanding: number; // For A/R projection
  inventoryTurnoverDays: number; // For Inventory projection
  accountsPayableDays: number; // For A/P projection
  
  // Balance Sheet Initial Balances
  initialFixedAssets: number;
  initialPaidInCapital: number;
  
  // Debt & Collateral
  existingDebts: ExistingDebtItem[];
  collateral: CollateralItem[];
  
  // Stress Test Settings
  stressRevenueDropPct: number; // default 15%
  stressCogsIncreasePct: number; // default 5%
  stressInterestRateHikeBps: number; // default 200 bps (+2%)
  
  // AI Underwriter Memo
  underwriterReview?: UnderwriterReview;

  // Niche SWOT & Strategic Risk/Opportunity Response
  swotAnalysis?: SwotAnalysis;

  // Commercial Plan Payment ($8 Flat Fee)
  isPaid?: boolean;
  paymentReceipt?: import('./auth').PaymentReceipt;
}

export type SwotCategory = 'strengths' | 'weaknesses' | 'opportunities' | 'threats';
export type SwotPriority = 'critical' | 'high' | 'medium' | 'low';
export type SwotTimeframe = 'immediate_30d' | 'short_term_90d' | 'medium_term_1y' | 'ongoing';
export type SwotResponseStatus = 'planned' | 'in_progress' | 'implemented' | 'monitoring';

export interface SwotItem {
  id: string;
  category: SwotCategory;
  nicheArea: string; // Specific niche area (e.g. "Regulatory Compliance", "Proprietary Tech", "Payor Mix", "Raw Material Sourcing")
  title: string;
  description: string;
  priority: SwotPriority;

  // Strategic Response Details
  strategicResponse: string; // How the business responds, mitigates, or leverages this area in its niche
  responseStatus: SwotResponseStatus;
  timeframe: SwotTimeframe;
  assignedOwner?: string; // Lead officer or role
  budgetOrCapitalRequired?: number; // Capital allocated for the response
  impactOnFinancials?: string; // Projected impact on revenues, costs, margins, or risk
}

export interface SwotAnalysis {
  nicheFocus: string; // e.g. "Outpatient Robotic Joint Replacement & Interventional Spine"
  marketMaturity: 'emerging' | 'rapid_growth' | 'mature' | 'consolidating';
  competitivePosition: 'market_leader' | 'challenger' | 'specialized_niche_player' | 'new_entrant';
  lastUpdated?: string;
  items: SwotItem[];
}
