"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Sliders, PieChart, ShieldCheck } from "lucide-react";
import {
  CalculatorTab,
  CountryCode,
  FinancingMode,
  MobileStep,
  MortgageInputs,
  PinnedScenario,
} from "@/lib/types";
import {
  COUNTRIES,
  detectCountryFromBrowser,
  formatCurrency,
} from "@/lib/countries";
import { calculateMortgageSummary } from "@/lib/mortgageEngine";
import HeaderBar from "@/components/HeaderBar";
import MortgageCard from "@/components/MortgageCard";
import ResultCard from "@/components/ResultCard";
import AmortizationModal from "@/components/AmortizationModal";
import RatesFxView from "@/components/RatesFxView";
import NavigationDrawer from "@/components/NavigationDrawer";
import LeadCaptureModal from "@/components/LeadCaptureModal";

const STORAGE_KEY = "mortafy_saved_state_v1";

function createDefaultInputsForCountry(
  code: CountryCode,
  activeTab: CalculatorTab = "mortgage",
  financingMode: FinancingMode = "conventional"
): MortgageInputs {
  const c = COUNTRIES[code];
  const downPayment = Math.round(
    (c.defaults.homePrice * c.defaults.downPaymentPct) / 100
  );
  const loanBalance = c.defaults.homePrice - downPayment;

  return {
    countryCode: code,
    financingMode,
    islamicInstallmentType: "equal",
    activeTab,
    homePrice: c.defaults.homePrice,
    downPayment,
    downPaymentPct: c.defaults.downPaymentPct,
    interestRate: c.defaults.interestRate,
    loanYears: c.defaults.loanYears,
    extraMonthlyPayment: c.defaults.extraMonthlyPayment,
    propertyTaxMonthly: c.defaults.propertyTaxMonthly,
    insuranceMonthly: c.defaults.insuranceMonthly,
    hoaMonthly: c.defaults.hoaMonthly,
    pmiAutoEnabled: true,
    grossMonthlyIncome: c.defaults.grossMonthlyIncome,
    currentLoanBalance: loanBalance,
    currentInterestRate: Number((c.defaults.interestRate + 1.15).toFixed(2)),
    currentRemainingYears: c.defaults.loanYears,
    refinanceClosingCosts: Math.round(loanBalance * 0.015),
    monthlyDebts: 0,
    targetDtiPct: 28,
  };
}

export default function MortafyPage() {
  const [inputs, setInputs] = useState<MortgageInputs>(() =>
    createDefaultInputsForCountry("US")
  );
  const [mobileStep, setMobileStep] = useState<MobileStep>("parameters");
  const [pinnedScenario, setPinnedScenario] = useState<PinnedScenario | null>(
    null
  );
  const [amortizationOpen, setAmortizationOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage or browser timezone/locale fallback
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.countryCode && COUNTRIES[parsed.countryCode as CountryCode]) {
          setInputs((prev) => ({ ...prev, ...parsed }));
          setHydrated(true);
          return;
        }
      }
      const detected = detectCountryFromBrowser();
      if (detected && COUNTRIES[detected]) {
        setInputs(createDefaultInputsForCountry(detected));
      }
    } catch {
      // Fallback to US defaults
    }
    setHydrated(true);
  }, []);

  // Persist changes to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      // Ignore storage quota errors
    }
  }, [inputs, hydrated]);

  const country = COUNTRIES[inputs.countryCode];

  const result = useMemo(() => calculateMortgageSummary(inputs), [inputs]);

  const handleUpdateInputs = (patch: Partial<MortgageInputs>) => {
    setInputs((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  const handleSelectCountry = (newCode: CountryCode) => {
    setPinnedScenario(null);
    setInputs((prev) =>
      createDefaultInputsForCountry(
        newCode,
        prev.activeTab,
        prev.financingMode
      )
    );
  };

  const handleAutoDetectCountry = () => {
    const detected = detectCountryFromBrowser();
    handleSelectCountry(detected);
  };

  const handleSelectTab = (tab: CalculatorTab) => {
    setInputs((prev) => ({
      ...prev,
      activeTab: tab,
    }));
  };

  const handleTogglePinScenario = () => {
    if (pinnedScenario) {
      setPinnedScenario(null);
    } else {
      setPinnedScenario({
        countryCode: inputs.countryCode,
        currencySymbol: country.currencySymbol,
        financingMode: inputs.financingMode,
        homePrice: inputs.homePrice,
        loanAmount: result.loanAmount,
        interestRate: inputs.interestRate,
        loanYears: inputs.loanYears,
        totalMonthlyPayment: result.totalMonthlyPayment,
        acceleratedTotalInterest: result.acceleratedTotalInterest,
        acceleratedTermMonths: result.acceleratedTermMonths,
        pinnedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
  };

  const handleApplyBankRate = (
    countryCode: CountryCode,
    rate: number,
    mode: FinancingMode
  ) => {
    setInputs((prev) => {
      const base =
        prev.countryCode === countryCode
          ? prev
          : createDefaultInputsForCountry(countryCode, "mortgage", mode);
      return {
        ...base,
        countryCode,
        financingMode: mode,
        interestRate: rate,
        activeTab: "mortgage",
      };
    });
  };

  const handleResetDefaults = () => {
    setInputs((prev) =>
      createDefaultInputsForCountry(
        prev.countryCode,
        prev.activeTab,
        prev.financingMode
      )
    );
    setMobileStep("parameters");
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#B9A7C9] via-[#B4A0C8] to-[#9882B0] overflow-x-hidden">
      {/* Ambient Organic Background Shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0 no-print"
      >
        <div className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-[#D1C1E0]/45 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[520px] h-[520px] rounded-full bg-[#A82FFC]/15 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[#130936]/15 blur-3xl" />
      </div>

      {/* Sticky Top Header Bar (#130936) */}
      <HeaderBar
        country={country}
        onSelectCountry={handleSelectCountry}
        onAutoDetectCountry={handleAutoDetectCountry}
        activeTab={inputs.activeTab}
        onSelectTab={handleSelectTab}
        onOpenDrawer={() => setDrawerOpen(true)}
      />

      {/* Mobile Navigation Drawer */}
      <NavigationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={inputs.activeTab}
        onSelectTab={handleSelectTab}
        country={country}
        onSelectCountry={handleSelectCountry}
        financingMode={inputs.financingMode}
        onToggleFinancingMode={(mode) =>
          handleUpdateInputs({ financingMode: mode })
        }
        onOpenAmortization={() => setAmortizationOpen(true)}
      />

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-8 flex flex-col justify-center">
        {inputs.activeTab === "rates_fx" ? (
          <RatesFxView
            activeCountry={country}
            financingMode={inputs.financingMode}
            onSelectCountry={handleSelectCountry}
            onApplyBankRate={handleApplyBankRate}
          />
        ) : (
          <>
            {/* Mobile / Tablet Seamless 2-Screen Step Switcher (1. Parameters ⇄ 2. Monthly Payment) */}
            <div className="lg:hidden mb-4">
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#130936]/90 backdrop-blur-md text-white shadow-lg border border-white/15">
                <button
                  type="button"
                  onClick={() => setMobileStep("parameters")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-all ${
                    mobileStep === "parameters"
                      ? "bg-[#A82FFC] text-white shadow"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>1. Parameters</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileStep("payment")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-all ${
                    mobileStep === "payment"
                      ? "bg-[#A82FFC] text-white shadow"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5" />
                  <span>
                    2. Payment (
                    {formatCurrency(result.totalMonthlyPayment, country, {
                      compact: true,
                    })}
                    )
                  </span>
                </button>
              </div>
            </div>

            {/* Dual-Card Command Center on Desktop (lg/xl) & 2-Step Flow on Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              {/* Left Card: Input Phone Card (#C2D1D4) */}
              <div
                className={`lg:col-span-6 flex ${
                  mobileStep === "parameters" ? "block" : "hidden lg:flex"
                }`}
              >
                <MortgageCard
                  inputs={inputs}
                  country={country}
                  result={result}
                  onUpdateInputs={handleUpdateInputs}
                  onCalculateAction={() => setMobileStep("payment")}
                  onOpenAmortization={() => setAmortizationOpen(true)}
                />
              </div>

              {/* Right Card: Result Phone Card (#130936 top & #F4F7F8 bottom sheet) */}
              <div
                className={`lg:col-span-6 flex ${
                  mobileStep === "payment" ? "block" : "hidden lg:flex"
                }`}
              >
                <ResultCard
                  inputs={inputs}
                  country={country}
                  result={result}
                  pinnedScenario={pinnedScenario}
                  onTogglePinScenario={handleTogglePinScenario}
                  onUpdateInputs={handleUpdateInputs}
                  onOpenAmortization={() => setAmortizationOpen(true)}
                  onRecalculateReset={handleResetDefaults}
                  onOpenDrawer={() => setDrawerOpen(true)}
                  onOpenLeadModal={() => setLeadModalOpen(true)}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Subtle Jurisdiction Regulatory Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 pb-5 pt-2 safe-bottom text-center lg:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-medium text-[#130936]/75 no-print">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#130936] shrink-0" />
          <span>
            <strong>Mortafy</strong> — Mortgage intelligence, simplified.{" "}
            {country.regulatoryDisclaimer}
          </span>
        </div>
        <span className="shrink-0 font-bold text-[#130936]">
          {country.flag} {country.currencyCode} · {country.centralBankCode}{" "}
          {country.centralBankRate}%
        </span>
      </footer>

      {/* Schedule & PDF Amortization Modal */}
      <AmortizationModal
        isOpen={amortizationOpen}
        onClose={() => setAmortizationOpen(false)}
        inputs={inputs}
        country={country}
        result={result}
      />

      {/* 2-Step Lead Capture & Soft Pre-Qualification Modal */}
      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        inputs={inputs}
        country={country}
        result={result}
      />
    </div>
  );
}
