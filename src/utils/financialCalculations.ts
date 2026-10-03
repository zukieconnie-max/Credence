import {
  BusinessPlan,
  ComputedMetrics,
  ProjectedYearStatement,
  MonthlyCashFlowMonth,
  AmortizationRow,
} from '../types/businessPlan';
import { formatPlanCurrency } from './currency';

/**
 * Standard PMT Loan Payment formula
 * @param principal Loan principal amount
 * @param annualRatePct Annual interest rate in percent (e.g. 7.5)
 * @param totalMonths Total loan term in months
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRatePct: number,
  totalMonths: number
): number {
  if (principal <= 0 || totalMonths <= 0) return 0;
  if (annualRatePct <= 0) return principal / totalMonths;

  const monthlyRate = annualRatePct / 100 / 12;
  const pmt =
    (principal *
      (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  return Math.round(pmt * 100) / 100;
}

/**
 * Builds annual amortization schedule for up to loan term
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRatePct: number,
  totalMonths: number
): AmortizationRow[] {
  if (principal <= 0 || totalMonths <= 0) return [];

  const monthlyPayment = calculateMonthlyPayment(principal, annualRatePct, totalMonths);
  const monthlyRate = annualRatePct / 100 / 12;
  const totalYears = Math.min(10, Math.ceil(totalMonths / 12));
  const rows: AmortizationRow[] = [];

  let currentBalance = principal;

  for (let year = 1; year <= totalYears; year++) {
    const startBalance = currentBalance;
    let yearPrincipal = 0;
    let yearInterest = 0;
    let yearPayment = 0;

    const monthsInThisYear = Math.min(12, totalMonths - (year - 1) * 12);
    if (monthsInThisYear <= 0) break;

    for (let m = 1; m <= monthsInThisYear; m++) {
      if (currentBalance <= 0) break;
      const interestPayment = currentBalance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment;
      if (principalPayment > currentBalance) {
        principalPayment = currentBalance;
      }
      yearInterest += interestPayment;
      yearPrincipal += principalPayment;
      yearPayment += principalPayment + interestPayment;
      currentBalance -= principalPayment;
    }

    rows.push({
      period: year,
      label: `Year ${year}`,
      beginningBalance: Math.round(startBalance),
      payment: Math.round(yearPayment),
      principal: Math.round(yearPrincipal),
      interest: Math.round(yearInterest),
      endingBalance: Math.max(0, Math.round(currentBalance)),
    });

    if (currentBalance <= 0) break;
  }

  return rows;
}

/**
 * Computes 5-Year Financial Statements & Pro-Forma Balance Sheets
 */
export function compute5YearProjections(
  plan: BusinessPlan,
  revenueMultiplier: number = 1.0,
  cogsMultiplier: number = 1.0,
  rateAdjustmentBps: number = 0
): ProjectedYearStatement[] {
  const years: ProjectedYearStatement[] = [];
  const effectiveRate = plan.loanRequest.interestRatePct + rateAdjustmentBps / 100;
  const amortRows = generateAmortizationSchedule(
    plan.loanRequest.amount,
    effectiveRate,
    plan.loanRequest.termMonths
  );

  let cumulativeRetainedEarnings = 0;
  let runningCash = plan.startingCash;
  let runningFixedAssets = plan.initialFixedAssets;

  // Add CapEx from Sources and Uses (Equipment + Real estate + Leaseholds)
  const capexFromUses = plan.sourcesAndUses.uses
    .filter(u => ['real_estate', 'machinery_equipment', 'leasehold_improvements'].includes(u.category))
    .reduce((sum, u) => sum + u.amount, 0);

  runningFixedAssets += capexFromUses;

  for (let y = 1; y <= 5; y++) {
    // 1. Calculate Revenue
    let yearRevenue = 0;
    plan.revenueStreams.forEach((stream) => {
      let streamVal = stream.year1;
      for (let prev = 2; prev <= y; prev++) {
        const growth = stream.growthRatesPct[prev - 2] ?? 0;
        streamVal = streamVal * (1 + growth / 100);
      }
      yearRevenue += streamVal;
    });

    yearRevenue = Math.round(yearRevenue * revenueMultiplier);

    // 2. Cost of Goods Sold (COGS)
    const baseCogs = yearRevenue * (1 - plan.grossMarginPct / 100);
    const yearCogs = Math.round(baseCogs * cogsMultiplier);
    const grossProfit = yearRevenue - yearCogs;
    const grossMarginPct = yearRevenue > 0 ? (grossProfit / yearRevenue) * 100 : 0;

    // 3. Operating Expenses (Opex)
    let yearOpex = 0;
    plan.expenses.forEach((exp) => {
      let expVal = exp.year1;
      for (let prev = 2; prev <= y; prev++) {
        expVal = expVal * (1 + exp.annualGrowthPct / 100);
      }
      yearOpex += expVal;
    });
    yearOpex = Math.round(yearOpex);

    // 4. Operating Profitability
    const ebitda = grossProfit - yearOpex;
    const depreciation = Math.round(plan.annualDepreciation);
    const ebit = ebitda - depreciation;

    // 5. Interest & Debt Service
    const amortThisYear = amortRows.find((r) => r.period === y);
    const interestExpense = amortThisYear ? amortThisYear.interest : 0;
    const principalPaid = amortThisYear ? amortThisYear.principal : 0;
    const annualDebtService = interestExpense + principalPaid;

    // Existing debt interest and principal
    const existingDebtAnnualService = plan.existingDebts
      .filter((d) => !d.refinanceWithNewLoan)
      .reduce((sum, d) => sum + d.monthlyPayment * 12, 0);

    const totalAnnualDebtService = annualDebtService + existingDebtAnnualService;

    // 6. Tax and Net Income
    const taxableIncome = Math.max(0, ebit - interestExpense);
    const taxExpense = Math.round(taxableIncome * (plan.effectiveTaxRatePct / 100));
    const netIncome = ebit - interestExpense - taxExpense;

    // 7. DSCR: EBITDA / Total Annual Debt Service
    const dscr = totalAnnualDebtService > 0 ? Math.round((ebitda / totalAnnualDebtService) * 100) / 100 : 9.99;

    // 8. Pro-Forma Balance Sheet calculations
    cumulativeRetainedEarnings += netIncome;
    runningFixedAssets = Math.max(0, runningFixedAssets - depreciation);

    // Working Capital Items
    const accountsReceivable = Math.round((yearRevenue / 365) * plan.daysSalesOutstanding);
    const inventory = Math.round((yearCogs / 365) * plan.inventoryTurnoverDays);
    const accountsPayable = Math.round((yearCogs / 365) * plan.accountsPayableDays);

    // Remaining Debt Balance
    const remainingLongTermDebt = amortThisYear ? amortThisYear.endingBalance : 0;
    const nextYearAmort = amortRows.find((r) => r.period === y + 1);
    const currentDebtPortion = nextYearAmort ? nextYearAmort.principal : 0;

    // Cash flow to cash balance
    // Cash = Start + Net Income + Depreciation - Principal Paid - Change in Working Capital
    const workingCapitalChange = accountsReceivable + inventory - accountsPayable;
    runningCash = Math.max(
      15000,
      Math.round(runningCash + netIncome + depreciation - principalPaid - workingCapitalChange * 0.15)
    );

    const totalAssets = runningCash + accountsReceivable + inventory + runningFixedAssets;
    const totalLiabilities = accountsPayable + currentDebtPortion + remainingLongTermDebt;
    const totalEquity = plan.initialPaidInCapital + cumulativeRetainedEarnings;

    // Check balance sheet integrity: Assets = Liabilities + Equity
    const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 5000;

    years.push({
      year: y,
      revenue: yearRevenue,
      cogs: yearCogs,
      grossProfit,
      grossMarginPct: Math.round(grossMarginPct * 10) / 10,
      opex: yearOpex,
      ebitda,
      depreciation,
      ebit,
      interestExpense,
      taxableIncome,
      taxExpense,
      netIncome,
      annualDebtService: totalAnnualDebtService,
      dscr,
      cash: runningCash,
      accountsReceivable,
      inventory,
      netFixedAssets: runningFixedAssets,
      totalAssets,
      accountsPayable,
      currentDebtPortion,
      longTermDebt: remainingLongTermDebt,
      totalLiabilities,
      retainedEarnings: cumulativeRetainedEarnings,
      paidInCapital: plan.initialPaidInCapital,
      totalEquity,
      isBalanced,
    });
  }

  return years;
}

/**
 * Computes Month-by-Month Cash Flow for Year 1
 */
export function computeYear1MonthlyCashFlow(
  plan: BusinessPlan,
  year1Statement: ProjectedYearStatement
): MonthlyCashFlowMonth[] {
  const months: MonthlyCashFlowMonth[] = [];
  const monthNames = [
    'Month 1', 'Month 2', 'Month 3', 'Month 4',
    'Month 5', 'Month 6', 'Month 7', 'Month 8',
    'Month 9', 'Month 10', 'Month 11', 'Month 12',
  ];

  // Seasonality weighting (ramp-up curve for first year: starts around 6.5%, peaks at 10%)
  const weights = [0.065, 0.07, 0.075, 0.08, 0.082, 0.085, 0.088, 0.09, 0.095, 0.10, 0.105, 0.11];
  const monthlyDebtService = Math.round(year1Statement.annualDebtService / 12);

  let currentCash = plan.startingCash;

  // Initial cash injection from Sources (Loan proceeds + Equity injection)
  const totalLoanProceeds = plan.loanRequest.amount;
  const borrowerEquity = plan.sourcesAndUses.sources
    .filter((s) => s.category === 'borrower_cash_equity')
    .reduce((sum, s) => sum + s.amount, 0);

  currentCash += borrowerEquity + totalLoanProceeds;

  // Immediate deduction of initial Uses (Equipment, Real Estate, Inventory, Fees)
  const initialUsesDeduction = plan.sourcesAndUses.uses
    .filter((u) => u.category !== 'working_capital')
    .reduce((sum, u) => sum + u.amount, 0);

  currentCash -= initialUsesDeduction;

  for (let m = 0; m < 12; m++) {
    const inflow = Math.round(year1Statement.revenue * weights[m]);
    const outflow = Math.round((year1Statement.cogs + year1Statement.opex) * weights[m]);
    const netCashFlow = inflow - outflow - monthlyDebtService;
    currentCash += netCashFlow;

    months.push({
      month: m + 1,
      monthName: monthNames[m],
      cashInflow: inflow,
      cashOutflow: outflow,
      debtService: monthlyDebtService,
      netCashFlow,
      endingCash: currentCash,
    });
  }

  return months;
}

/**
 * Computes all institutional credit underwriting ratios & covenants
 */
export function computeCreditMetrics(plan: BusinessPlan): ComputedMetrics {
  const monthlyPayment = calculateMonthlyPayment(
    plan.loanRequest.amount,
    plan.loanRequest.interestRatePct,
    plan.loanRequest.termMonths
  );

  const annualDebtService = monthlyPayment * 12;
  const totalInterestOverLife = Math.max(
    0,
    monthlyPayment * plan.loanRequest.termMonths - plan.loanRequest.amount
  );

  // Sources and Uses
  const totalSources = plan.sourcesAndUses.sources.reduce((sum, s) => sum + s.amount, 0);
  const totalUses = plan.sourcesAndUses.uses.reduce((sum, u) => sum + u.amount, 0);
  const sourcesUsesDelta = totalSources - totalUses;

  const borrowerEquity = plan.sourcesAndUses.sources
    .filter((s) => s.category === 'borrower_cash_equity')
    .reduce((sum, s) => sum + s.amount, 0);

  const equityInjectionPct = totalUses > 0 ? (borrowerEquity / totalUses) * 100 : 0;
  // Standard bank requirement is >= 10% (often 15-20% for startups/SBA)
  const meetsEquityBenchmark = equityInjectionPct >= 10.0;

  // Collateral & LTV
  let totalCollateralFMV = 0;
  let totalDiscountedCollateral = 0;

  plan.collateral.forEach((item) => {
    totalCollateralFMV += item.fairMarketValue;
    const discounted = (item.fairMarketValue * (item.advanceRatePct / 100)) - item.priorLiens;
    totalDiscountedCollateral += Math.max(0, discounted);
  });

  const loanToValuePct =
    totalCollateralFMV > 0 ? (plan.loanRequest.amount / totalCollateralFMV) * 100 : 150;
  const collateralCoverageRatio =
    plan.loanRequest.amount > 0 ? totalDiscountedCollateral / plan.loanRequest.amount : 0;
  const meetsCollateralBenchmark = collateralCoverageRatio >= 0.85;

  // 5-Year Statements
  const projections = compute5YearProjections(plan);
  const y1 = projections[0] || ({} as ProjectedYearStatement);

  const year1DSCR = y1.dscr || 0;
  const average5YearDSCR =
    projections.length > 0
      ? projections.reduce((sum, p) => sum + p.dscr, 0) / projections.length
      : 0;

  // Break-even revenue Year 1: Fixed costs / Gross margin %
  const grossMarginDecimal = (y1.grossMarginPct || 50) / 100;
  const breakEvenRevenueYear1 =
    grossMarginDecimal > 0 ? Math.round(y1.opex / grossMarginDecimal) : y1.revenue;
  const marginOfSafetyPctYear1 =
    y1.revenue > 0 ? Math.round(((y1.revenue - breakEvenRevenueYear1) / y1.revenue) * 100) : 0;

  // Liquidity and Leverage
  const currentAssets = (y1.cash || 0) + (y1.accountsReceivable || 0) + (y1.inventory || 0);
  const currentLiabilities = (y1.accountsPayable || 0) + (y1.currentDebtPortion || 0);
  const year1CurrentRatio =
    currentLiabilities > 0 ? Math.round((currentAssets / currentLiabilities) * 100) / 100 : 2.5;

  const year1DebtToEquity =
    (y1.totalEquity || 0) > 0
      ? Math.round(((y1.totalLiabilities || 0) / y1.totalEquity) * 100) / 100
      : 3.5;

  const year1NetMarginPct =
    (y1.revenue || 0) > 0 ? Math.round(((y1.netIncome || 0) / y1.revenue) * 1000) / 10 : 0;

  // Guarantor compliance check: SBA/Bank rules mandate any owner with >= 20% MUST personally guarantee
  const majorOwnersMissingGuarantees: string[] = [];
  let allGuarantorsSigned = true;

  plan.guarantors.forEach((g) => {
    if (g.ownershipPct >= 20 && !g.personalGuaranteePledged) {
      allGuarantorsSigned = false;
      majorOwnersMissingGuarantees.push(`${g.name} (${g.ownershipPct}% ownership)`);
    }
  });

  return {
    monthlyPayment,
    annualDebtService,
    totalInterestOverLife: Math.round(totalInterestOverLife),
    totalSources,
    totalUses,
    sourcesUsesDelta,
    borrowerEquityAmount: borrowerEquity,
    equityInjectionPct: Math.round(equityInjectionPct * 10) / 10,
    meetsEquityBenchmark,
    totalCollateralFMV,
    totalDiscountedCollateral: Math.round(totalDiscountedCollateral),
    loanToValuePct: Math.round(loanToValuePct * 10) / 10,
    collateralCoverageRatio: Math.round(collateralCoverageRatio * 100) / 100,
    meetsCollateralBenchmark,
    year1DSCR,
    average5YearDSCR: Math.round(average5YearDSCR * 100) / 100,
    breakEvenRevenueYear1,
    marginOfSafetyPctYear1,
    year1CurrentRatio,
    year1DebtToEquity,
    year1NetMarginPct,
    allGuarantorsSigned,
    majorOwnersMissingGuarantees,
  };
}

/**
 * Format currency with commas and currency symbol based on regional currency code
 */
export function formatCurrency(num: number, hideDecimals: boolean = true, currencyCode: string = 'USD'): string {
  return formatPlanCurrency(num, currencyCode, hideDecimals);
}

/**
 * Format percentage
 */
export function formatPercent(num: number, decimals: number = 1): string {
  if (num === undefined || num === null || isNaN(num)) return '0.0%';
  return `${num.toFixed(decimals)}%`;
}
