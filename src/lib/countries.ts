import { CountryCode, CountryProfile } from "./types";

export const COUNTRIES: Record<CountryCode, CountryProfile> = {
  US: {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    currencyCode: "USD",
    currencySymbol: "$",
    locale: "en-US",
    useIndianNumberFormat: false,
    mortgageTitle: "Calculate Mortgage",
    centralBankName: "Federal Reserve (Fed Funds)",
    centralBankCode: "FED",
    centralBankRate: 4.5,
    lastUpdated: "Oct 2026",
    compounding: "monthly",
    supportsIslamic: true,
    labels: {
      propertyTax: "Property Tax",
      insurance: "Homeowner's Insurance",
      islamicInsurance: "Property Takaful",
      hoa: "HOA Fees",
      stampOrTransferTax: "Est. Closing & Title Fees (2.5%)",
    },
    defaults: {
      homePrice: 425000,
      minHomePrice: 50000,
      maxHomePrice: 3000000,
      stepHomePrice: 5000,
      downPaymentPct: 20,
      interestRate: 6.25,
      loanYears: 30,
      propertyTaxMonthly: 350,
      insuranceMonthly: 140,
      hoaMonthly: 85,
      extraMonthlyPayment: 150,
      maxExtraMonthly: 3000,
      stepExtraMonthly: 25,
      grossMonthlyIncome: 10500,
    },
    fxPerUsd: 1.0,
    bankOffers: [
      {
        bankName: "JPMorgan Chase",
        productName: "30-Yr Fixed Conventional",
        conventionalRate: 6.15,
        islamicRate: 6.45,
        aprOrRepresentative: 6.28,
        maxLtvPct: 97,
        processingFeeText: "$1,295 Origination",
      },
      {
        bankName: "Bank of America",
        productName: "Preferred Fixed Mortgage",
        conventionalRate: 6.25,
        islamicRate: 6.55,
        aprOrRepresentative: 6.36,
        maxLtvPct: 95,
        processingFeeText: "$1,150 Origination",
      },
      {
        bankName: "Guidance Residential",
        productName: "Declining Balance Musharakah",
        conventionalRate: 6.35,
        islamicRate: 6.25,
        aprOrRepresentative: 6.42,
        maxLtvPct: 95,
        processingFeeText: "$1,450 Sharia Admin",
      },
      {
        bankName: "Wells Fargo",
        productName: "15-Yr Accelerated Fixed",
        conventionalRate: 5.55,
        islamicRate: 5.85,
        aprOrRepresentative: 5.71,
        maxLtvPct: 90,
        processingFeeText: "$1,200 Origination",
      },
    ],
    regulatoryDisclaimer:
      "Estimates comply with TILA/RESPA Truth-in-Lending disclosure standards. Private Mortgage Insurance (PMI) is automatically estimated at 0.55% annually when Loan-to-Value (LTV) exceeds 80%.",
  },
  PK: {
    code: "PK",
    name: "Pakistan",
    flag: "🇵🇰",
    currencyCode: "PKR",
    currencySymbol: "₨ ",
    locale: "en-PK",
    useIndianNumberFormat: true,
    mortgageTitle: "Calculate Mortgage",
    centralBankName: "State Bank of Pakistan (KIBOR)",
    centralBankCode: "SBP",
    centralBankRate: 13.5,
    lastUpdated: "Oct 2026",
    compounding: "monthly",
    supportsIslamic: true,
    labels: {
      propertyTax: "Cantt / Municipal Tax",
      insurance: "Property Insurance",
      islamicInsurance: "Home Takaful Contribution",
      hoa: "Society Maintenance (DHA/Bahria)",
      stampOrTransferTax: "Stamp Duty, CVT & Society Transfer",
    },
    defaults: {
      homePrice: 35000000,
      minHomePrice: 5000000,
      maxHomePrice: 250000000,
      stepHomePrice: 500000,
      downPaymentPct: 25,
      interestRate: 14.75,
      loanYears: 20,
      propertyTaxMonthly: 8500,
      insuranceMonthly: 12000,
      hoaMonthly: 15000,
      extraMonthlyPayment: 25000,
      maxExtraMonthly: 500000,
      stepExtraMonthly: 5000,
      grossMonthlyIncome: 950000,
    },
    fxPerUsd: 278.5,
    bankOffers: [
      {
        bankName: "Meezan Bank",
        productName: "Easy Home Diminishing Musharakah",
        conventionalRate: 15.25,
        islamicRate: 14.5,
        aprOrRepresentative: 14.85,
        maxLtvPct: 75,
        processingFeeText: "₨ 12,000 + FED",
      },
      {
        bankName: "Habib Bank Limited (HBL)",
        productName: "HBL HomeLoan / Islamic Home",
        conventionalRate: 14.75,
        islamicRate: 14.85,
        aprOrRepresentative: 15.1,
        maxLtvPct: 75,
        processingFeeText: "0.25% Legal & Val.",
      },
      {
        bankName: "Bank Alfalah Islamic",
        productName: "Ghar Asaan Musharakah",
        conventionalRate: 15.0,
        islamicRate: 14.65,
        aprOrRepresentative: 14.95,
        maxLtvPct: 80,
        processingFeeText: "₨ 15,000 Flat Fee",
      },
      {
        bankName: "United Bank Limited (UBL)",
        productName: "UBL Address / Ameen Ghar",
        conventionalRate: 14.9,
        islamicRate: 14.75,
        aprOrRepresentative: 15.15,
        maxLtvPct: 75,
        processingFeeText: "₨ 10,500 Processing",
      },
    ],
    regulatoryDisclaimer:
      "Benchmarked to 1-Year KIBOR + Bank Spread under State Bank of Pakistan (SBP) Housing Finance Prudential Regulations. Closing costs include 3% Stamp Duty/CVT + 1.5% DHA/Society Transfer & FBR Sec 236K/C.",
  },
  GB: {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    currencyCode: "GBP",
    currencySymbol: "£",
    locale: "en-GB",
    useIndianNumberFormat: false,
    mortgageTitle: "Calculate Mortgage",
    centralBankName: "Bank of England (Base Rate)",
    centralBankCode: "BoE",
    centralBankRate: 4.25,
    lastUpdated: "Oct 2026",
    compounding: "monthly",
    supportsIslamic: true,
    labels: {
      propertyTax: "Council Tax",
      insurance: "Buildings Insurance",
      islamicInsurance: "Home Takaful Plan",
      hoa: "Service Charge / Ground Rent",
      stampOrTransferTax: "Progressive Stamp Duty (SDLT)",
    },
    defaults: {
      homePrice: 375000,
      minHomePrice: 60000,
      maxHomePrice: 2500000,
      stepHomePrice: 5000,
      downPaymentPct: 20,
      interestRate: 4.65,
      loanYears: 25,
      propertyTaxMonthly: 185,
      insuranceMonthly: 55,
      hoaMonthly: 110,
      extraMonthlyPayment: 120,
      maxExtraMonthly: 2500,
      stepExtraMonthly: 20,
      grossMonthlyIncome: 7500,
    },
    fxPerUsd: 0.78,
    bankOffers: [
      {
        bankName: "HSBC UK",
        productName: "5-Yr Fixed Residential",
        conventionalRate: 4.49,
        islamicRate: 4.89,
        aprOrRepresentative: 4.9,
        maxLtvPct: 90,
        processingFeeText: "£999 Arrangement Fee",
      },
      {
        bankName: "Nationwide Building Society",
        productName: "Helping Hand Fixed",
        conventionalRate: 4.64,
        islamicRate: 5.05,
        aprOrRepresentative: 5.0,
        maxLtvPct: 95,
        processingFeeText: "£999 Product Fee",
      },
      {
        bankName: "Gatehouse Bank (Sharia)",
        productName: "Diminishing Musharakah HPP",
        conventionalRate: 5.15,
        islamicRate: 4.99,
        aprOrRepresentative: 5.25,
        maxLtvPct: 85,
        processingFeeText: "£1,250 Admin Fee",
      },
      {
        bankName: "Barclays UK",
        productName: "Green Home 2-Yr Fixed",
        conventionalRate: 4.58,
        islamicRate: 4.95,
        aprOrRepresentative: 4.95,
        maxLtvPct: 90,
        processingFeeText: "£899 Booking Fee",
      },
    ],
    regulatoryDisclaimer:
      "Calculations incorporate progressive UK Stamp Duty Land Tax (SDLT) residential tiers for England & Northern Ireland. Subject to FCA MCOB affordability stress testing.",
  },
  AE: {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    currencyCode: "AED",
    currencySymbol: "د.إ ",
    locale: "en-AE",
    useIndianNumberFormat: false,
    mortgageTitle: "Calculate Mortgage",
    centralBankName: "CBUAE Base Rate (EIBOR)",
    centralBankCode: "CBUAE",
    centralBankRate: 4.4,
    lastUpdated: "Oct 2026",
    compounding: "monthly",
    supportsIslamic: true,
    labels: {
      propertyTax: "Municipality Housing Fee",
      insurance: "Property & Life Takaful",
      islamicInsurance: "Takaful Property Cover",
      hoa: "Community Service Charges",
      stampOrTransferTax: "4% DLD Fee + 2% Agency Fee",
    },
    defaults: {
      homePrice: 2200000,
      minHomePrice: 400000,
      maxHomePrice: 15000000,
      stepHomePrice: 50000,
      downPaymentPct: 20,
      interestRate: 4.29,
      loanYears: 25,
      propertyTaxMonthly: 450,
      insuranceMonthly: 320,
      hoaMonthly: 1200,
      extraMonthlyPayment: 1000,
      maxExtraMonthly: 15000,
      stepExtraMonthly: 250,
      grossMonthlyIncome: 42000,
    },
    fxPerUsd: 3.6725,
    bankOffers: [
      {
        bankName: "Emirates NBD",
        productName: "3-Yr Fixed Home Loan",
        conventionalRate: 4.19,
        islamicRate: 4.29,
        aprOrRepresentative: 4.45,
        maxLtvPct: 80,
        processingFeeText: "1.05% Processing",
      },
      {
        bankName: "Dubai Islamic Bank (DIB)",
        productName: "Al Islami Musharakah Home",
        conventionalRate: 4.35,
        islamicRate: 4.15,
        aprOrRepresentative: 4.38,
        maxLtvPct: 80,
        processingFeeText: "0.525% Processing",
      },
      {
        bankName: "First Abu Dhabi Bank (FAB)",
        productName: "Elite Expat Mortgage",
        conventionalRate: 4.24,
        islamicRate: 4.34,
        aprOrRepresentative: 4.5,
        maxLtvPct: 80,
        processingFeeText: "1.0% + VAT",
      },
      {
        bankName: "Abu Dhabi Islamic Bank",
        productName: "ADIB Home Finance",
        conventionalRate: 4.45,
        islamicRate: 4.25,
        aprOrRepresentative: 4.49,
        maxLtvPct: 85,
        processingFeeText: "AED 2,625 Valuation",
      },
    ],
    regulatoryDisclaimer:
      "Compliant with Central Bank of the UAE (CBUAE) Mortgage Regulations. Includes 4% Dubai Land Department (DLD) transfer fee + 2% brokerage fee. Minimum 20% down payment required for expat buyers under AED 5M.",
  },
  CA: {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    currencyCode: "CAD",
    currencySymbol: "CA$",
    locale: "en-CA",
    useIndianNumberFormat: false,
    mortgageTitle: "Calculate Mortgage",
    centralBankName: "Bank of Canada (Overnight)",
    centralBankCode: "BoC",
    centralBankRate: 3.5,
    lastUpdated: "Oct 2026",
    compounding: "semi-annual",
    supportsIslamic: true,
    labels: {
      propertyTax: "Municipal Property Tax",
      insurance: "Homeowner Insurance",
      islamicInsurance: "Cooperative Takaful",
      hoa: "Condo / Strata Fees",
      stampOrTransferTax: "Land Transfer Tax & Legal",
    },
    defaults: {
      homePrice: 680000,
      minHomePrice: 100000,
      maxHomePrice: 4000000,
      stepHomePrice: 10000,
      downPaymentPct: 20,
      interestRate: 4.79,
      loanYears: 25,
      propertyTaxMonthly: 420,
      insuranceMonthly: 135,
      hoaMonthly: 240,
      extraMonthlyPayment: 200,
      maxExtraMonthly: 3500,
      stepExtraMonthly: 50,
      grossMonthlyIncome: 12800,
    },
    fxPerUsd: 1.38,
    bankOffers: [
      {
        bankName: "RBC Royal Bank",
        productName: "5-Year Fixed Closed",
        conventionalRate: 4.69,
        islamicRate: 5.15,
        aprOrRepresentative: 4.74,
        maxLtvPct: 80,
        processingFeeText: "CA$400 Appraisal",
      },
      {
        bankName: "TD Canada Trust",
        productName: "3-Year Special Fixed",
        conventionalRate: 4.79,
        islamicRate: 5.25,
        aprOrRepresentative: 4.84,
        maxLtvPct: 95,
        processingFeeText: "No Origination Fee",
      },
      {
        bankName: "Manzil Halal Finance",
        productName: "Musharakah Halal Mortgage",
        conventionalRate: 5.29,
        islamicRate: 5.19,
        aprOrRepresentative: 5.35,
        maxLtvPct: 80,
        processingFeeText: "1.0% Setup Fee",
      },
      {
        bankName: "Scotiabank",
        productName: "STEP Total Equity Plan",
        conventionalRate: 4.84,
        islamicRate: 5.3,
        aprOrRepresentative: 4.89,
        maxLtvPct: 80,
        processingFeeText: "CA$350 Admin",
      },
    ],
    regulatoryDisclaimer:
      "Strictly adheres to Section 6 of the Canadian Interest Act: fixed-rate mortgages are compounded semi-annually, not in advance: r_m = (1 + R/2)^(1/6) - 1.",
  },
  EU: {
    code: "EU",
    name: "Eurozone",
    flag: "🇪🇺",
    currencyCode: "EUR",
    currencySymbol: "€",
    locale: "de-DE",
    useIndianNumberFormat: false,
    mortgageTitle: "Calculate Mortgage",
    centralBankName: "European Central Bank (ECB)",
    centralBankCode: "ECB",
    centralBankRate: 2.75,
    lastUpdated: "Oct 2026",
    compounding: "monthly",
    supportsIslamic: true,
    labels: {
      propertyTax: "Grundsteuer / Property Tax",
      insurance: "Building Hazard Insurance",
      islamicInsurance: "European Takaful Cover",
      hoa: "Hausgeld / Co-Ownership Fee",
      stampOrTransferTax: "Notary & Transfer Tax (5.5%)",
    },
    defaults: {
      homePrice: 410000,
      minHomePrice: 75000,
      maxHomePrice: 2500000,
      stepHomePrice: 5000,
      downPaymentPct: 20,
      interestRate: 3.45,
      loanYears: 25,
      propertyTaxMonthly: 160,
      insuranceMonthly: 75,
      hoaMonthly: 190,
      extraMonthlyPayment: 150,
      maxExtraMonthly: 2500,
      stepExtraMonthly: 25,
      grossMonthlyIncome: 8200,
    },
    fxPerUsd: 0.92,
    bankOffers: [
      {
        bankName: "Deutsche Bank",
        productName: "10-Yr Baufinanzierung Fixed",
        conventionalRate: 3.35,
        islamicRate: 3.85,
        aprOrRepresentative: 3.48,
        maxLtvPct: 85,
        processingFeeText: "Included in APR",
      },
      {
        bankName: "BNP Paribas",
        productName: "Prêt Immobilier Classique",
        conventionalRate: 3.45,
        islamicRate: 3.9,
        aprOrRepresentative: 3.62,
        maxLtvPct: 90,
        processingFeeText: "€1,000 Dossier Fee",
      },
      {
        bankName: "ING Eurozone",
        productName: "Eco-Renovation Mortgage",
        conventionalRate: 3.29,
        islamicRate: 3.79,
        aprOrRepresentative: 3.41,
        maxLtvPct: 85,
        processingFeeText: "€0 Valuation Fee",
      },
    ],
    regulatoryDisclaimer:
      "Calculated in accordance with the EU Mortgage Credit Directive (2014/17/EU) ESIS standardized methodology.",
  },
  AU: {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    currencyCode: "AUD",
    currencySymbol: "A$",
    locale: "en-AU",
    useIndianNumberFormat: false,
    mortgageTitle: "Calculate Mortgage",
    centralBankName: "Reserve Bank of Australia (RBA)",
    centralBankCode: "RBA",
    centralBankRate: 3.85,
    lastUpdated: "Oct 2026",
    compounding: "monthly",
    supportsIslamic: true,
    labels: {
      propertyTax: "Council & Water Rates",
      insurance: "Home Building Insurance",
      islamicInsurance: "Sharia Home Takaful",
      hoa: "Strata / Body Corporate Levy",
      stampOrTransferTax: "State Stamp Duty & Transfer",
    },
    defaults: {
      homePrice: 850000,
      minHomePrice: 150000,
      maxHomePrice: 5000000,
      stepHomePrice: 10000,
      downPaymentPct: 20,
      interestRate: 5.89,
      loanYears: 30,
      propertyTaxMonthly: 260,
      insuranceMonthly: 150,
      hoaMonthly: 310,
      extraMonthlyPayment: 250,
      maxExtraMonthly: 4000,
      stepExtraMonthly: 50,
      grossMonthlyIncome: 15500,
    },
    fxPerUsd: 1.51,
    bankOffers: [
      {
        bankName: "Commonwealth Bank (CBA)",
        productName: "Wealth Package Variable",
        conventionalRate: 5.79,
        islamicRate: 6.19,
        aprOrRepresentative: 5.95,
        maxLtvPct: 90,
        processingFeeText: "A$395 Annual Pkg",
      },
      {
        bankName: "Westpac",
        productName: "Flexi First Option Home Loan",
        conventionalRate: 5.84,
        islamicRate: 6.24,
        aprOrRepresentative: 5.88,
        maxLtvPct: 85,
        processingFeeText: "A$0 Establishment",
      },
      {
        bankName: "Hejaz Financial Services",
        productName: "Halal Golden Home Finance",
        conventionalRate: 6.25,
        islamicRate: 6.09,
        aprOrRepresentative: 6.29,
        maxLtvPct: 80,
        processingFeeText: "A$895 Settlement",
      },
    ],
    regulatoryDisclaimer:
      "Complies with ASIC National Consumer Credit Protection Act guidelines and APRA serviceability buffer rules.",
  },
  SA: {
    code: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    currencyCode: "SAR",
    currencySymbol: "﷼ ",
    locale: "en-SA",
    useIndianNumberFormat: false,
    mortgageTitle: "Calculate Mortgage",
    centralBankName: "Saudi Central Bank (SAMA / SAIBOR)",
    centralBankCode: "SAMA",
    centralBankRate: 4.75,
    lastUpdated: "Oct 2026",
    compounding: "monthly",
    supportsIslamic: true,
    labels: {
      propertyTax: "White Land / Municipal Levy",
      insurance: "Cooperative Home Takaful",
      islamicInsurance: "SAMA Cooperative Takaful",
      hoa: "Compound / Mullak Association",
      stampOrTransferTax: "5% Real Estate Transaction Tax (RETT)",
    },
    defaults: {
      homePrice: 1850000,
      minHomePrice: 350000,
      maxHomePrice: 12000000,
      stepHomePrice: 25000,
      downPaymentPct: 20,
      interestRate: 4.55,
      loanYears: 25,
      propertyTaxMonthly: 0,
      insuranceMonthly: 280,
      hoaMonthly: 650,
      extraMonthlyPayment: 750,
      maxExtraMonthly: 10000,
      stepExtraMonthly: 250,
      grossMonthlyIncome: 34000,
    },
    fxPerUsd: 3.75,
    bankOffers: [
      {
        bankName: "Al Rajhi Bank",
        productName: "Musharakah Villa Finance",
        conventionalRate: 4.55,
        islamicRate: 4.39,
        aprOrRepresentative: 4.62,
        maxLtvPct: 90,
        processingFeeText: "1% Admin (Cap ﷼ 5,000)",
      },
      {
        bankName: "Saudi National Bank (SNB)",
        productName: "AlAhli Sakani Residential",
        conventionalRate: 4.6,
        islamicRate: 4.49,
        aprOrRepresentative: 4.71,
        maxLtvPct: 90,
        processingFeeText: "0% Sakani Supported",
      },
      {
        bankName: "Riyad Bank",
        productName: "Sharia Co-Ownership Home",
        conventionalRate: 4.65,
        islamicRate: 4.55,
        aprOrRepresentative: 4.78,
        maxLtvPct: 85,
        processingFeeText: "﷼ 2,500 Valuation",
      },
    ],
    regulatoryDisclaimer:
      "Regulated by the Saudi Central Bank (SAMA) Responsible Lending Principles. Includes 5% ZATCA Real Estate Transaction Tax (RETT) where first-home citizen exemption (up to SAR 1M) is exceeded.",
  },
  IN: {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    currencyCode: "INR",
    currencySymbol: "₹ ",
    locale: "en-IN",
    useIndianNumberFormat: true,
    mortgageTitle: "Home Loan EMI",
    centralBankName: "Reserve Bank of India (Repo Rate)",
    centralBankCode: "RBI",
    centralBankRate: 6.25,
    lastUpdated: "Oct 2026",
    compounding: "monthly",
    supportsIslamic: true,
    labels: {
      propertyTax: "Municipal Property Tax",
      insurance: "Home Structure Insurance",
      islamicInsurance: "Property Takaful Cover",
      hoa: "Society Maintenance Charges",
      stampOrTransferTax: "State Stamp Duty & Registration (~6%)",
    },
    defaults: {
      homePrice: 7500000,
      minHomePrice: 1000000,
      maxHomePrice: 150000000,
      stepHomePrice: 100000,
      downPaymentPct: 20,
      interestRate: 8.5,
      loanYears: 20,
      propertyTaxMonthly: 2500,
      insuranceMonthly: 1800,
      hoaMonthly: 4500,
      extraMonthlyPayment: 10000,
      maxExtraMonthly: 200000,
      stepExtraMonthly: 2500,
      grossMonthlyIncome: 225000,
    },
    fxPerUsd: 84.1,
    bankOffers: [
      {
        bankName: "State Bank of India (SBI)",
        productName: "SBI Regular Home Loan (EBLR)",
        conventionalRate: 8.4,
        islamicRate: 8.85,
        aprOrRepresentative: 8.52,
        maxLtvPct: 80,
        processingFeeText: "0.35% (Max ₹ 10,000)",
      },
      {
        bankName: "HDFC Bank",
        productName: "TruFixed / Adjustable Home Loan",
        conventionalRate: 8.5,
        islamicRate: 8.95,
        aprOrRepresentative: 8.65,
        maxLtvPct: 80,
        processingFeeText: "₹ 3,000 + GST",
      },
      {
        bankName: "ICICI Bank",
        productName: "Repo-Linked Express Home Loan",
        conventionalRate: 8.6,
        islamicRate: 9.0,
        aprOrRepresentative: 8.72,
        maxLtvPct: 80,
        processingFeeText: "0.50% Processing",
      },
      {
        bankName: "Axis Bank",
        productName: "Shubh Aarambh Home Loan",
        conventionalRate: 8.55,
        islamicRate: 8.9,
        aprOrRepresentative: 8.68,
        maxLtvPct: 85,
        processingFeeText: "₹ 5,000 Login Fee",
      },
    ],
    regulatoryDisclaimer:
      "Benchmarked to RBI External Benchmark Lending Rate (EBLR / Repo Rate). Formatted in Indian 2-2-3 numbering system (Lakhs & Crores). Includes ~5% State Stamp Duty + 1% Registration fee.",
  },
  SG: {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    currencyCode: "SGD",
    currencySymbol: "S$",
    locale: "en-SG",
    useIndianNumberFormat: false,
    mortgageTitle: "Home Loan",
    centralBankName: "Monetary Authority of Singapore (SORA)",
    centralBankCode: "MAS",
    centralBankRate: 3.1,
    lastUpdated: "Oct 2026",
    compounding: "monthly",
    supportsIslamic: true,
    labels: {
      propertyTax: "IRAS Property Tax",
      insurance: "Home Content & Fire Insurance",
      islamicInsurance: "Home Takaful Protection",
      hoa: "MCST Maintenance Fee",
      stampOrTransferTax: "IRAS Buyer's Stamp Duty (BSD)",
    },
    defaults: {
      homePrice: 1450000,
      minHomePrice: 300000,
      maxHomePrice: 10000000,
      stepHomePrice: 25000,
      downPaymentPct: 25,
      interestRate: 3.15,
      loanYears: 25,
      propertyTaxMonthly: 320,
      insuranceMonthly: 95,
      hoaMonthly: 420,
      extraMonthlyPayment: 500,
      maxExtraMonthly: 10000,
      stepExtraMonthly: 100,
      grossMonthlyIncome: 18500,
    },
    fxPerUsd: 1.33,
    bankOffers: [
      {
        bankName: "DBS Bank Singapore",
        productName: "2-Yr Fixed / 3M SORA Package",
        conventionalRate: 3.05,
        islamicRate: 3.45,
        aprOrRepresentative: 3.18,
        maxLtvPct: 75,
        processingFeeText: "Legal Subsidy Included",
      },
      {
        bankName: "OCBC Bank",
        productName: "Eco-Care Home Loan Fixed",
        conventionalRate: 3.12,
        islamicRate: 3.5,
        aprOrRepresentative: 3.22,
        maxLtvPct: 75,
        processingFeeText: "S$2,000 Legal Rebate",
      },
      {
        bankName: "UOB Singapore",
        productName: "Private Residential SORA+0.50%",
        conventionalRate: 3.15,
        islamicRate: 3.55,
        aprOrRepresentative: 3.28,
        maxLtvPct: 75,
        processingFeeText: "Free Conversion @ Yr 2",
      },
      {
        bankName: "Maybank Islamic SG",
        productName: "Sharia Home Acquisition Finance",
        conventionalRate: 3.25,
        islamicRate: 3.2,
        aprOrRepresentative: 3.32,
        maxLtvPct: 75,
        processingFeeText: "S$1,800 ValuationSub",
      },
    ],
    regulatoryDisclaimer:
      "Complies with MAS Total Debt Servicing Ratio (TDSR ≤ 55%) and Mortgage Servicing Ratio (MSR ≤ 30% for HDB). Incorporates progressive IRAS Buyer's Stamp Duty (BSD) residential tiers (1% to 6%).",
  },
  HK: {
    code: "HK",
    name: "Hong Kong",
    flag: "🇭🇰",
    currencyCode: "HKD",
    currencySymbol: "HK$",
    locale: "en-HK",
    useIndianNumberFormat: false,
    mortgageTitle: "Mortgage Loan (按揭)",
    centralBankName: "HKMA Base Rate (HIBOR Linked)",
    centralBankCode: "HKMA",
    centralBankRate: 4.75,
    lastUpdated: "Oct 2026",
    compounding: "monthly",
    supportsIslamic: true,
    labels: {
      propertyTax: "Rates & Gov Rent (差餉及地租)",
      insurance: "Fire & Structure Insurance",
      islamicInsurance: "Property Takaful Cover",
      hoa: "Estate Management Fee",
      stampOrTransferTax: "Ad Valorem Stamp Duty (AVD)",
    },
    defaults: {
      homePrice: 8500000,
      minHomePrice: 2000000,
      maxHomePrice: 50000000,
      stepHomePrice: 100000,
      downPaymentPct: 30,
      interestRate: 3.88,
      loanYears: 30,
      propertyTaxMonthly: 1850,
      insuranceMonthly: 650,
      hoaMonthly: 2800,
      extraMonthlyPayment: 3000,
      maxExtraMonthly: 50000,
      stepExtraMonthly: 1000,
      grossMonthlyIncome: 95000,
    },
    fxPerUsd: 7.78,
    bankOffers: [
      {
        bankName: "HSBC Hong Kong",
        productName: "HIBOR + 1.3% (Cap P-1.75%)",
        conventionalRate: 3.88,
        islamicRate: 4.25,
        aprOrRepresentative: 3.98,
        maxLtvPct: 70,
        processingFeeText: "0.5% Cash Rebate",
      },
      {
        bankName: "Bank of China (Hong Kong)",
        productName: "Smart Prime Residential (按揭)",
        conventionalRate: 3.85,
        islamicRate: 4.2,
        aprOrRepresentative: 3.95,
        maxLtvPct: 70,
        processingFeeText: "$0 Handling Fee",
      },
      {
        bankName: "Hang Seng Bank",
        productName: "H-Mortgage Deposit-Linked",
        conventionalRate: 3.9,
        islamicRate: 4.28,
        aprOrRepresentative: 4.02,
        maxLtvPct: 70,
        processingFeeText: "High-Yield Offset Acct",
      },
      {
        bankName: "Standard Chartered HK",
        productName: "HKMC 90% MIP Eligible Plan",
        conventionalRate: 3.95,
        islamicRate: 4.35,
        aprOrRepresentative: 4.08,
        maxLtvPct: 90,
        processingFeeText: "HKMC MIP Supported",
      },
    ],
    regulatoryDisclaimer:
      "Aligned with Hong Kong Monetary Authority (HKMA) Prudential Supervisory Measures and HKMC Mortgage Insurance Programme (MIP). Includes Ad Valorem Stamp Duty (AVD Scale 2) tiers.",
  },
};

export const COUNTRY_LIST: CountryProfile[] = [
  COUNTRIES.US,
  COUNTRIES.PK,
  COUNTRIES.GB,
  COUNTRIES.AE,
  COUNTRIES.CA,
  COUNTRIES.EU,
  COUNTRIES.AU,
  COUNTRIES.SA,
  COUNTRIES.IN,
  COUNTRIES.SG,
  COUNTRIES.HK,
];

/**
 * Formats numbers using either South Asian 2-2-3 grouping ('en-IN' for India/Pakistan)
 * or standard 3-digit grouping ('en-US'), with compact Lakh/Crore or k/M badges.
 */
export function formatCurrency(
  amount: number,
  country: CountryProfile,
  options?: { maximumFractionDigits?: number; compact?: boolean }
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const maxDecimals = options?.maximumFractionDigits ?? 0;
  const isSouthAsian =
    Boolean(country.useIndianNumberFormat) ||
    country.code === "IN" ||
    country.code === "PK";
  const numberLocale = isSouthAsian ? "en-IN" : "en-US";
  // Enforce Left-to-Right mark (\u200E) so currency symbols (including RTL scripts like د.إ and ﷼) always prepend before the digits
  const sym = `\u200E${country.currencySymbol}\u200E`;

  if (options?.compact) {
    const absVal = Math.abs(safeAmount);
    const sign = safeAmount < 0 ? "-" : "";
    if (isSouthAsian) {
      if (absVal >= 10000000) {
        const cr = (absVal / 10000000).toFixed(2).replace(/\.00$/, "");
        return `${sign}${sym}${cr} Cr`;
      }
      if (absVal >= 100000) {
        const lakh = (absVal / 100000).toFixed(2).replace(/\.00$/, "");
        return `${sign}${sym}${lakh} L`;
      }
    }
    if (absVal >= 1000000) {
      return `${sign}${sym}${(absVal / 1000000).toFixed(2)}M`;
    }
    if (absVal >= 10000) {
      return `${sign}${sym}${(absVal / 1000).toFixed(0)}k`;
    }
  }

  const rounded =
    Math.round(safeAmount * Math.pow(10, maxDecimals)) /
    Math.pow(10, maxDecimals);

  if (rounded < 0) {
    const positiveNum = new Intl.NumberFormat(numberLocale, {
      minimumFractionDigits: maxDecimals,
      maximumFractionDigits: maxDecimals,
    }).format(Math.abs(rounded));
    return `-${sym}${positiveNum}`;
  }

  const formattedNum = new Intl.NumberFormat(numberLocale, {
    minimumFractionDigits: maxDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(rounded);

  return `${sym}${formattedNum}`;
}

export function detectCountryFromBrowser(): CountryCode {
  if (typeof window === "undefined") return "US";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lang = navigator.language || "";

    if (
      tz.includes("Kolkata") ||
      tz.includes("Calcutta") ||
      lang.includes("IN")
    )
      return "IN";
    if (tz.includes("Singapore") || lang.includes("SG")) return "SG";
    if (tz.includes("Hong_Kong") || lang.includes("HK")) return "HK";
    if (tz.includes("Karachi") || lang.includes("PK")) return "PK";
    if (tz.includes("London") || lang.includes("GB")) return "GB";
    if (tz.includes("Dubai") || lang.includes("AE")) return "AE";
    if (
      tz.includes("Toronto") ||
      tz.includes("Vancouver") ||
      tz.includes("Montreal") ||
      lang.includes("CA")
    )
      return "CA";
    if (tz.includes("Riyadh") || lang.includes("SA")) return "SA";
    if (
      tz.includes("Sydney") ||
      tz.includes("Melbourne") ||
      lang.includes("AU")
    )
      return "AU";
    if (
      tz.includes("Berlin") ||
      tz.includes("Paris") ||
      tz.includes("Amsterdam") ||
      tz.includes("Madrid")
    )
      return "EU";
  } catch {
    return "US";
  }
  return "US";
}
