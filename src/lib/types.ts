export type CountryCode =
  | "US"
  | "PK"
  | "GB"
  | "AE"
  | "CA"
  | "EU"
  | "AU"
  | "SA"
  | "IN"
  | "SG"
  | "HK";

export type FinancingMode = "conventional" | "islamic";

export type IslamicInstallmentType = "equal" | "declining";

export type CalculatorTab =
  | "mortgage"
  | "loan_emi"
  | "affordability"
  | "refinance"
  | "rates_fx";

export type MobileStep = "parameters" | "payment";

export interface LocalBankOffer {
  bankName: string;
  productName: string;
  conventionalRate: number;
  islamicRate: number;
  aprOrRepresentative: number;
  maxLtvPct: number;
  processingFeeText: string;
}

export interface CountryProfile {
  code: CountryCode;
  name: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  locale: string;
  useIndianNumberFormat?: boolean;
  mortgageTitle: string;
  centralBankName: string;
  centralBankCode: string;
  centralBankRate: number;
  lastUpdated: string;
  compounding: "monthly" | "semi-annual";
  supportsIslamic: boolean;
  labels: {
    propertyTax: string;
    insurance: string;
    islamicInsurance: string;
    hoa: string;
    stampOrTransferTax: string;
  };
  defaults: {
    homePrice: number;
    minHomePrice: number;
    maxHomePrice: number;
    stepHomePrice: number;
    downPaymentPct: number;
    interestRate: number;
    loanYears: number;
    propertyTaxMonthly: number;
    insuranceMonthly: number;
    hoaMonthly: number;
    extraMonthlyPayment: number;
    maxExtraMonthly: number;
    stepExtraMonthly: number;
    grossMonthlyIncome: number;
  };
  fxPerUsd: number; // 1 USD = X local currency
  bankOffers: LocalBankOffer[];
  regulatoryDisclaimer: string;
}

export interface MortgageInputs {
  countryCode: CountryCode;
  financingMode: FinancingMode;
  islamicInstallmentType: IslamicInstallmentType;
  activeTab: CalculatorTab;
  homePrice: number;
  downPayment: number;
  downPaymentPct: number;
  interestRate: number; // Annual % (or Annual Rental Rate % in Musharakah)
  loanYears: number;
  extraMonthlyPayment: number;
  propertyTaxMonthly: number;
  insuranceMonthly: number;
  hoaMonthly: number;
  pmiAutoEnabled: boolean;
  grossMonthlyIncome: number;
  // Refinance specific inputs
  currentLoanBalance: number;
  currentInterestRate: number;
  currentRemainingYears: number;
  refinanceClosingCosts: number;
  // Affordability specific inputs
  monthlyDebts: number;
  targetDtiPct: number;
}

export interface AmortizationRow {
  paymentNumber: number;
  year: number;
  monthInYear: number;
  scheduledPayment: number;
  principalPaid: number; // Or Equity Buyout in Musharakah
  interestPaid: number; // Or Rental Profit in Musharakah
  extraPayment: number;
  totalPayment: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
  remainingBalance: number;
  clientEquityPct: number;
}

export interface AnnualAmortizationRow {
  year: number;
  principalPaid: number;
  interestPaid: number;
  extraPayment: number;
  totalPayment: number;
  endingBalance: number;
  clientEquityPct: number;
}

export interface ClosingCostsBreakdown {
  downPaymentAmount: number;
  transferOrStampTax: number;
  transferTaxLabel: string;
  closingOrAgencyFees: number;
  closingFeeLabel: string;
  totalCashToClose: number;
  ltvPct: number;
  ltvWarning: string | null;
}

export type DtiComfortLevel = "comfortable" | "moderate" | "risk";

export interface MortgageCalculationResult {
  baseLoanAmount: number;
  loanAmount: number; // Includes capitalized CMHC insurance in Canada if applicable
  cmhcPremiumAmount: number;
  cmhcPremiumRatePct: number;
  cmhcMonthlyImpact: number;
  downPaymentAmount: number;
  downPaymentPct: number;
  monthlyPrincipalAndInterest: number;
  monthlyFirstPeriodRentOrInterest: number;
  monthlyFirstPeriodPrincipal: number;
  monthlyInsurance: number;
  monthlyPropertyTax: number;
  monthlyHoa: number;
  monthlyPmi: number;
  isPmiApplicable: boolean;
  pmiLabel: string;
  pmiSublabel: string;
  totalMonthlyPayment: number;
  baselineTotalInterest: number;
  acceleratedTotalInterest: number;
  interestSaved: number;
  baselineTermMonths: number;
  acceleratedTermMonths: number;
  monthsSaved: number;
  timeSavedFormatted: string;
  payoffDateFormatted: string;
  frontEndDtiPct: number;
  dtiComfortLevel: DtiComfortLevel;
  closingCosts: ClosingCostsBreakdown;
  schedule: AmortizationRow[];
  annualSchedule: AnnualAmortizationRow[];
  // Refinance metrics
  oldMonthlyPI: number;
  refinanceMonthlySavings: number;
  refinanceBreakEvenMonths: number;
  refinanceLifetimeSavings: number;
  // Affordability metrics
  maxAffordableHomePrice: number;
  maxAffordableLoanAmount: number;
  maxAllowedMonthlyPayment: number;
}

export interface PinnedScenario {
  countryCode: CountryCode;
  currencySymbol: string;
  financingMode: FinancingMode;
  homePrice: number;
  loanAmount: number;
  interestRate: number;
  loanYears: number;
  totalMonthlyPayment: number;
  acceleratedTotalInterest: number;
  acceleratedTermMonths: number;
  pinnedAt: string;
}

export type CreditScoreTier = "excellent" | "good" | "fair" | "rebuilding";

export type PurchaseTimeline =
  | "ready"
  | "30-60_days"
  | "3-6_months"
  | "refinance";

export interface LeadSubmissionPayload {
  countryCode: CountryCode;
  currency: string;
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  interestRate: number;
  creditScoreTier: CreditScoreTier;
  purchaseTimeline: PurchaseTimeline;
  propertyZipOrCity: string;
  annualIncome: number;
  fullName: string;
  email: string;
  phone: string;
  consentGranted: boolean;
  submittedAt: string;
}

