"use client";

import React, { useState } from "react";
import {
  Globe,
  ArrowLeftRight,
  Landmark,
  CheckCircle2,
  ArrowUpRight,
  Moon,
  Sparkles,
} from "lucide-react";
import {
  CountryCode,
  CountryProfile,
  FinancingMode,
} from "@/lib/types";
import { COUNTRIES, COUNTRY_LIST, formatCurrency } from "@/lib/countries";

interface RatesFxViewProps {
  activeCountry: CountryProfile;
  financingMode: FinancingMode;
  onSelectCountry: (code: CountryCode) => void;
  onApplyBankRate: (
    countryCode: CountryCode,
    rate: number,
    mode: FinancingMode
  ) => void;
}

export default function RatesFxView({
  activeCountry,
  financingMode,
  onSelectCountry,
  onApplyBankRate,
}: RatesFxViewProps) {
  const [fxAmount, setFxAmount] = useState<number>(100000);
  const [fromCode, setFromCode] = useState<CountryCode>("US");
  const [toCode, setToCode] = useState<CountryCode>(
    activeCountry.code === "US" ? "AE" : activeCountry.code
  );

  const fromCountry = COUNTRIES[fromCode];
  const toCountry = COUNTRIES[toCode];

  // Convert via USD base rate
  const amountInUsd = fxAmount / fromCountry.fxPerUsd;
  const convertedAmount = amountInUsd * toCountry.fxPerUsd;
  const exchangeRate = toCountry.fxPerUsd / fromCountry.fxPerUsd;

  const swapCurrencies = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Grid: Central Bank Rate Matrix + Cross-Border FX Converter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: 11-Country Central Bank Benchmark Matrix */}
        <div className="lg:col-span-7 bg-[#C2D1D4] rounded-[34px] p-5 sm:p-6 shadow-[0_20px_50px_rgba(19,9,54,0.2)] border border-white/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#130936] flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#A82FFC]" />
                <span>Central Bank Policy Benchmarks (11 Markets)</span>
              </h2>
              <p className="text-xs text-[#130936]/65 mt-0.5">
                Select any market to inspect local lenders & compounding laws
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#130936] text-white text-[11px] font-bold">
              Live Oct 2026
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {COUNTRY_LIST.map((c) => {
              const isSelected = c.code === activeCountry.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => onSelectCountry(c.code)}
                  className={`p-3.5 rounded-2xl text-left transition-all flex items-center justify-between border ${
                    isSelected
                      ? "bg-[#130936] text-white border-[#A82FFC] shadow-[0_8px_25px_rgba(19,9,54,0.3)]"
                      : "bg-white hover:bg-white/90 text-[#130936] border-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{c.flag}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold truncate flex items-center gap-1.5">
                        <span>{c.name}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C46BFF] shrink-0" />
                        )}
                      </div>
                      <div
                        className={`text-[10px] truncate ${
                          isSelected ? "text-white/65" : "text-[#130936]/55"
                        }`}
                      >
                        {c.centralBankName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <div
                      className={`text-sm font-black ${
                        isSelected ? "text-[#C46BFF]" : "text-[#A82FFC]"
                      }`}
                    >
                      {c.centralBankRate.toFixed(2)}%
                    </div>
                    <div
                      className={`text-[10px] font-bold ${
                        isSelected ? "text-white/60" : "text-[#130936]/50"
                      }`}
                    >
                      {c.centralBankCode}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Expat & Cross-Border Property FX Converter */}
        <div className="lg:col-span-5 bg-[#130936] text-white rounded-[34px] p-5 sm:p-6 shadow-[0_20px_50px_rgba(19,9,54,0.35)] border border-white/15 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#A82FFC]/25 flex items-center justify-center text-[#C46BFF]">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold">
                    Cross-Border Property FX
                  </h2>
                  <p className="text-[11px] text-white/60">
                    Convert down payments & property prices
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[10px] font-bold text-emerald-300">
                Mid-Market FX
              </span>
            </div>

            {/* Source Amount Input */}
            <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
              <div className="flex items-center justify-between text-[11px] text-white/65 mb-1">
                <span>Source Amount</span>
                <span>Currency: {fromCountry.currencyCode}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="number"
                  value={fxAmount}
                  onChange={(e) =>
                    setFxAmount(Math.max(0, parseFloat(e.target.value) || 0))
                  }
                  aria-label="Source FX Amount"
                  className="w-full bg-transparent text-xl font-black text-white focus:outline-none"
                />
                <select
                  value={fromCode}
                  onChange={(e) => setFromCode(e.target.value as CountryCode)}
                  aria-label="Source Currency"
                  className="bg-[#130936] text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/20 focus:outline-none"
                >
                  {COUNTRY_LIST.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.currencyCode}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-white/65 font-semibold">
                1 {fromCountry.currencyCode} = {exchangeRate.toFixed(4)}{" "}
                {toCountry.currencyCode}
              </span>
              <button
                type="button"
                onClick={swapCurrencies}
                className="px-3 py-1.5 rounded-xl bg-[#A82FFC] hover:bg-[#9122e0] text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Swap</span>
              </button>
            </div>

            {/* Converted Result */}
            <div className="bg-gradient-to-br from-[#A82FFC]/30 to-white/5 rounded-2xl p-4 border border-[#C46BFF]/40">
              <div className="flex items-center justify-between text-[11px] text-white/75 mb-1">
                <span>Converted Property / Deposit Equivalent</span>
                <select
                  value={toCode}
                  onChange={(e) => setToCode(e.target.value as CountryCode)}
                  aria-label="Target Currency"
                  className="bg-[#130936] text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/20 focus:outline-none"
                >
                  {COUNTRY_LIST.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.currencyCode}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-2xl font-black text-white tracking-tight mt-1">
                {formatCurrency(convertedAmount, toCountry)}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
            <span>Ideal for overseas diaspora & expat investors</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C46BFF]" />
          </div>
        </div>
      </div>

      {/* Bottom Section: Active Country Lender & Islamic Musharakah Rate Sheet */}
      <div className="bg-[#F4F7F8] rounded-[34px] p-5 sm:p-7 shadow-[0_20px_50px_rgba(19,9,54,0.18)] border border-white">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeCountry.flag}</span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#130936]">
                {activeCountry.name} Featured Mortgage & Musharakah Products
              </h3>
            </div>
            <p className="text-xs text-[#130936]/65 mt-0.5">
              Click any institutional product to load its rate directly into your
              calculator
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-[#130936] text-white text-xs font-bold">
            Benchmark: {activeCountry.centralBankName} (
            {activeCountry.centralBankRate}%)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeCountry.bankOffers.map((offer) => (
            <div
              key={offer.bankName + offer.productName}
              className="bg-white rounded-2xl p-4 border border-[#130936]/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-extrabold text-[#130936]">
                    {offer.bankName}
                  </div>
                  <div className="text-xs font-semibold text-[#130936]/60">
                    {offer.productName}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#F4F7F8] text-[11px] font-bold text-[#130936]">
                  Max LTV: {offer.maxLtvPct}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    onApplyBankRate(
                      activeCountry.code,
                      offer.conventionalRate,
                      "conventional"
                    )
                  }
                  className="p-2.5 rounded-xl bg-[#F4F7F8] hover:bg-[#130936] hover:text-white text-[#130936] transition-all text-left group"
                >
                  <div className="text-[10px] font-bold uppercase opacity-65 flex items-center justify-between">
                    <span>Conventional Rate</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                  <div className="text-base font-black mt-0.5">
                    {offer.conventionalRate.toFixed(2)}%
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onApplyBankRate(
                      activeCountry.code,
                      offer.islamicRate,
                      "islamic"
                    )
                  }
                  className="p-2.5 rounded-xl bg-[#A82FFC]/10 hover:bg-[#A82FFC] hover:text-white text-[#130936] transition-all text-left group"
                >
                  <div className="text-[10px] font-bold uppercase text-[#A82FFC] group-hover:text-white flex items-center justify-between">
                    <span className="inline-flex items-center gap-1">
                      <Moon className="w-3 h-3" />
                      Musharakah
                    </span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                  <div className="text-base font-black mt-0.5">
                    {offer.islamicRate.toFixed(2)}%
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#130936]/55 pt-1 border-t border-[#130936]/5">
                <span>Rep. APR: {offer.aprOrRepresentative.toFixed(2)}%</span>
                <span>{offer.processingFeeText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
