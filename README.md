# Mortafy — Global Mortgage Intelligence

> **Mortgage intelligence, simplified.**

Mortafy is a modular, multi-jurisdictional mortgage, Home Loan EMI, and Islamic Diminishing Musharakah web application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide React**.

## Key Features

- **11 Localized Jurisdictions**: United States (`US`), Pakistan (`PK`), United Kingdom (`GB`), United Arab Emirates (`AE`), Canada (`CA`), Eurozone (`EU`), Australia (`AU`), Saudi Arabia (`SA`), India (`IN`), Singapore (`SG`), and Hong Kong (`HK`).
- **Multi-Jurisdictional Financial Math Engine (`src/lib/mortgageEngine.ts`)**:
  - **Standard Monthly Compounding** (`US, PK, GB, AE, EU, AU, SA, IN, SG, HK`).
  - **Canadian Semi-Annual Compounding (`CA`)** adhering to Section 6 of the Canadian Interest Act, plus capitalized **CMHC Default Insurance** (`2.8% / 3.1% / 4.0%`).
  - **South Asian Number Formatting (`en-IN`)** with `2-2-3` grouping and compact **Lakh (`L`) / Crore (`Cr`)** badges for India (`₹`) and Pakistan (`₨`).
  - **Islamic Diminishing Musharakah** co-ownership financing supporting both **Equal Installments (Standard)** and **Declining Installments (Classical)**.
  - **Jurisdiction-Specific Stamp Duties & Closing Costs**: UK progressive SDLT, Singapore IRAS tiered Buyer's Stamp Duty (BSD) + MAS `25%` down payment cap, Hong Kong AVD Scale 2, UAE `4%` DLD + `2%` agency fee, and US auto-PMI (`<20%` down).
- **Early Payoff Time Machine & Scenario Pinning**: Real-time extra principal/equity slider and `Pin to Compare` live delta badges.
- **White-Label Amortization Schedule & PDF Export**: Toggle between Annual and Monthly schedules with print-optimized (`@media print`) client/broker white-label reports.
- **2-Step Soft Pre-Qualification & Lead Capture Engine (`/api/leads`)**: Validated TCPA/GDPR-compliant lead capture modal and API route.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
