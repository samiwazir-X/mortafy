"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Home,
  ChevronDown,
  Compass,
  Check,
  Sparkles,
} from "lucide-react";
import { CalculatorTab, CountryCode, CountryProfile } from "@/lib/types";
import { COUNTRY_LIST } from "@/lib/countries";

interface HeaderBarProps {
  country: CountryProfile;
  onSelectCountry: (code: CountryCode) => void;
  onAutoDetectCountry: () => void;
  activeTab: CalculatorTab;
  onSelectTab: (tab: CalculatorTab) => void;
  onOpenDrawer: () => void;
}

const NAV_TABS: { id: CalculatorTab; label: string }[] = [
  { id: "mortgage", label: "Mortgage" },
  { id: "loan_emi", label: "Loan EMI" },
  { id: "affordability", label: "Affordability" },
  { id: "refinance", label: "Refinance" },
  { id: "rates_fx", label: "Rates & FX" },
];

export default function HeaderBar({
  country,
  onSelectCountry,
  onAutoDetectCountry,
  activeTab,
  onSelectTab,
  onOpenDrawer,
}: HeaderBarProps) {
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#130936]/95 backdrop-blur-md border-b border-white/10 shadow-[0_8px_30px_rgba(19,9,54,0.35)] safe-top print:hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 h-16 flex items-center justify-between gap-2">
        {/* Left Cluster: Hamburger + Mortafy Single-Line Brand Pill */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Hamburger Button: strictly w-10 h-10 */}
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Open navigation menu"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-white transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mortafy Single-Line Brand Pill: strictly h-10 */}
          <button
            type="button"
            onClick={() => onSelectTab("mortgage")}
            className="h-10 px-3.5 inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-[#A82FFC] text-white transition-colors whitespace-nowrap shrink-0 group"
          >
            <Home className="w-4 h-4 text-[#A82FFC] group-hover:text-white transition-colors shrink-0" />
            <span className="font-extrabold tracking-tight text-[15px] text-white whitespace-nowrap">
              Mortafy
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#A82FFC]/30 group-hover:bg-white/20 text-white border border-white/15">
              Global
            </span>
          </button>
        </div>

        {/* Center Cluster: Navigation Tabs (strictly h-10 container) */}
        <nav
          aria-label="Calculator modes"
          className="hidden lg:inline-flex h-10 items-center bg-white/10 p-1 rounded-xl gap-1 shrink-0"
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`h-8 px-3 rounded-lg text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-[#A82FFC] text-white shadow-[0_2px_10px_rgba(168,47,252,0.5)]"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Cluster: Updated Date & Rate List Badge + Glassmorphic Country Selector */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Updated Date & Rate List Badge: strictly h-10 */}
          <button
            type="button"
            onClick={() => onSelectTab("rates_fx")}
            title="View Central Bank & Local Lender Rates"
            className="hidden md:inline-flex h-10 items-center gap-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors whitespace-nowrap shrink-0"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-white/80 whitespace-nowrap">
              {country.lastUpdated}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#A82FFC]/30 border border-[#A82FFC]/50 text-[11px] font-bold text-white whitespace-nowrap">
              {country.centralBankCode} {country.centralBankRate.toFixed(2)}%
            </span>
          </button>

          {/* Glassmorphic Country Selector: strictly h-10 */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setCountryDropdownOpen((prev) => !prev)}
              aria-expanded={countryDropdownOpen}
              className="h-10 px-3 inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all whitespace-nowrap shrink-0"
            >
              <span className="text-base leading-none">{country.flag}</span>
              <span className="hidden sm:inline text-xs font-bold tracking-tight text-white whitespace-nowrap">
                {country.name}
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[11px] font-semibold text-white/90 whitespace-nowrap">
                {country.currencyCode} ({country.currencySymbol.trim()})
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/70 transition-transform ${
                  countryDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Country Picker Dropdown Modal */}
            {countryDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#130936]/95 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-50 text-white">
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-white/10 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                    Select Jurisdiction (11 Markets)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onAutoDetectCountry();
                      setCountryDropdownOpen(false);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#A82FFC]/25 hover:bg-[#A82FFC] text-[11px] font-semibold text-white transition-colors"
                  >
                    <Compass className="w-3 h-3" />
                    Auto-Detect
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1 pr-0.5">
                  {COUNTRY_LIST.map((item) => {
                    const isSelected = item.code === country.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          onSelectCountry(item.code);
                          setCountryDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                          isSelected
                            ? "bg-[#A82FFC] text-white"
                            : "hover:bg-white/10 text-white/85"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg shrink-0">{item.flag}</span>
                          <div className="truncate">
                            <div className="text-xs font-bold truncate">
                              {item.name}
                            </div>
                            <div
                              className={`text-[10px] truncate ${
                                isSelected ? "text-white/85" : "text-white/55"
                              }`}
                            >
                              {item.centralBankCode} {item.centralBankRate}% ·{" "}
                              {item.compounding === "semi-annual"
                                ? "Semi-Annual Law"
                                : "Monthly Comp."}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-white/10 text-white/80"
                            }`}
                          >
                            {item.currencyCode} ({item.currencySymbol.trim()})
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-white/10 px-2 flex items-center gap-1.5 text-[10px] text-white/50">
                  <Sparkles className="w-3 h-3 text-[#A82FFC] shrink-0" />
                  <span>
                    Localizes taxes, Stamp Duty/DLD, & Sharia Musharakah
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
