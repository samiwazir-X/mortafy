import {
  AmortizationRow,
  AnnualAmortizationRow,
  ClosingCostsBreakdown,
  CountryCode,
  DtiComfortLevel,
  FinancingMode,
  IslamicInstallmentType,
  MortgageCalculationResult,
  MortgageInputs,
} from "./types";

/**
 * 1 & 2. Monthly Effective Rate Calculation
 * - Standard Monthly Compounding (US, UK, AU, UAE, EU, PK, SA, IN, SG, HK):
 *   r = annual_interest_rate / 12 / 100
 * - Canadian Semi-Annual Compounding (CA):
 *   By Canadian federal law (Interest Act), mortgage interest compounds semi-annually, not in advance:
 *   r_monthly = (1 + (annual_interest_rate / 100) / 2)^(1/6) - 1
 */
export function getEffectiveMonthlyRate(
  annualInterestRatePct: number,
  countryCode: CountryCode
): number {
  if (annualInterestRatePct <= 0) return 0;
  const annualDecimal = annualInterestRatePct / 100;

  if (countryCode === "CA") {
    return Math.pow(1 + annualDecimal / 2, 1 / 6) - 1;
  }

  return annualDecimal / 12;
}

/**
 * 3. South Asian Number Formatting (IN / PK):
 * Supports Indian 2-2-3 grouping locale ('en-IN') rendering Lakhs and Crores properly
 * (e.g., ₹ 75,00,000 instead of ₹ 7,500,000) with compact badge indicators (e.g., ₹ 75 L / ₹ 1.5 Cr).
 */
export function formatIndianNumber(
  amount: number,
  currencySymbol = "₹ ",
  compact = false
): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  const abs = Math.abs(safe);
  const sign = safe < 0 ? "-" : "";

  if (compact) {
    if (abs >= 10000000) {
      const cr = (abs / 10000000).toFixed(2).replace(/\.00$/, "");
      return `${sign}${currencySymbol}${cr} Cr`;
    }
    if (abs >= 100000) {
      const lakh = (abs / 100000).toFixed(2).replace(/\.00$/, "");
      return `${sign}${currencySymbol}${lakh} L`;
    }
  }

  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(abs));

  return `${sign}${currencySymbol}${formatted}`;
}

/**
 * Standard & Canadian Monthly P&I Formula:
 * Monthly P&I = P * [r * (1 + r)^n] / [(1 + r)^n - 1]
 */
export function calculateConventionalMonthlyPI(
  principal: number,
  annualInterestRatePct: number,
  loanYears: number,
  countryCode: CountryCode
): number {
  if (principal <= 0 || loanYears <= 0) return 0;
  const n = Math.round(loanYears * 12);
  const r = getEffectiveMonthlyRate(annualInterestRatePct, countryCode);

  if (r <= 0) {
    return principal / n;
  }

  const factor = Math.pow(1 + r, n);
  return (principal * (r * factor)) / (factor - 1);
}

/**
 * Canadian CMHC Default Insurance Premium Tier Calculation:
 * - 15% to 19.99% down (80.01% - 85% LTV): 2.80%
 * - 10% to 14.99% down (85.01% - 90% LTV): 3.10%
 * - 5% to 9.99% down (90.01% - 95% LTV): 4.00%
 */
export function getCanadianCmhcRatePct(downPaymentPct: number): number {
  if (downPaymentPct >= 20) return 0;
  if (downPaymentPct >= 15) return 2.8;
  if (downPaymentPct >= 10) return 3.1;
  return 4.0;
}

/**
 * 4. Islamic Diminishing Musharakah Home Financing:
 * Supports both:
 * - "equal" (Equal Monthly Installment structure matching modern Islamic banks, where total monthly payment
 *   matches standard annuity, split between dynamic rent on remaining bank shares and equity unit buyout)
 * - "declining" (Classical structure: Monthly payment = (Principal / n) [Equity Buyout] + (Remaining_Bank_Share * r) [Rent])
 */
export function calculateIslamicMusharakahFirstMonth(
  principal: number,
  annualRentalRatePct: number,
  loanYears: number,
  countryCode: CountryCode,
  installmentType: IslamicInstallmentType = "equal"
): {
  equityBuyoutShare: number;
  firstMonthRent: number;
  firstMonthTotal: number;
} {
  if (principal <= 0 || loanYears <= 0) {
    return { equityBuyoutShare: 0, firstMonthRent: 0, firstMonthTotal: 0 };
  }
  const n = Math.round(loanYears * 12);
  const monthlyRentalRate = getEffectiveMonthlyRate(
    annualRentalRatePct,
    countryCode
  );
  const firstMonthRent = principal * monthlyRentalRate;

  if (installmentType === "equal") {
    const equalInstallment = calculateConventionalMonthlyPI(
      principal,
      annualRentalRatePct,
      loanYears,
      countryCode
    );
    const equityBuyoutShare = Math.max(0, equalInstallment - firstMonthRent);
    return {
      equityBuyoutShare,
      firstMonthRent,
      firstMonthTotal: equalInstallment,
    };
  }

  const equityBuyoutShare = principal / n;
  return {
    equityBuyoutShare,
    firstMonthRent,
    firstMonthTotal: equityBuyoutShare + firstMonthRent,
  };
}

/**
 * Progressive UK Stamp Duty Land Tax (SDLT) residential tiers:
 * Up to £250,000: 0%
 * £250,001 to £925,000: 5%
 * £925,001 to £1,500,000: 10%
 * Above £1,500,000: 12%
 */
export function calculateUKStampDuty(homePrice: number): number {
  let sdlt = 0;
  if (homePrice > 250000) {
    const tier1 = Math.min(homePrice, 925000) - 250000;
    sdlt += tier1 * 0.05;
  }
  if (homePrice > 925000) {
    const tier2 = Math.min(homePrice, 1500000) - 925000;
    sdlt += tier2 * 0.1;
  }
  if (homePrice > 1500000) {
    const tier3 = homePrice - 1500000;
    sdlt += tier3 * 0.12;
  }
  return Math.round(sdlt);
}

/**
 * Singapore Buyer's Stamp Duty (BSD) Tiered Calculation (IRAS Residential Tiers):
 * - First S$180,000: 1%
 * - Next S$180,000 (S$180k - S$360k): 2%
 * - Next S$640,000 (S$360k - S$1.0M): 3%
 * - Next S$500,000 (S$1.0M - S$1.5M): 4%
 * - Next S$1,500,000 (S$1.5M - S$3.0M): 5%
 * - Remaining amount above S$3.0M: 6%
 */
export function calculateSingaporeBSD(homePrice: number): number {
  if (homePrice <= 0) return 0;
  let bsd = 0;

  const t1 = Math.min(homePrice, 180000);
  bsd += t1 * 0.01;

  if (homePrice > 180000) {
    const t2 = Math.min(homePrice - 180000, 180000);
    bsd += t2 * 0.02;
  }
  if (homePrice > 360000) {
    const t3 = Math.min(homePrice - 360000, 640000);
    bsd += t3 * 0.03;
  }
  if (homePrice > 1000000) {
    const t4 = Math.min(homePrice - 1000000, 500000);
    bsd += t4 * 0.04;
  }
  if (homePrice > 1500000) {
    const t5 = Math.min(homePrice - 1500000, 1500000);
    bsd += t5 * 0.05;
  }
  if (homePrice > 3000000) {
    const t6 = homePrice - 3000000;
    bsd += t6 * 0.06;
  }

  return Math.round(bsd);
}

/**
 * Hong Kong Ad Valorem Stamp Duty (AVD Scale 2 Residential Tiers)
 */
export function calculateHongKongAVD(homePrice: number): number {
  if (homePrice <= 3000000) return 100;
  if (homePrice <= 4500000) return Math.round(homePrice * 0.015);
  if (homePrice <= 6000000) return Math.round(homePrice * 0.0225);
  if (homePrice <= 9000000) return Math.round(homePrice * 0.03);
  if (homePrice <= 20000000) return Math.round(homePrice * 0.0375);
  return Math.round(homePrice * 0.0425);
}

/**
 * 6. Jurisdiction-Specific Fees & Closing Costs across all 11 Markets
 */
export function calculateClosingCostsAndPMI(
  homePrice: number,
  downPaymentAmount: number,
  countryCode: CountryCode,
  pmiAutoEnabled: boolean,
  financingMode: FinancingMode
): {
  closingCosts: ClosingCostsBreakdown;
  monthlyPmi: number;
  isPmiApplicable: boolean;
  pmiLabel: string;
  pmiSublabel: string;
  cmhcPremiumRatePct: number;
  cmhcPremiumAmount: number;
} {
  const safeHomePrice = Math.max(0, homePrice);
  const safeDownPayment = Math.min(
    safeHomePrice,
    Math.max(0, downPaymentAmount)
  );
  const baseLoanAmount = Math.max(0, safeHomePrice - safeDownPayment);
  const downPaymentPct =
    safeHomePrice > 0 ? (safeDownPayment / safeHomePrice) * 100 : 0;
  const ltvPct = 100 - downPaymentPct;

  // Singapore (SG): Do NOT display any PMI row.
  // Canada (CA): Rename to "CMHC Default Insurance" and capitalize premium into financed mortgage balance.
  const isSingapore = countryCode === "SG";
  const isCanada = countryCode === "CA";

  const isPmiApplicable =
    !isSingapore && downPaymentPct < 20 && baseLoanAmount > 0;

  let cmhcPremiumRatePct = 0;
  let cmhcPremiumAmount = 0;
  let monthlyPmi = 0;
  let pmiLabel = "Private Mortgage Insurance (PMI)";
  let pmiSublabel = "Down payment < 20% (~0.55%/yr)";

  if (isCanada && isPmiApplicable) {
    cmhcPremiumRatePct = getCanadianCmhcRatePct(downPaymentPct);
    cmhcPremiumAmount =
      pmiAutoEnabled && financingMode === "conventional"
        ? Math.round(baseLoanAmount * (cmhcPremiumRatePct / 100))
        : 0;
    pmiLabel = "CMHC Default Insurance";
    pmiSublabel = `Capitalized (${cmhcPremiumRatePct.toFixed(
      1
    )}% added to loan balance)`;
    // Monthly impact is already inside capitalized P&I, so standalone monthlyPmi is 0
    monthlyPmi = 0;
  } else if (isPmiApplicable && pmiAutoEnabled && financingMode === "conventional") {
    monthlyPmi = (baseLoanAmount * 0.0055) / 12;
  }

  let transferOrStampTax = 0;
  let transferTaxLabel = "Transfer / Stamp Tax";
  let closingOrAgencyFees = 0;
  let closingFeeLabel = "Origination & Legal Fees";
  let ltvWarning: string | null = null;

  switch (countryCode) {
    case "US":
      transferOrStampTax = safeHomePrice * 0.01;
      transferTaxLabel = "Title & Transfer Tax (1.0%)";
      closingOrAgencyFees = safeHomePrice * 0.015;
      closingFeeLabel = "Lender & Escrow Closing (1.5%)";
      if (downPaymentPct < 20) {
        ltvWarning =
          "Down payment < 20%: Private Mortgage Insurance (PMI ~0.55%/yr) applies until 80% LTV.";
      }
      break;

    case "GB":
      transferOrStampTax = calculateUKStampDuty(safeHomePrice);
      transferTaxLabel = "UK Progressive Stamp Duty (SDLT)";
      closingOrAgencyFees = 2450;
      closingFeeLabel = "Solicitor & Land Registry Fees";
      break;

    case "AE":
      transferOrStampTax = safeHomePrice * 0.04 + 4200;
      transferTaxLabel = "4% DLD Transfer Fee + Trustee";
      closingOrAgencyFees = safeHomePrice * 0.02;
      closingFeeLabel = "2% Agency Brokerage Fee";
      if (downPaymentPct < 20) {
        ltvWarning =
          "CBUAE LTV Alert: UAE Central Bank requires a minimum 20% down payment for expat buyers (15% for UAE nationals).";
      }
      break;

    case "PK":
      transferOrStampTax = safeHomePrice * 0.03;
      transferTaxLabel = "Cantt / Municipal Stamp & CVT (3%)";
      closingOrAgencyFees = safeHomePrice * 0.015;
      closingFeeLabel = "Society Registration & Transfer (1.5%)";
      if (downPaymentPct < 15) {
        ltvWarning =
          "SBP Prudential Alert: Most Pakistani banks require 15%–25% minimum customer equity participation.";
      }
      break;

    case "CA":
      transferOrStampTax = safeHomePrice * 0.018;
      transferTaxLabel = "Provincial Land Transfer Tax (~1.8%)";
      closingOrAgencyFees = 2200;
      closingFeeLabel = "Notary, Title & Appraisal";
      if (downPaymentPct < 20) {
        ltvWarning = `CMHC High-Ratio Mortgage: ${cmhcPremiumRatePct.toFixed(
          1
        )}% CMHC Default Insurance premium is capitalized into your financed mortgage balance.`;
      }
      break;

    case "EU":
      transferOrStampTax = safeHomePrice * 0.04;
      transferTaxLabel = "Property Transfer Tax (4.0%)";
      closingOrAgencyFees = safeHomePrice * 0.015;
      closingFeeLabel = "Notary & Cadastre Fees (1.5%)";
      break;

    case "AU":
      transferOrStampTax = safeHomePrice * 0.038;
      transferTaxLabel = "State Stamp Duty (~3.8%)";
      closingOrAgencyFees = 2100;
      closingFeeLabel = "Conveyancing & PEXA Settlement";
      if (downPaymentPct < 20) {
        ltvWarning =
          "Lenders Mortgage Insurance (LMI) applies when deposit is below 20% (LVR > 80%).";
      }
      break;

    case "SA":
      transferOrStampTax =
        safeHomePrice > 1000000 ? (safeHomePrice - 1000000) * 0.05 : 0;
      transferTaxLabel = "5% ZATCA RETT (Over SAR 1M Exemption)";
      closingOrAgencyFees = safeHomePrice * 0.01;
      closingFeeLabel = "SAMA Admin & Evaluation (1%)";
      break;

    case "IN":
      transferOrStampTax = safeHomePrice * 0.05;
      transferTaxLabel = "State Stamp Duty (~5.0%)";
      closingOrAgencyFees = safeHomePrice * 0.01 + 10000;
      closingFeeLabel = "Registration Fee (1%) + Legal";
      if (downPaymentPct < 20) {
        ltvWarning =
          "RBI LTV Alert: For home loans above ₹ 75 L, RBI norms cap bank LTV at 75%–80% (minimum 20% margin).";
      }
      break;

    case "SG":
      transferOrStampTax = calculateSingaporeBSD(safeHomePrice);
      transferTaxLabel = "IRAS Tiered Buyer's Stamp Duty (BSD)";
      closingOrAgencyFees = 3000;
      closingFeeLabel = "Conveyancing & Valuation Fee";
      if (downPaymentPct < 25) {
        ltvWarning =
          "MAS Regulatory Cap: Bank loans require a minimum 25% down payment by law.";
      }
      break;

    case "HK":
      transferOrStampTax = calculateHongKongAVD(safeHomePrice);
      transferTaxLabel = "Ad Valorem Stamp Duty (AVD Scale 2)";
      closingOrAgencyFees = safeHomePrice * 0.01 + 8500;
      closingFeeLabel = "1% Agency + Solicitor Conveyancing";
      if (downPaymentPct < 30) {
        ltvWarning =
          "HKMA / HKMC Notice: LTV above 70% requires HKMC Mortgage Insurance Programme (MIP) eligibility.";
      }
      break;
  }

  const totalCashToClose =
    safeDownPayment + transferOrStampTax + closingOrAgencyFees;

  return {
    closingCosts: {
      downPaymentAmount: safeDownPayment,
      transferOrStampTax,
      transferTaxLabel,
      closingOrAgencyFees,
      closingFeeLabel,
      totalCashToClose,
      ltvPct,
      ltvWarning,
    },
    monthlyPmi,
    isPmiApplicable,
    pmiLabel,
    pmiSublabel,
    cmhcPremiumRatePct,
    cmhcPremiumAmount,
  };
}

/**
 * 5. Early Payoff & Extra Payment Amortization Engine:
 * Iterative month-by-month calculation applying extra monthly payments directly to principal
 * (or extra equity buyout in Islamic Diminishing Musharakah).
 */
export function buildAmortizationSchedule(params: {
  homePrice: number;
  loanAmount: number;
  annualRatePct: number;
  loanYears: number;
  extraMonthlyPayment: number;
  countryCode: CountryCode;
  financingMode: FinancingMode;
  islamicInstallmentType?: IslamicInstallmentType;
}): {
  schedule: AmortizationRow[];
  annualSchedule: AnnualAmortizationRow[];
  totalInterestPaid: number;
  actualMonths: number;
} {
  const {
    homePrice,
    loanAmount,
    annualRatePct,
    loanYears,
    extraMonthlyPayment,
    countryCode,
    financingMode,
    islamicInstallmentType = "equal",
  } = params;

  const totalMonths = Math.max(1, Math.round(loanYears * 12));
  if (loanAmount <= 0) {
    return {
      schedule: [],
      annualSchedule: [],
      totalInterestPaid: 0,
      actualMonths: 0,
    };
  }

  const monthlyRate = getEffectiveMonthlyRate(annualRatePct, countryCode);
  const baseEqualInstallment = calculateConventionalMonthlyPI(
    loanAmount,
    annualRatePct,
    loanYears,
    countryCode
  );
  const baseDecliningMusharakahBuyout = loanAmount / totalMonths;

  let remainingBalance = loanAmount;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  const schedule: AmortizationRow[] = [];

  for (let m = 1; m <= totalMonths && remainingBalance > 0.01; m++) {
    const year = Math.ceil(m / 12);
    const monthInYear = ((m - 1) % 12) + 1;

    const interestOrRent = remainingBalance * monthlyRate;
    let scheduledPrincipal = 0;

    if (
      financingMode === "islamic" &&
      islamicInstallmentType === "declining"
    ) {
      // Classical Diminishing Musharakah: equal principal unit buyout + declining rent
      scheduledPrincipal = Math.min(
        remainingBalance,
        baseDecliningMusharakahBuyout
      );
    } else {
      // Equal Monthly Installments (both Conventional & Modern Equal-Installment Musharakah)
      scheduledPrincipal = Math.max(
        0,
        Math.min(remainingBalance, baseEqualInstallment - interestOrRent)
      );
    }

    const maxPossibleExtra = Math.max(
      0,
      remainingBalance - scheduledPrincipal
    );
    const actualExtra = Math.min(
      Math.max(0, extraMonthlyPayment),
      maxPossibleExtra
    );

    const totalPrincipalThisMonth = scheduledPrincipal + actualExtra;
    const totalPaymentThisMonth = totalPrincipalThisMonth + interestOrRent;

    remainingBalance = Math.max(0, remainingBalance - totalPrincipalThisMonth);
    cumulativeInterest += interestOrRent;
    cumulativePrincipal += totalPrincipalThisMonth;

    const clientOwnedAmount = Math.max(0, homePrice - remainingBalance);
    const clientEquityPct =
      homePrice > 0 ? Math.min(100, (clientOwnedAmount / homePrice) * 100) : 100;

    schedule.push({
      paymentNumber: m,
      year,
      monthInYear,
      scheduledPayment: scheduledPrincipal + interestOrRent,
      principalPaid: scheduledPrincipal,
      interestPaid: interestOrRent,
      extraPayment: actualExtra,
      totalPayment: totalPaymentThisMonth,
      cumulativeInterest,
      cumulativePrincipal,
      remainingBalance,
      clientEquityPct,
    });
  }

  const annualMap = new Map<number, AnnualAmortizationRow>();
  for (const row of schedule) {
    const existing = annualMap.get(row.year);
    if (!existing) {
      annualMap.set(row.year, {
        year: row.year,
        principalPaid: row.principalPaid,
        interestPaid: row.interestPaid,
        extraPayment: row.extraPayment,
        totalPayment: row.totalPayment,
        endingBalance: row.remainingBalance,
        clientEquityPct: row.clientEquityPct,
      });
    } else {
      existing.principalPaid += row.principalPaid;
      existing.interestPaid += row.interestPaid;
      existing.extraPayment += row.extraPayment;
      existing.totalPayment += row.totalPayment;
      existing.endingBalance = row.remainingBalance;
      existing.clientEquityPct = row.clientEquityPct;
    }
  }

  return {
    schedule,
    annualSchedule: Array.from(annualMap.values()),
    totalInterestPaid: cumulativeInterest,
    actualMonths: schedule.length,
  };
}

export function formatMonthsSaved(monthsSaved: number): string {
  if (monthsSaved <= 0) return "On Standard Schedule";
  const years = Math.floor(monthsSaved / 12);
  const months = monthsSaved % 12;
  if (years > 0 && months > 0) {
    return `${years}y ${months}m earlier`;
  }
  if (years > 0) {
    return `${years} ${years === 1 ? "yr" : "yrs"} earlier`;
  }
  return `${months} ${months === 1 ? "mo" : "mos"} earlier`;
}

export function calculateMortgageSummary(
  inputs: MortgageInputs
): MortgageCalculationResult {
  const safeHomePrice = Math.max(0, inputs.homePrice);
  const safeDownPayment =
    inputs.activeTab === "loan_emi"
      ? 0
      : Math.min(safeHomePrice, Math.max(0, inputs.downPayment));
  const baseLoanAmount = Math.max(0, safeHomePrice - safeDownPayment);
  const downPaymentPct =
    safeHomePrice > 0 ? (safeDownPayment / safeHomePrice) * 100 : 0;

  const {
    closingCosts,
    monthlyPmi,
    isPmiApplicable,
    pmiLabel,
    pmiSublabel,
    cmhcPremiumRatePct,
    cmhcPremiumAmount,
  } = calculateClosingCostsAndPMI(
    safeHomePrice,
    safeDownPayment,
    inputs.countryCode,
    inputs.pmiAutoEnabled,
    inputs.financingMode
  );

  // In Canada (CA), capitalize the CMHC premium directly into the financed mortgage balance
  const loanAmount = baseLoanAmount + cmhcPremiumAmount;

  // Compute monthly P&I impact of capitalized CMHC insurance in Canada
  const uncapitalizedPI = calculateConventionalMonthlyPI(
    baseLoanAmount,
    inputs.interestRate,
    inputs.loanYears,
    inputs.countryCode
  );
  const capitalizedPI = calculateConventionalMonthlyPI(
    loanAmount,
    inputs.interestRate,
    inputs.loanYears,
    inputs.countryCode
  );
  const cmhcMonthlyImpact = Math.max(0, capitalizedPI - uncapitalizedPI);

  const islamicType = inputs.islamicInstallmentType ?? "equal";

  const baseline = buildAmortizationSchedule({
    homePrice: safeHomePrice,
    loanAmount,
    annualRatePct: inputs.interestRate,
    loanYears: inputs.loanYears,
    extraMonthlyPayment: 0,
    countryCode: inputs.countryCode,
    financingMode: inputs.financingMode,
    islamicInstallmentType: islamicType,
  });

  const accelerated = buildAmortizationSchedule({
    homePrice: safeHomePrice,
    loanAmount,
    annualRatePct: inputs.interestRate,
    loanYears: inputs.loanYears,
    extraMonthlyPayment: inputs.extraMonthlyPayment,
    countryCode: inputs.countryCode,
    financingMode: inputs.financingMode,
    islamicInstallmentType: islamicType,
  });

  const firstRow = baseline.schedule[0];
  const monthlyPrincipalAndInterest = firstRow ? firstRow.scheduledPayment : 0;
  const monthlyFirstPeriodRentOrInterest = firstRow ? firstRow.interestPaid : 0;
  const monthlyFirstPeriodPrincipal = firstRow ? firstRow.principalPaid : 0;

  const monthlyInsurance = Math.max(0, inputs.insuranceMonthly);
  const monthlyPropertyTax = Math.max(0, inputs.propertyTaxMonthly);
  const monthlyHoa = Math.max(0, inputs.hoaMonthly);

  const totalMonthlyPayment =
    monthlyPrincipalAndInterest +
    monthlyInsurance +
    monthlyPropertyTax +
    monthlyHoa +
    monthlyPmi;

  const interestSaved = Math.max(
    0,
    baseline.totalInterestPaid - accelerated.totalInterestPaid
  );
  const monthsSaved = Math.max(
    0,
    baseline.actualMonths - accelerated.actualMonths
  );
  const timeSavedFormatted = formatMonthsSaved(monthsSaved);

  const startYear = 2026;
  const startMonthIndex = 9; // October
  const totalPayoffMonthIndex = startMonthIndex + accelerated.actualMonths;
  const payoffYear = startYear + Math.floor(totalPayoffMonthIndex / 12);
  const payoffMonth = totalPayoffMonthIndex % 12;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const payoffDateFormatted =
    accelerated.actualMonths > 0
      ? `${monthNames[payoffMonth]} ${payoffYear}`
      : "Paid Off";

  const grossIncome = Math.max(1, inputs.grossMonthlyIncome);
  const frontEndDtiPct = (totalMonthlyPayment / grossIncome) * 100;
  let dtiComfortLevel: DtiComfortLevel = "comfortable";
  if (frontEndDtiPct > 36) {
    dtiComfortLevel = "risk";
  } else if (frontEndDtiPct >= 28) {
    dtiComfortLevel = "moderate";
  }

  const oldMonthlyPI = calculateConventionalMonthlyPI(
    inputs.currentLoanBalance,
    inputs.currentInterestRate,
    inputs.currentRemainingYears,
    inputs.countryCode
  );
  const newRefiPI = calculateConventionalMonthlyPI(
    inputs.currentLoanBalance,
    inputs.interestRate,
    inputs.loanYears,
    inputs.countryCode
  );
  const refinanceMonthlySavings = oldMonthlyPI - newRefiPI;
  const refinanceBreakEvenMonths =
    refinanceMonthlySavings > 0
      ? Math.ceil(inputs.refinanceClosingCosts / refinanceMonthlySavings)
      : 0;
  const oldTotalRemaining =
    oldMonthlyPI * Math.round(inputs.currentRemainingYears * 12);
  const newTotalRemaining =
    newRefiPI * Math.round(inputs.loanYears * 12) +
    inputs.refinanceClosingCosts;
  const refinanceLifetimeSavings = oldTotalRemaining - newTotalRemaining;

  const maxAllowedMonthlyPayment = Math.max(
    0,
    grossIncome * (inputs.targetDtiPct / 100) - inputs.monthlyDebts
  );
  const nonLoanMonthlyCosts =
    monthlyInsurance + monthlyPropertyTax + monthlyHoa;
  const availableForPI = Math.max(
    0,
    maxAllowedMonthlyPayment - nonLoanMonthlyCosts
  );
  const r = getEffectiveMonthlyRate(inputs.interestRate, inputs.countryCode);
  const n = Math.max(1, Math.round(inputs.loanYears * 12));
  let maxAffordableLoanAmount = 0;
  if (r > 0) {
    const factor = Math.pow(1 + r, n);
    maxAffordableLoanAmount = (availableForPI * (factor - 1)) / (r * factor);
  } else {
    maxAffordableLoanAmount = availableForPI * n;
  }
  const maxAffordableHomePrice = maxAffordableLoanAmount + safeDownPayment;

  return {
    baseLoanAmount,
    loanAmount,
    cmhcPremiumAmount,
    cmhcPremiumRatePct,
    cmhcMonthlyImpact,
    downPaymentAmount: safeDownPayment,
    downPaymentPct,
    monthlyPrincipalAndInterest,
    monthlyFirstPeriodRentOrInterest,
    monthlyFirstPeriodPrincipal,
    monthlyInsurance,
    monthlyPropertyTax,
    monthlyHoa,
    monthlyPmi,
    isPmiApplicable,
    pmiLabel,
    pmiSublabel,
    totalMonthlyPayment,
    baselineTotalInterest: baseline.totalInterestPaid,
    acceleratedTotalInterest: accelerated.totalInterestPaid,
    interestSaved,
    baselineTermMonths: baseline.actualMonths,
    acceleratedTermMonths: accelerated.actualMonths,
    monthsSaved,
    timeSavedFormatted,
    payoffDateFormatted,
    frontEndDtiPct,
    dtiComfortLevel,
    closingCosts,
    schedule: accelerated.schedule,
    annualSchedule: accelerated.annualSchedule,
    oldMonthlyPI,
    refinanceMonthlySavings,
    refinanceBreakEvenMonths,
    refinanceLifetimeSavings,
    maxAffordableHomePrice,
    maxAffordableLoanAmount,
    maxAllowedMonthlyPayment,
  };
}
