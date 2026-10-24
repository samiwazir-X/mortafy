"use client";

import React from "react";
import {
  Sparkles,
  Moon,
  Landmark,
  Clock,
  ArrowRight,
  AlertTriangle,
  TrendingDown,
  Wallet,
  FileSpreadsheet,
} from "lucide-react";
import {
  CountryProfile,
  MortgageCalculationResult,
  MortgageInputs,
} from "@/lib/types";
import { formatCurrency } from "@/lib/countries";
import CardSliderInput from "./CardSliderInput";

interface MortgageCardProps {
  inputs: MortgageInputs;
  country: CountryProfile;
  result: MortgageCalculationResult;
  onUpdateInputs: (patch: Partial<MortgageInputs>) => void;
  onCalculateAction: () => void;
  onOpenAmortization: () => void;
}

const TENURE_PILLS = [30, 20, 10, 15];

export default function MortgageCard({
  inputs,
  country,
  result,
  onUpdateInputs,
  onCalculateAction,
  onOpenAmortization,
}: MortgageCardProps) {
  const isIslamic = inputs.financingMode === "islamic";
  const islamicInstallmentType = inputs.islamicInstallmentType ?? "equal";

  const getCardTitle = () => {
    switch (inputs.activeTab) {
      case "loan_emi":
        return isIslamic ? "Islamic Financed EMI" : "Calculate Loan EMI";
      case "affordability":
        return "Home Affordability";
      case "refinance":
        return "Refinance Analyzer";
      default:
        return isIslamic ? "Musharakah Finance" : country.mortgageTitle;
    }
  };

  const handleHomePriceChange = (newPrice: number) => {
    const newDownPayment = Math.round((newPrice * inputs.downPaymentPct) / 100);
    onUpdateInputs({
      homePrice: newPrice,
      downPayment: newDownPayment,
    });
  };

  const handleDownPaymentChange = (newDown: number) => {
    const clampedDown = Math.min(inputs.homePrice * 0.9, Math.max(0, newDown));
    const pct =
      inputs.homePrice > 0
        ? Number(((clampedDown / inputs.homePrice) * 100).toFixed(1))
        : 0;
    onUpdateInputs({
      downPayment: clampedDown,
      downPaymentPct: pct,
    });
  };

  const cycleDownPaymentPreset = () => {
    const presets = [5, 10, 15, 20, 25, 30, 40];
    const nextPct =
      presets.find((p) => p > inputs.downPaymentPct) ?? presets[0];
    const nextDown = Math.round((inputs.homePrice * nextPct) / 100);
    onUpdateInputs({
      downPaymentPct: nextPct,
      downPayment: nextDown,
    });
  };

  return (
    <section
      aria-label="Mortgage Parameters"
      className="w-full bg-[#C2D1D4] rounded-[38px] p-5 sm:p-7 shadow-[0_24px_60px_rgba(19,9,54,0.22)] border border-white/40 flex flex-col justify-between transition-all"
    >
      <div className="space-y-4">
        {/* Top Row: Subtle Jurisdiction Pill & Compounding Badge */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#130936]/65 px-1">
          <span className="inline-flex items-center gap-1.5">
            <span>{country.flag}</span>
            <span>{country.name}</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/55 text-[#130936] font-bold text-[10px]">
            {country.compounding === "semi-annual"
              ? "CA Semi-Annual Act"
              : isIslamic
              ? "Diminishing Musharakah"
              : country.useIndianNumberFormat
              ? "en-IN (Lakhs & Crores)"
              : "Monthly Compounding"}
          </span>
        </div>

        {/* Centered Title */}
        <div className="text-center">
          <h1 className="text-[22px] sm:text-[24px] font-extrabold tracking-tight text-[#130936]">
            {getCardTitle()}
          </h1>
          <p className="text-xs font-medium text-[#130936]/60 mt-0.5">
            {isIslamic
              ? "Asset-backed co-ownership · Equity Buyout + Rental Share"
              : "Tap any figure to type exact numbers or drag slider"}
          </p>
        </div>

        {/* Conventional vs. Islamic (Musharakah) Two-Segment Switch */}
        <div className="space-y-2">
          <div
            role="tablist"
            aria-label="Financing Mode"
            className="grid grid-cols-2 p-1 rounded-2xl bg-white/55 border border-white/60 shadow-inner"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isIslamic}
              onClick={() => onUpdateInputs({ financingMode: "conventional" })}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                !isIslamic
                  ? "bg-[#130936] text-white shadow-md"
                  : "text-[#130936]/70 hover:text-[#130936]"
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Conventional</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isIslamic}
              onClick={() => onUpdateInputs({ financingMode: "islamic" })}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isIslamic
                  ? "bg-[#A82FFC] text-white shadow-[0_4px_14px_rgba(168,47,252,0.45)]"
                  : "text-[#130936]/70 hover:text-[#130936]"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Islamic (Musharakah)</span>
            </button>
          </div>

          {/* Islamic Diminishing Musharakah Structure Toggle: Equal vs Declining Installments */}
          {isIslamic && (
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#130936]/10 border border-white/50">
              <button
                type="button"
                onClick={() =>
                  onUpdateInputs({ islamicInstallmentType: "equal" })
                }
                className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold transition-all ${
                  islamicInstallmentType === "equal"
                    ? "bg-[#130936] text-white shadow-sm"
                    : "text-[#130936]/70 hover:text-[#130936]"
                }`}
              >
                Equal Installments (Standard)
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateInputs({ islamicInstallmentType: "declining" })
                }
                className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold transition-all ${
                  islamicInstallmentType === "declining"
                    ? "bg-[#130936] text-white shadow-sm"
                    : "text-[#130936]/70 hover:text-[#130936]"
                }`}
              >
                Declining Installments (Classical)
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Inputs Based on Calculator Mode */}
        <div className="space-y-3">
          {/* 1. Home Price / Loan Principal */}
          <CardSliderInput
            label={
              inputs.activeTab === "loan_emi"
                ? "Total Financed Amount"
                : isIslamic
                ? "Property Value (Joint Musharakah Asset)"
                : "Home Price"
            }
            value={inputs.homePrice}
            min={country.defaults.minHomePrice}
            max={country.defaults.maxHomePrice}
            step={country.defaults.stepHomePrice}
            onChange={handleHomePriceChange}
            prefix={country.currencySymbol}
            formattedValue={formatCurrency(inputs.homePrice, country)}
            secondaryBadge={formatCurrency(inputs.homePrice, country, {
              compact: true,
            })}
          />

          {/* 2. Down Payment (Hidden in pure Loan EMI mode) */}
          {inputs.activeTab !== "loan_emi" && (
            <CardSliderInput
              label={
                isIslamic ? "Client Initial Equity Share" : "Down Payment"
              }
              value={inputs.downPayment}
              min={0}
              max={Math.round(inputs.homePrice * 0.8)}
              step={Math.max(
                500,
                Math.round(country.defaults.stepHomePrice / 5)
              )}
              onChange={handleDownPaymentChange}
              prefix={country.currencySymbol}
              formattedValue={formatCurrency(inputs.downPayment, country)}
              secondaryBadge={`${inputs.downPaymentPct.toFixed(0)}%`}
              onSecondaryBadgeClick={cycleDownPaymentPreset}
              helperText={
                country.code === "CA" && result.cmhcPremiumAmount > 0
                  ? `Financed: ${formatCurrency(result.loanAmount, country, {
                      compact: true,
                    })} (incl. +${result.cmhcPremiumRatePct.toFixed(1)}% CMHC)`
                  : `Financed: ${formatCurrency(result.loanAmount, country, {
                      compact: true,
                    })}`
              }
            />
          )}

          {/* Jurisdiction LTV Alert (e.g. Singapore MAS <25% cap, Canada CMHC, UAE CBUAE <20%) */}
          {inputs.activeTab !== "loan_emi" &&
            result.closingCosts.ltvWarning && (
              <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-600/30 text-[#130936] text-[11px] font-semibold leading-snug">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{result.closingCosts.ltvWarning}</span>
              </div>
            )}

          {/* 3. Interest Rate / Annual Rental Rate */}
          <CardSliderInput
            label={
              isIslamic
                ? "Annual Rental Rate (Bank Share %)"
                : inputs.activeTab === "refinance"
                ? "New Refinance Interest Rate"
                : "Interest Rate (Annual %)"
            }
            value={inputs.interestRate}
            min={0.5}
            max={country.code === "PK" ? 28 : 15}
            step={0.05}
            decimals={2}
            onChange={(val) => onUpdateInputs({ interestRate: val })}
            suffix="%"
            formattedValue={`${inputs.interestRate.toFixed(2)}%`}
            secondaryBadge={`${country.centralBankCode}: ${country.centralBankRate}%`}
          />

          {/* Tab-Specific Contextual Sliders */}
          {inputs.activeTab === "affordability" && (
            <div className="space-y-3 pt-1">
              <CardSliderInput
                label="Gross Monthly Household Income"
                value={inputs.grossMonthlyIncome}
                min={Math.round(country.defaults.grossMonthlyIncome * 0.2)}
                max={Math.round(country.defaults.grossMonthlyIncome * 5)}
                step={Math.max(
                  100,
                  Math.round(country.defaults.grossMonthlyIncome * 0.02)
                )}
                onChange={(val) => onUpdateInputs({ grossMonthlyIncome: val })}
                prefix={country.currencySymbol}
                formattedValue={formatCurrency(
                  inputs.grossMonthlyIncome,
                  country
                )}
                secondaryBadge={`DTI: ${result.frontEndDtiPct.toFixed(1)}%`}
              />
              <div className="p-3.5 rounded-2xl bg-[#130936] text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#A82FFC]/25 flex items-center justify-center text-[#C46BFF]">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-white/65">
                      Recommended Max Property Budget (28% Safe DTI)
                    </div>
                    <div className="text-base font-extrabold text-white">
                      {formatCurrency(result.maxAffordableHomePrice, country)}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleHomePriceChange(
                      Math.round(result.maxAffordableHomePrice)
                    )
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-[#A82FFC] hover:bg-[#931ee8] text-[11px] font-bold text-white transition-colors"
                >
                  Apply Max
                </button>
              </div>
            </div>
          )}

          {inputs.activeTab === "refinance" && (
            <div className="space-y-3 pt-1">
              <CardSliderInput
                label="Current Existing Interest Rate"
                value={inputs.currentInterestRate}
                min={1}
                max={country.code === "PK" ? 28 : 15}
                step={0.05}
                decimals={2}
                onChange={(val) =>
                  onUpdateInputs({ currentInterestRate: val })
                }
                suffix="%"
                formattedValue={`${inputs.currentInterestRate.toFixed(2)}%`}
                helperText={`Old P&I: ${formatCurrency(
                  result.oldMonthlyPI,
                  country
                )}/mo`}
              />
              <div className="p-3.5 rounded-2xl bg-[#130936] text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-white/65">
                      Refinance Monthly Impact
                    </div>
                    <div className="text-sm font-extrabold text-emerald-400">
                      {result.refinanceMonthlySavings >= 0
                        ? `Save ${formatCurrency(
                            result.refinanceMonthlySavings,
                            country
                          )}/mo`
                        : `+${formatCurrency(
                            Math.abs(result.refinanceMonthlySavings),
                            country
                          )}/mo higher`}
                    </div>
                  </div>
                </div>
                {result.refinanceBreakEvenMonths > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-bold text-white/90">
                    Break-even: {result.refinanceBreakEvenMonths} mos
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Loan Tenure Pills: 4 rounded buttons (30, 20, 10, 15 years) */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-[#130936]/80">
              Loan Term (Years)
            </span>
            <span className="text-[11px] font-semibold text-[#130936]/60">
              {inputs.loanYears * 12} monthly installments
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {TENURE_PILLS.map((yr) => {
              const isSelected = inputs.loanYears === yr;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => onUpdateInputs({ loanYears: yr })}
                  className={`h-11 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center ${
                    isSelected
                      ? "bg-[#A82FFC] text-white shadow-[0_6px_18px_rgba(168,47,252,0.45)] scale-[1.02]"
                      : "bg-white text-[#130936] hover:bg-white/80 shadow-sm"
                  }`}
                >
                  {yr} Years
                </button>
              );
            })}
          </div>
        </div>

        {/* Early Payoff Time Machine */}
        <div className="rounded-[22px] bg-gradient-to-br from-[#130936] to-[#1F1154] p-4 text-white shadow-lg border border-white/15">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C46BFF]" />
              <span className="text-xs font-extrabold tracking-tight">
                Early Payoff Time Machine
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#A82FFC]/30 border border-[#A82FFC]/60 text-[11px] font-extrabold text-[#E2B8FF]">
              +{formatCurrency(inputs.extraMonthlyPayment, country)}/mo{" "}
              {isIslamic ? "Extra Equity" : "Extra Principal"}
            </span>
          </div>

          {/* Interactive Extra Payment Slider with min-h-[44px] touch target */}
          <div className="relative my-2.5 h-3 flex items-center">
            <div className="w-full h-[5px] bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#A82FFC] to-emerald-400 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (inputs.extraMonthlyPayment /
                      country.defaults.maxExtraMonthly) *
                      100
                  )}%`,
                }}
              />
            </div>
            <div
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#A82FFC] shadow-[0_0_12px_rgba(168,47,252,0.9)] flex items-center justify-center"
              style={{
                left: `${Math.min(
                  100,
                  (inputs.extraMonthlyPayment /
                    country.defaults.maxExtraMonthly) *
                    100
                )}%`,
              }}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
            </div>
            <input
              type="range"
              min={0}
              max={country.defaults.maxExtraMonthly}
              step={country.defaults.stepExtraMonthly}
              value={inputs.extraMonthlyPayment}
              aria-label="Extra monthly principal payment"
              onChange={(e) =>
                onUpdateInputs({
                  extraMonthlyPayment: parseFloat(e.target.value),
                })
              }
              className="absolute inset-x-0 -top-4 w-full min-h-[44px] h-[44px] opacity-0 cursor-pointer z-10"
            />
          </div>

          {/* Live Glowing Savings Badge */}
          <div className="mt-2 px-3 py-2 rounded-xl bg-white/10 border border-[#A82FFC]/40 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-[#C46BFF] shrink-0" />
              <span>
                {result.monthsSaved > 0
                  ? `Pay off ${result.timeSavedFormatted} · Save ${formatCurrency(
                      result.interestSaved,
                      country
                    )}`
                  : "Slide right to shave years off your mortgage"}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-white/65 shrink-0">
              Free by {result.payoffDateFormatted}
            </span>
          </div>
        </div>
      </div>

      {/* Context-Aware Bottom CTA Button (#130936):
          - Mobile (< lg): "Calculate →" switches to the Monthly Payment result screen
          - Desktop (lg+): "View Full Amortization & PDF Report" opens AmortizationModal directly */}
      <div className="mt-5 safe-bottom-cta">
        <button
          type="button"
          onClick={onCalculateAction}
          className="lg:hidden w-full h-14 rounded-2xl bg-[#130936] hover:bg-[#1c0e4f] active:scale-[0.99] text-white font-extrabold text-base tracking-tight shadow-[0_12px_28px_rgba(19,9,54,0.35)] flex items-center justify-center gap-2 transition-all"
        >
          <span>Calculate →</span>
        </button>

        <button
          type="button"
          onClick={onOpenAmortization}
          className="hidden lg:flex w-full h-14 rounded-2xl bg-[#130936] hover:bg-[#1c0e4f] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base tracking-tight shadow-[0_12px_28px_rgba(19,9,54,0.35)] items-center justify-center gap-2.5 transition-all"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#C46BFF]" />
          <span>View Full Amortization & PDF Report</span>
          <ArrowRight className="w-4 h-4 text-[#C46BFF]" />
        </button>
      </div>
    </section>
  );
}
