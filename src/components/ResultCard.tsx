"use client";

import React, { useState } from "react";
import {
  Pin,
  PinOff,
  SlidersHorizontal,
  FileSpreadsheet,
  RotateCcw,
  Pencil,
  Briefcase,
  Check,
} from "lucide-react";
import {
  CountryProfile,
  MortgageCalculationResult,
  MortgageInputs,
  PinnedScenario,
} from "@/lib/types";
import { formatCurrency } from "@/lib/countries";
import { calculateConventionalMonthlyPI } from "@/lib/mortgageEngine";

interface ResultCardProps {
  inputs: MortgageInputs;
  country: CountryProfile;
  result: MortgageCalculationResult;
  pinnedScenario: PinnedScenario | null;
  onTogglePinScenario: () => void;
  onUpdateInputs: (patch: Partial<MortgageInputs>) => void;
  onOpenAmortization: () => void;
  onRecalculateReset: () => void;
  onOpenDrawer: () => void;
  onOpenLeadModal: () => void;
}

interface EditableCostRowProps {
  badgeColor: string;
  label: string;
  sublabel?: string;
  value: number;
  country: CountryProfile;
  onChange?: (val: number) => void;
  readOnly?: boolean;
  rightAction?: React.ReactNode;
}

function EditableCostRow({
  badgeColor,
  label,
  sublabel,
  value,
  country,
  onChange,
  readOnly = false,
  rightAction,
}: EditableCostRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(Math.round(value)));

  const startEdit = () => {
    if (readOnly || !onChange) return;
    setDraft(String(Math.round(value)));
    setEditing(true);
  };

  const commit = () => {
    setEditing(false);
    if (!onChange) return;
    const cleaned = draft.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    if (!Number.isNaN(parsed)) {
      onChange(Math.max(0, parsed));
    }
  };

  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-2xl bg-white shadow-[0_2px_10px_rgba(19,9,54,0.04)] border border-[#130936]/5">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="w-4 h-4 rounded-[6px] shrink-0 shadow-sm"
          style={{ backgroundColor: badgeColor }}
        />
        <div className="min-w-0">
          <div className="text-xs sm:text-[13px] font-bold text-[#130936] truncate">
            {label}
          </div>
          {sublabel && (
            <div className="text-[10px] font-medium text-[#130936]/55 truncate">
              {sublabel}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {rightAction}
        {editing ? (
          <div className="flex items-center gap-1 bg-[#F4F7F8] px-2 py-1 rounded-lg ring-2 ring-[#A82FFC]">
            <input
              type="text"
              inputMode="decimal"
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setEditing(false);
              }}
              aria-label={label}
              className="w-20 text-right text-xs font-extrabold text-[#130936] bg-transparent focus:outline-none"
            />
            <button
              type="button"
              onClick={commit}
              className="text-[#A82FFC] hover:text-[#130936]"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={readOnly}
            onClick={startEdit}
            className={`group inline-flex items-center gap-1.5 text-right ${
              readOnly
                ? "cursor-default"
                : "cursor-pointer hover:text-[#A82FFC]"
            }`}
          >
            <span className="text-sm font-extrabold text-[#130936] group-hover:text-[#A82FFC] transition-colors">
              {formatCurrency(value, country)}
              <span className="text-[11px] font-semibold text-[#130936]/55">
                /mo
              </span>
            </span>
            {!readOnly && (
              <Pencil className="w-3 h-3 text-[#130936]/35 group-hover:text-[#A82FFC] transition-colors" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ResultCard({
  inputs,
  country,
  result,
  pinnedScenario,
  onTogglePinScenario,
  onUpdateInputs,
  onOpenAmortization,
  onRecalculateReset,
  onOpenDrawer,
  onOpenLeadModal,
}: ResultCardProps) {
  const [editingIncome, setEditingIncome] = useState(false);
  const [incomeDraft, setIncomeDraft] = useState(
    String(inputs.grossMonthlyIncome)
  );

  const isIslamic = inputs.financingMode === "islamic";
  const unlockedRate = Math.max(1.25, inputs.interestRate - 0.65);
  const currentPI = calculateConventionalMonthlyPI(
    result.loanAmount,
    inputs.interestRate,
    inputs.loanYears,
    inputs.countryCode
  );
  const discountedPI = calculateConventionalMonthlyPI(
    result.loanAmount,
    unlockedRate,
    inputs.loanYears,
    inputs.countryCode
  );
  const monthlySavings = Math.max(25, Math.round(currentPI - discountedPI));
  const formattedSavingsNumber = new Intl.NumberFormat(
    country.useIndianNumberFormat ? "en-IN" : "en-US",
    { maximumFractionDigits: 0 }
  ).format(monthlySavings);
  const total = Math.max(1, result.totalMonthlyPayment);
  const piSharePct = Math.min(
    100,
    Math.max(12, (result.monthlyPrincipalAndInterest / total) * 100)
  );

  // SVG Ring geometry
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (piSharePct / 100) * circumference;

  // Compute Pinned Delta if pinned
  const monthlyDelta = pinnedScenario
    ? result.totalMonthlyPayment - pinnedScenario.totalMonthlyPayment
    : 0;
  const interestDelta = pinnedScenario
    ? result.acceleratedTotalInterest - pinnedScenario.acceleratedTotalInterest
    : 0;

  // Front-end DTI badge config
  const dtiBadgeConfig = {
    comfortable: {
      bg: "bg-emerald-500/15 border-emerald-400/40 text-emerald-300",
      dot: "bg-emerald-400",
      label: "Comfortable (<28%)",
    },
    moderate: {
      bg: "bg-amber-500/15 border-amber-400/40 text-amber-300",
      dot: "bg-amber-400",
      label: "Moderate (28–36%)",
    },
    risk: {
      bg: "bg-rose-500/20 border-rose-400/50 text-rose-300",
      dot: "bg-rose-400",
      label: "House-Poor Risk (>36%)",
    },
  }[result.dtiComfortLevel];

  const commitIncomeEdit = () => {
    setEditingIncome(false);
    const parsed = parseFloat(incomeDraft.replace(/[^0-9.]/g, ""));
    if (!Number.isNaN(parsed) && parsed > 0) {
      onUpdateInputs({ grossMonthlyIncome: parsed });
    }
  };

  return (
    <section
      aria-label="Monthly Payment Breakdown"
      className="w-full rounded-[38px] bg-[#130936] shadow-[0_24px_60px_rgba(19,9,54,0.38)] border border-white/15 overflow-hidden flex flex-col justify-between"
    >
      {/* Top Indigo Section (#130936) */}
      <div className="p-5 sm:p-7 pb-6 text-white relative">
        {/* Card Header: Menu Button, Scenario Pinning Button, Country Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Open tools drawer"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/85 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Pin to Compare Button */}
          <button
            type="button"
            onClick={onTogglePinScenario}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all border ${
              pinnedScenario
                ? "bg-[#A82FFC] border-[#C46BFF] text-white shadow-[0_0_16px_rgba(168,47,252,0.55)]"
                : "bg-white/10 hover:bg-white/15 border-white/15 text-white/90"
            }`}
          >
            {pinnedScenario ? (
              <>
                <PinOff className="w-3.5 h-3.5" />
                <span>Pinned · Clear</span>
              </>
            ) : (
              <>
                <Pin className="w-3.5 h-3.5 text-[#C46BFF]" />
                <span>Pin to Compare</span>
              </>
            )}
          </button>

          {/* Country Badge */}
          <div className="h-9 px-3 rounded-xl bg-white/10 border border-white/10 inline-flex items-center gap-1.5 text-xs font-bold">
            <span>{country.flag}</span>
            <span>{country.currencyCode}</span>
          </div>
        </div>

        {/* Glowing Purple Circular Progress Ring */}
        <div className="relative flex flex-col items-center justify-center my-2">
          <div className="relative w-52 h-52 flex items-center justify-center">
            <svg
              className="w-full h-full -rotate-90 transform overflow-visible"
              viewBox="0 0 200 200"
            >
              <defs>
                <filter
                  id="purpleNeonGlow"
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="160%"
                >
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="7"
                    floodColor="#A82FFC"
                    floodOpacity="0.85"
                  />
                </filter>
                <linearGradient
                  id="ringGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#A82FFC" />
                  <stop offset="100%" stopColor="#D688FF" />
                </linearGradient>
              </defs>

              {/* Background Track Circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="14"
                fill="transparent"
              />

              {/* Secondary Taxes/Escrow Ring Segment */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="rgba(59, 122, 46, 0.45)"
                strokeWidth="14"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={0}
              />

              {/* Primary Glowing Purple Ring (#A82FFC) */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="url(#ringGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                fill="transparent"
                filter="url(#purpleNeonGlow)"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-out"
              />
            </svg>

            {/* Center Payment Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-white/60">
                {isIslamic ? "Monthly Co-Ownership" : "Monthly Payment"}
              </span>
              <div className="text-2xl sm:text-[28px] font-black tracking-tight text-white mt-0.5 leading-tight">
                {formatCurrency(result.totalMonthlyPayment, country)}
              </div>
              <span className="mt-1 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-[#D688FF]">
                {piSharePct.toFixed(0)}%{" "}
                {isIslamic ? "Equity + Rent" : "Principal & Int."}
              </span>
            </div>
          </div>

          {/* Scenario Pinning Real-Time Delta Badge with Emerald-400 / Rose-400 Color Styling */}
          {pinnedScenario && (
            <div className="mt-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-extrabold shadow-[0_0_20px_rgba(168,47,252,0.35)] animate-fadeIn">
              {monthlyDelta < -0.5 ? (
                <span className="text-emerald-400">
                  Save {formatCurrency(Math.abs(monthlyDelta), country)}/mo ·{" "}
                  {formatCurrency(Math.abs(interestDelta), country, {
                    compact: true,
                  })}{" "}
                  {isIslamic ? "rental" : "interest"} vs Pinned
                </span>
              ) : monthlyDelta > 0.5 ? (
                <span className="text-rose-400">
                  +{formatCurrency(Math.abs(monthlyDelta), country)}/mo · +
                  {formatCurrency(Math.abs(interestDelta), country, {
                    compact: true,
                  })}{" "}
                  {isIslamic ? "rental" : "interest"} vs Pinned
                </span>
              ) : (
                <span className="text-white/85">
                  Matches Pinned Scenario ({formatCurrency(0, country)}/mo
                  delta)
                </span>
              )}
            </div>
          )}

          {/* Income Comfort / Front-End DTI Pill */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <div
              className={`px-3 py-1 rounded-full border text-[11px] font-bold inline-flex items-center gap-1.5 ${dtiBadgeConfig.bg}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${dtiBadgeConfig.dot}`}
              />
              <span>
                Front-End DTI: {result.frontEndDtiPct.toFixed(1)}% ·{" "}
                {dtiBadgeConfig.label}
              </span>
            </div>

            {editingIncome ? (
              <div className="inline-flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-full border border-[#C46BFF]">
                <span className="text-[10px] text-white/70">Income:</span>
                <input
                  type="text"
                  inputMode="decimal"
                  autoFocus
                  value={incomeDraft}
                  onChange={(e) => setIncomeDraft(e.target.value)}
                  onBlur={commitIncomeEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitIncomeEdit();
                  }}
                  aria-label="Gross monthly income"
                  className="w-20 bg-transparent text-[11px] font-bold text-white focus:outline-none"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIncomeDraft(String(Math.round(inputs.grossMonthlyIncome)));
                  setEditingIncome(true);
                }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-[11px] font-semibold text-white/80 inline-flex items-center gap-1 transition-colors"
                title="Click to edit Gross Monthly Income"
              >
                <span>
                  Income:{" "}
                  {formatCurrency(inputs.grossMonthlyIncome, country, {
                    compact: true,
                  })}
                  /mo
                </span>
                <Pencil className="w-2.5 h-2.5 opacity-70" />
              </button>
            )}
          </div>

          {/* High-Intent Conversion Banner (Between Front-End DTI Badge and Bottom White Sheet) */}
          <div className="mt-4 w-full rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#1E1050]/80 to-purple-900/50 border border-[#A82FFC]/30 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_8px_24px_rgba(19,9,54,0.4)]">
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="truncate">
                  Live Lenders Active in {country.name}
                </span>
              </div>
              <div className="text-xs sm:text-[13px] font-extrabold text-white mt-0.5 leading-snug">
                Unlock rates from {unlockedRate.toFixed(2)}% (Save ~
                {country.currencySymbol}
                {formattedSavingsNumber}/mo)
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenLeadModal}
              className="w-full sm:w-auto shrink-0 bg-[#A82FFC] hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-[0_0_12px_rgba(168,47,252,0.4)] whitespace-nowrap text-center"
            >
              Check Pre-Approval →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Rounded Crisp White Sheet (#F4F7F8, rounded-t-[32px]) */}
      <div className="bg-[#F4F7F8] rounded-t-[32px] p-5 sm:p-6 text-[#130936] flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#130936]/60">
              Payment Breakdown
            </span>
            <span className="text-[11px] font-semibold text-[#130936]/55">
              Tap tax/fees to edit inline
            </span>
          </div>

          {/* 1. Principal & Interest / Equity Buyout (Purple #A82FFC) */}
          <EditableCostRow
            badgeColor="#A82FFC"
            label={
              isIslamic
                ? "Equity Buyout + Bank Rental"
                : "Principal & Interest"
            }
            sublabel={
              isIslamic
                ? `Buyout: ${formatCurrency(
                    result.monthlyFirstPeriodPrincipal,
                    country
                  )} + Rent: ${formatCurrency(
                    result.monthlyFirstPeriodRentOrInterest,
                    country
                  )}`
                : country.code === "CA" && result.cmhcPremiumAmount > 0
                ? `Loan: ${formatCurrency(
                    result.loanAmount,
                    country
                  )} (incl. +${formatCurrency(
                    result.cmhcPremiumAmount,
                    country,
                    { compact: true }
                  )} CMHC)`
                : `Loan: ${formatCurrency(
                    result.loanAmount,
                    country
                  )} @ ${inputs.interestRate.toFixed(2)}%`
            }
            value={result.monthlyPrincipalAndInterest}
            country={country}
            readOnly
          />

          {/* 2. Homeowner's Insurance / Takaful (Green #3B7A2E, editable inline input) */}
          <EditableCostRow
            badgeColor="#3B7A2E"
            label={
              isIslamic
                ? country.labels.islamicInsurance
                : country.labels.insurance
            }
            sublabel="Hazard & Structure Protection"
            value={inputs.insuranceMonthly}
            country={country}
            onChange={(val) => onUpdateInputs({ insuranceMonthly: val })}
          />

          {/* 3. Property / Cantt / Council Tax (Red #EF4444, editable inline input) */}
          <EditableCostRow
            badgeColor="#EF4444"
            label={country.labels.propertyTax}
            sublabel="Local Municipal Assessment"
            value={inputs.propertyTaxMonthly}
            country={country}
            onChange={(val) => onUpdateInputs({ propertyTaxMonthly: val })}
          />

          {/* 4. HOA / Society / Service Charges (Amber #F59E0B, editable inline input) */}
          <EditableCostRow
            badgeColor="#F59E0B"
            label={country.labels.hoa}
            sublabel="Community & Maintenance"
            value={inputs.hoaMonthly}
            country={country}
            onChange={(val) => onUpdateInputs({ hoaMonthly: val })}
          />

          {/* 5. Auto-calculated PMI / Canadian CMHC Default Insurance Row (Never shown in SG) */}
          {result.isPmiApplicable && !isIslamic && (
            <EditableCostRow
              badgeColor="#6366F1"
              label={result.pmiLabel}
              sublabel={
                country.code === "CA"
                  ? `${result.pmiSublabel} · +${formatCurrency(
                      result.cmhcPremiumAmount,
                      country
                    )} in P&I`
                  : result.pmiSublabel
              }
              value={
                country.code === "CA"
                  ? result.cmhcMonthlyImpact
                  : result.monthlyPmi
              }
              country={country}
              readOnly
              rightAction={
                <button
                  type="button"
                  onClick={() =>
                    onUpdateInputs({ pmiAutoEnabled: !inputs.pmiAutoEnabled })
                  }
                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase transition-colors ${
                    inputs.pmiAutoEnabled
                      ? "bg-[#A82FFC] text-white"
                      : "bg-[#130936]/10 text-[#130936]/60"
                  }`}
                >
                  {inputs.pmiAutoEnabled
                    ? country.code === "CA"
                      ? "In P&I"
                      : "Auto"
                    : "Off"}
                </button>
              }
            />
          )}
        </div>

        {/* Cash-to-Close Pill */}
        <div className="rounded-2xl bg-white p-3.5 border border-[#130936]/10 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#130936]/5 flex items-center justify-center text-[#130936]">
                <Briefcase className="w-4 h-4 text-[#A82FFC]" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#130936]">
                  Estimated Cash-to-Close
                </div>
                <div className="text-[10px] font-medium text-[#130936]/60">
                  Down payment + {country.labels.stampOrTransferTax}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-[#130936]">
                {formatCurrency(
                  result.closingCosts.totalCashToClose,
                  country
                )}
              </div>
              <div className="text-[10px] font-semibold text-[#A82FFC]">
                Fees:{" "}
                {formatCurrency(
                  result.closingCosts.transferOrStampTax +
                    result.closingCosts.closingOrAgencyFees,
                  country,
                  { compact: true }
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons: Recalculate CTA (#130936) & Amortization Schedule Trigger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 safe-bottom-cta">
          <button
            type="button"
            onClick={onOpenAmortization}
            className="h-12 px-4 rounded-2xl bg-white hover:bg-[#A82FFC]/10 text-[#130936] border border-[#130936]/15 font-extrabold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#A82FFC]" />
            <span>Loan Summary & PDF</span>
          </button>

          <button
            type="button"
            onClick={onRecalculateReset}
            className="h-12 px-4 rounded-2xl bg-[#130936] hover:bg-[#1e1050] text-white font-extrabold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_rgba(19,9,54,0.25)]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C46BFF]" />
            <span>Recalculate</span>
          </button>
        </div>
      </div>
    </section>
  );
}
