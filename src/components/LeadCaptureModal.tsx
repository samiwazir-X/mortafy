"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  X,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Lock,
  Sparkles,
  User,
  Mail,
  Phone,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import {
  CountryCode,
  CountryProfile,
  CreditScoreTier,
  MortgageCalculationResult,
  MortgageInputs,
  PurchaseTimeline,
} from "@/lib/types";
import { formatCurrency } from "@/lib/countries";
import { calculateConventionalMonthlyPI } from "@/lib/mortgageEngine";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: MortgageInputs;
  country: CountryProfile;
  result: MortgageCalculationResult;
}

const CALLING_CODES: Record<CountryCode, string> = {
  US: "+1",
  CA: "+1",
  GB: "+44",
  PK: "+92",
  AE: "+971",
  EU: "+49",
  AU: "+61",
  SA: "+966",
  IN: "+91",
  SG: "+65",
  HK: "+852",
};

const CREDIT_TIERS: {
  id: CreditScoreTier;
  label: string;
  sub: string;
  rateDiscount: number;
}[] = [
  {
    id: "excellent",
    label: "Excellent (740+)",
    sub: "Tier-1 Prime Rates",
    rateDiscount: 0.65,
  },
  {
    id: "good",
    label: "Good (680–739)",
    sub: "Standard Preferred",
    rateDiscount: 0.45,
  },
  {
    id: "fair",
    label: "Fair (620–679)",
    sub: "Flexible Qualifying",
    rateDiscount: 0.25,
  },
  {
    id: "rebuilding",
    label: "Rebuilding (<620)",
    sub: "FHA / Specialist Options",
    rateDiscount: 0.1,
  },
];

const PURCHASE_TIMELINES: { id: PurchaseTimeline; label: string }[] = [
  { id: "ready", label: "Ready to Buy / Under Contract" },
  { id: "30-60_days", label: "Next 30–60 Days" },
  { id: "3-6_months", label: "3–6 Months" },
  { id: "refinance", label: "Exploring Refinance" },
];

export default function LeadCaptureModal({
  isOpen,
  onClose,
  inputs,
  country,
  result,
}: LeadCaptureModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [creditScoreTier, setCreditScoreTier] =
    useState<CreditScoreTier>("excellent");
  const [purchaseTimeline, setPurchaseTimeline] =
    useState<PurchaseTimeline>("30-60_days");
  const [propertyZipOrCity, setPropertyZipOrCity] = useState("");
  const [annualIncome, setAnnualIncome] = useState<number>(
    Math.round(inputs.grossMonthlyIncome * 12)
  );
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consentGranted, setConsentGranted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);

  // Sync annualIncome when calculator grossMonthlyIncome changes
  useEffect(() => {
    setAnnualIncome(Math.round(inputs.grossMonthlyIncome * 12));
  }, [inputs.grossMonthlyIncome, country.code]);

  // Reset error when changing steps
  useEffect(() => {
    setErrorMessage(null);
  }, [step]);

  // Keyboard navigation: Esc closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedTierObj =
    CREDIT_TIERS.find((t) => t.id === creditScoreTier) ?? CREDIT_TIERS[0];

  const unlockedRateLow = Math.max(
    1.25,
    inputs.interestRate - selectedTierObj.rateDiscount
  );
  const unlockedRateHigh = Math.max(
    1.5,
    unlockedRateLow + 0.35
  );

  const currentPI = calculateConventionalMonthlyPI(
    result.loanAmount,
    inputs.interestRate,
    inputs.loanYears,
    inputs.countryCode
  );
  const unlockedPI = calculateConventionalMonthlyPI(
    result.loanAmount,
    unlockedRateLow,
    inputs.loanYears,
    inputs.countryCode
  );
  const estimatedMonthlySavings = Math.max(25, Math.round(currentPI - unlockedPI));

  const handleAdvanceStep1 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!propertyZipOrCity.trim()) {
      setErrorMessage(
        `Please enter your target city or postal/ZIP code in ${country.name}.`
      );
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full legal name.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!consentGranted) {
      setErrorMessage(
        "Please check the consent box to receive rate quotes from vetted lenders."
      );
      return;
    }

    setSubmitting(true);
    try {
      const callingCode = CALLING_CODES[country.code] || "+1";
      const formattedPhone = phone.trim().startsWith("+")
        ? phone.trim()
        : `${callingCode} ${phone.trim()}`;

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: country.code,
          currency: country.currencyCode,
          homePrice: inputs.homePrice,
          downPayment: inputs.downPayment,
          loanAmount: result.loanAmount,
          monthlyPayment: Math.round(result.totalMonthlyPayment),
          interestRate: inputs.interestRate,
          creditScoreTier,
          purchaseTimeline,
          propertyZipOrCity: propertyZipOrCity.trim(),
          annualIncome,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: formattedPhone,
          consentGranted,
          submittedAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(
          data.error || "Unable to submit request. Please check your details."
        );
        setSubmitting(false);
        return;
      }

      setLeadId(data.leadId);
      setStep(3);
    } catch {
      setErrorMessage("Network error while submitting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDoneAndReset = () => {
    setStep(1);
    setErrorMessage(null);
    setLeadId(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-[#130936]/80 backdrop-blur-md animate-fadeIn"
    >
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg bg-[#130936] text-white rounded-[32px] p-6 sm:p-8 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.65)] overflow-hidden">
        {/* Top Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-[#A82FFC]/25 blur-3xl"
        />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-3 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A82FFC]/20 border border-[#A82FFC]/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,47,252,0.35)]">
              <ShieldCheck className="w-5 h-5 text-[#A82FFC]" />
            </div>
            <div>
              <h2
                id="lead-modal-title"
                className="text-lg sm:text-xl font-extrabold tracking-tight text-white"
              >
                Check Live Local Rates
              </h2>
              <p className="text-xs text-white/65 mt-0.5">
                No impact on your credit score · Soft pre-qualification
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close rate check modal"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Segment Step Progress Bar (Shown on Step 1 & Step 2) */}
        {step !== 3 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/65 mb-2">
              <span>Step {step} of 2</span>
              <span className="text-[#C46BFF]">
                {step === 1
                  ? "Financing & Property Intent"
                  : "Contact & Compliance"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-1.5 rounded-full bg-[#A82FFC] shadow-[0_0_10px_rgba(168,47,252,0.7)]" />
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  step === 2
                    ? "bg-[#A82FFC] shadow-[0_0_10px_rgba(168,47,252,0.7)]"
                    : "bg-white/15"
                }`}
              />
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-4 px-3.5 py-2.5 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Financing & Property Intent */}
        {step === 1 && (
          <form onSubmit={handleAdvanceStep1} className="space-y-5">
            {/* Credit Score Selector (4 pills) */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-white/75 mb-2">
                Estimated Credit Score Tier
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CREDIT_TIERS.map((tier) => {
                  const active = creditScoreTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setCreditScoreTier(tier.id)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        active
                          ? "bg-[#A82FFC] border-[#C46BFF] text-white shadow-[0_6px_18px_rgba(168,47,252,0.4)]"
                          : "bg-white/5 hover:bg-white/10 border-white/10 text-white/85"
                      }`}
                    >
                      <div className="text-xs font-extrabold">{tier.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          active ? "text-white/85" : "text-white/50"
                        }`}
                      >
                        {tier.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Purchase Timeline Selector (4 pills) */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-white/75 mb-2">
                Purchase / Financing Timeline
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PURCHASE_TIMELINES.map((item) => {
                  const active = purchaseTimeline === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPurchaseTimeline(item.id)}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-bold border text-left transition-all ${
                        active
                          ? "bg-[#A82FFC] border-[#C46BFF] text-white shadow-[0_6px_18px_rgba(168,47,252,0.4)]"
                          : "bg-white/5 hover:bg-white/10 border-white/10 text-white/80"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target City / ZIP / Postal Code Input */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-white/75 mb-2">
                Target City, Postal, or ZIP Code ({country.name})
              </label>
              <div className="flex items-center gap-2.5 bg-white/10 focus-within:bg-white/15 border border-white/15 focus-within:border-[#A82FFC] rounded-2xl px-3.5 py-3 transition-colors">
                <MapPin className="w-4 h-4 text-[#C46BFF] shrink-0" />
                <input
                  type="text"
                  value={propertyZipOrCity}
                  onChange={(e) => setPropertyZipOrCity(e.target.value)}
                  placeholder={`e.g. ${
                    country.code === "US"
                      ? "Austin, TX or 78701"
                      : country.code === "GB"
                      ? "London or SW1A"
                      : country.code === "AE"
                      ? "Dubai Marina / Downtown"
                      : country.code === "PK"
                      ? "DHA Lahore / Clifton Karachi"
                      : country.code === "IN"
                      ? "Mumbai / Bengaluru 560001"
                      : country.code === "SG"
                      ? "Orchard / District 10"
                      : country.code === "HK"
                      ? "Central / Kowloon"
                      : country.name
                  }`}
                  className="w-full bg-transparent text-sm font-semibold text-white placeholder-white/40 focus:outline-none"
                />
              </div>
            </div>

            {/* Next Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#A82FFC] to-[#9122E0] hover:from-[#b347ff] hover:to-[#A82FFC] text-white font-extrabold text-sm tracking-tight shadow-[0_10px_25px_rgba(168,47,252,0.45)] flex items-center justify-center gap-2 transition-all"
            >
              <span>Continue to Rate Quotes →</span>
            </button>
          </form>
        )}

        {/* STEP 2: Contact & Compliance Information */}
        {step === 2 && (
          <form onSubmit={handleSubmitLead} className="space-y-4">
            {/* Gross Annual Income confirmation input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Gross Annual Household Income ({country.currencyCode})
              </label>
              <div className="flex items-center gap-2.5 bg-white/10 focus-within:border-[#A82FFC] border border-white/15 rounded-2xl px-3.5 py-2.5">
                <DollarSign className="w-4 h-4 text-[#C46BFF] shrink-0" />
                <input
                  type="number"
                  inputMode="decimal"
                  value={annualIncome}
                  onChange={(e) =>
                    setAnnualIncome(Math.max(0, parseFloat(e.target.value) || 0))
                  }
                  className="w-full bg-transparent text-sm font-extrabold text-white focus:outline-none"
                />
                <span className="text-xs font-bold text-white/55 shrink-0">
                  {formatCurrency(annualIncome, country, { compact: true })}/yr
                </span>
              </div>
            </div>

            {/* Full Legal Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Full Legal Name
              </label>
              <div className="flex items-center gap-2.5 bg-white/10 focus-within:border-[#A82FFC] border border-white/15 rounded-2xl px-3.5 py-2.5">
                <User className="w-4 h-4 text-[#C46BFF] shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent text-sm font-semibold text-white placeholder-white/40 focus:outline-none"
                />
              </div>
            </div>

            {/* Phone Number with Country Flag / Calling Code Indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Phone Number
                </label>
                <div className="flex items-center gap-2 bg-white/10 focus-within:border-[#A82FFC] border border-white/15 rounded-2xl px-3 py-2.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 text-xs font-bold text-white shrink-0">
                    <span>{country.flag}</span>
                    <span>{CALLING_CODES[country.code]}</span>
                  </span>
                  <Phone className="w-3.5 h-3.5 text-[#C46BFF] shrink-0 hidden sm:inline" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="555 234 5678"
                    className="w-full bg-transparent text-sm font-semibold text-white placeholder-white/40 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Email Address
                </label>
                <div className="flex items-center gap-2 bg-white/10 focus-within:border-[#A82FFC] border border-white/15 rounded-2xl px-3.5 py-2.5">
                  <Mail className="w-4 h-4 text-[#C46BFF] shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm font-semibold text-white placeholder-white/40 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Legal Consent & TCPA / GDPR Checkbox */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={consentGranted}
                onChange={(e) => setConsentGranted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#A82FFC] shrink-0"
              />
              <span className="text-[11px] leading-relaxed text-white/75">
                I agree to Mortafy&apos;s Terms of Use and authorize up to 4
                vetted lending partners to contact me via email, phone, or SMS
                regarding home financing options. Consent is not a condition of
                purchase.
              </span>
            </label>

            {/* Back & Submit Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-12 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-[#A82FFC] to-[#9122E0] hover:from-[#b347ff] hover:to-[#A82FFC] disabled:opacity-60 text-white font-extrabold text-sm tracking-tight shadow-[0_10px_25px_rgba(168,47,252,0.45)] inline-flex items-center justify-center gap-2 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {submitting ? "Encrypting & Submitting..." : "Submit & Get Quotes"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Success State / Confirmation */}
        {step === 3 && (
          <div className="space-y-5 text-center py-2 animate-fadeIn">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.45)]">
              <CheckCircle2 className="w-9 h-9 text-emerald-400 animate-bounce" />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Reference #{leadId}
              </span>
              <h3 className="text-2xl font-black tracking-tight text-white mt-2">
                Rate Request Received!
              </h3>
            </div>

            {/* Summary Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#A82FFC]/25 via-white/10 to-white/5 border border-[#C46BFF]/40 p-4 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div>
                  <div className="text-[10px] font-bold uppercase text-white/60">
                    Estimated Rate Range ({selectedTierObj.label})
                  </div>
                  <div className="text-lg font-black text-white mt-0.5">
                    {unlockedRateLow.toFixed(2)}% – {unlockedRateHigh.toFixed(2)}%{" "}
                    <span className="text-xs font-semibold text-[#C46BFF]">
                      APR
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-white/60">
                    Est. Monthly Savings
                  </div>
                  <div className="text-lg font-black text-emerald-400 mt-0.5">
                    ~{formatCurrency(estimatedMonthlySavings, country)}/mo
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-white/75">
                <span>
                  Loan Amount:{" "}
                  <strong className="text-white">
                    {formatCurrency(result.loanAmount, country)}
                  </strong>
                </span>
                <span>
                  Location:{" "}
                  <strong className="text-white">{propertyZipOrCity}</strong>
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-white/75 px-2">
              A licensed mortgage specialist licensed in your area will review
              your scenario and send custom loan options to{" "}
              <strong className="text-white underline">{email}</strong> within
              24 business hours.
            </p>

            <button
              type="button"
              onClick={handleDoneAndReset}
              className="w-full h-12 rounded-2xl bg-[#A82FFC] hover:bg-[#9122E0] text-white font-extrabold text-sm tracking-tight shadow-[0_8px_20px_rgba(168,47,252,0.4)] inline-flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Done</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
