"use client";

import React from "react";
import {
  X,
  Home,
  Calculator,
  Wallet,
  RefreshCw,
  Globe,
  Moon,
  ShieldCheck,
  FileText,
  Sparkles,
} from "lucide-react";
import {
  CalculatorTab,
  CountryCode,
  CountryProfile,
  FinancingMode,
} from "@/lib/types";
import { COUNTRY_LIST } from "@/lib/countries";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: CalculatorTab;
  onSelectTab: (tab: CalculatorTab) => void;
  country: CountryProfile;
  onSelectCountry: (code: CountryCode) => void;
  financingMode: FinancingMode;
  onToggleFinancingMode: (mode: FinancingMode) => void;
  onOpenAmortization: () => void;
}

export default function NavigationDrawer({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  country,
  onSelectCountry,
  financingMode,
  onToggleFinancingMode,
  onOpenAmortization,
}: NavigationDrawerProps) {
  if (!isOpen) return null;

  const tools: {
    id: CalculatorTab;
    label: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "mortgage",
      label: "Mortgage Command Center",
      desc: "Full P&I, Taxes, PMI & Early Payoff",
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: "loan_emi",
      label: "Loan EMI Calculator",
      desc: "Pure principal & interest amortization",
      icon: <Calculator className="w-4 h-4" />,
    },
    {
      id: "affordability",
      label: "Income & Affordability",
      desc: "Front-end DTI & maximum property budget",
      icon: <Wallet className="w-4 h-4" />,
    },
    {
      id: "refinance",
      label: "Refinance Break-Even",
      desc: "Compare existing rate vs new rate savings",
      icon: <RefreshCw className="w-4 h-4" />,
    },
    {
      id: "rates_fx",
      label: "Global Rates & FX Hub",
      desc: "Central bank benchmarks & currency converter",
      icon: <Globe className="w-4 h-4" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#130936]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <aside className="relative z-10 w-80 max-w-[85vw] bg-[#130936] text-white h-full flex flex-col justify-between p-5 border-r border-white/15 shadow-2xl overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#A82FFC] flex items-center justify-center shadow-[0_0_15px_rgba(168,47,252,0.6)]">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-extrabold text-base tracking-tight flex items-center gap-1.5">
                  Mortafy
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 uppercase font-bold text-[#C46BFF]">
                    Pro
                  </span>
                </div>
                <p className="text-[11px] text-white/60">
                  Mortgage intelligence, simplified.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Financing Mode Switch */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2">
              Financing Structure
            </div>
            <div className="grid grid-cols-2 gap-1.5 bg-white/10 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => onToggleFinancingMode("conventional")}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
                  financingMode === "conventional"
                    ? "bg-[#A82FFC] text-white shadow"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Conventional
              </button>
              <button
                type="button"
                onClick={() => onToggleFinancingMode("islamic")}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  financingMode === "islamic"
                    ? "bg-[#A82FFC] text-white shadow"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                Musharakah
              </button>
            </div>
          </div>

          {/* Financial Tools List */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2">
              Financial Calculators
            </div>
            <div className="space-y-1.5">
              {tools.map((tool) => {
                const isActive = activeTab === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(tool.id);
                      onClose();
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                      isActive
                        ? "bg-[#A82FFC] text-white shadow-[0_4px_15px_rgba(168,47,252,0.4)]"
                        : "bg-white/5 hover:bg-white/10 text-white/85"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isActive ? "bg-white/20" : "bg-white/10 text-[#C46BFF]"
                      }`}
                    >
                      {tool.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{tool.label}</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          isActive ? "text-white/85" : "text-white/55"
                        }`}
                      >
                        {tool.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Amortization & White-Label PDF Trigger */}
          <div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAmortization();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#A82FFC]/30 to-[#C46BFF]/20 border border-[#A82FFC]/50 hover:border-[#A82FFC] text-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#C46BFF]" />
                <div className="text-left">
                  <div className="text-xs font-bold">
                    Amortization & PDF Report
                  </div>
                  <div className="text-[10px] text-white/65">
                    White-label client export
                  </div>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-[#C46BFF]" />
            </button>
          </div>

          {/* Jurisdiction Quick Switch */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2">
              Active Market ({country.name})
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {COUNTRY_LIST.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => onSelectCountry(c.code)}
                  className={`flex flex-col items-center justify-center py-2 rounded-xl border text-xs font-bold transition-all ${
                    c.code === country.code
                      ? "bg-[#A82FFC] border-[#C46BFF] text-white"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="text-[10px] mt-0.5">{c.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Compliance Note */}
        <div className="pt-4 border-t border-white/10 mt-6">
          <div className="flex items-center gap-2 text-[11px] text-white/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Multi-Jurisdictional Engine v2.5</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
