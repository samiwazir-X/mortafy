"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  Calendar,
  FileSpreadsheet,
  ShieldCheck,
  UserCheck,
  Building2,
  Home,
} from "lucide-react";
import {
  CountryProfile,
  MortgageCalculationResult,
  MortgageInputs,
} from "@/lib/types";
import { formatCurrency } from "@/lib/countries";

interface AmortizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: MortgageInputs;
  country: CountryProfile;
  result: MortgageCalculationResult;
}

export default function AmortizationModal({
  isOpen,
  onClose,
  inputs,
  country,
  result,
}: AmortizationModalProps) {
  const [viewMode, setViewMode] = useState<"annual" | "monthly">("annual");
  const [clientName, setClientName] = useState("Valued Client");
  const [brokerName, setBrokerName] = useState(
    "Mortafy Advisory · Lic #MTF-99420"
  );

  if (!isOpen) return null;

  const isIslamic = inputs.financingMode === "islamic";

  const handlePrintPdf = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-[#130936]/75 backdrop-blur-md print:static print:block print:bg-white print:p-0">
      <div className="mortafy-print-root relative w-full max-w-5xl bg-white rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.45)] border border-white/20 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:rounded-none">
        {/* Top Modal Header (Screen + Print Brand Header) */}
        <div className="bg-[#130936] text-white px-5 sm:px-7 py-4 flex flex-wrap items-center justify-between gap-3 print:bg-white print:text-slate-900 print:border-b-2 print:border-slate-900 print:px-0">
          <div>
            <div className="flex items-center gap-2">
              <Home className="hidden print:inline-block w-5 h-5 text-slate-900" />
              <FileSpreadsheet className="w-5 h-5 text-[#C46BFF] print:hidden" />
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight print:text-slate-900">
                <span className="hidden print:inline">Mortafy — </span>
                {isIslamic
                  ? "Diminishing Musharakah Equity & Rental Schedule"
                  : "Official Loan Amortization Schedule"}
              </h2>
            </div>
            <p className="text-xs text-white/65 print:text-slate-700 mt-0.5">
              {country.flag} {country.name} ({country.currencyCode}) ·{" "}
              {country.compounding === "semi-annual"
                ? "Canadian Semi-Annual Compounding (Interest Act)"
                : "Standard Monthly Compounding"}{" "}
              · Payoff by {result.payoffDateFormatted}
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden no-print">
            {/* View Toggle: Annual vs Monthly */}
            <div className="inline-flex bg-white/10 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("annual")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "annual"
                    ? "bg-[#A82FFC] text-white"
                    : "text-white/75 hover:text-white"
                }`}
              >
                Annual View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("monthly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "monthly"
                    ? "bg-[#A82FFC] text-white"
                    : "text-white/75 hover:text-white"
                }`}
              >
                Monthly ({result.acceleratedTermMonths} mos)
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="px-3.5 py-2 rounded-xl bg-[#A82FFC] hover:bg-[#9122e0] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* White-Label Client & Broker Header Bar */}
        <div className="bg-[#F4F7F8] print:bg-white px-5 sm:px-7 print:px-0 py-3.5 border-b border-[#130936]/10 print:border-slate-300 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#130936]/10 print:border-slate-300">
            <UserCheck className="w-4 h-4 text-[#A82FFC] print:text-slate-900 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold uppercase text-[#130936]/50 print:text-slate-600">
                Prepared For (Client Name)
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full text-xs font-extrabold text-[#130936] print:text-slate-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#130936]/10 print:border-slate-300">
            <Building2 className="w-4 h-4 text-[#A82FFC] print:text-slate-900 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-bold uppercase text-[#130936]/50 print:text-slate-600">
                Prepared By / Broker License #
              </label>
              <input
                type="text"
                value={brokerName}
                onChange={(e) => setBrokerName(e.target.value)}
                className="w-full text-xs font-extrabold text-[#130936] print:text-slate-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl border border-[#130936]/10 print:border-slate-300">
            <div>
              <div className="text-[10px] font-bold uppercase text-[#130936]/50 print:text-slate-600">
                Total Monthly Outflow
              </div>
              <div className="text-sm font-black text-[#130936] print:text-slate-900">
                {formatCurrency(result.totalMonthlyPayment, country)}/mo
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase text-[#130936]/50 print:text-slate-600">
                {isIslamic ? "Total Rental Saved" : "Total Interest Saved"}
              </div>
              <div className="text-sm font-black text-emerald-600 print:text-slate-900">
                {formatCurrency(result.interestSaved, country)}
              </div>
            </div>
          </div>
        </div>

        {/* Key Executive Metrics & Monthly Breakdown Summary Strip */}
        <div className="px-5 sm:px-7 print:px-0 py-3 bg-white border-b border-[#130936]/10 print:border-slate-300 space-y-2.5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <span className="text-[#130936]/55 print:text-slate-600 block text-[11px]">
                Property Valuation
              </span>
              <strong className="text-[#130936] print:text-slate-900 font-extrabold text-sm">
                {formatCurrency(inputs.homePrice, country)}
              </strong>
            </div>
            <div>
              <span className="text-[#130936]/55 print:text-slate-600 block text-[11px]">
                Financed Principal
              </span>
              <strong className="text-[#130936] print:text-slate-900 font-extrabold text-sm">
                {formatCurrency(result.loanAmount, country)}
              </strong>
            </div>
            <div>
              <span className="text-[#130936]/55 print:text-slate-600 block text-[11px]">
                {isIslamic ? "Annual Rental Rate" : "Interest Rate"}
              </span>
              <strong className="text-[#A82FFC] print:text-slate-900 font-extrabold text-sm">
                {inputs.interestRate.toFixed(2)}% ({inputs.loanYears} Yrs)
              </strong>
            </div>
            <div>
              <span className="text-[#130936]/55 print:text-slate-600 block text-[11px]">
                Cumulative {isIslamic ? "Rental Profit" : "Interest"}
              </span>
              <strong className="text-[#130936] print:text-slate-900 font-extrabold text-sm">
                {formatCurrency(result.acceleratedTotalInterest, country)}
              </strong>
            </div>
            <div>
              <span className="text-[#130936]/55 print:text-slate-600 block text-[11px]">
                Est. Cash-to-Close
              </span>
              <strong className="text-[#130936] print:text-slate-900 font-extrabold text-sm">
                {formatCurrency(result.closingCosts.totalCashToClose, country)}
              </strong>
            </div>
          </div>

          {/* Monthly Breakdown Summary Bar (Visible on Screen & Print) */}
          <div className="pt-2 border-t border-[#130936]/10 print:border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#130936]/75 print:text-slate-800">
            <span>
              <strong>
                {isIslamic ? "Equity + Rent:" : "Principal & Interest:"}
              </strong>{" "}
              {formatCurrency(result.monthlyPrincipalAndInterest, country)}/mo
            </span>
            <span>
              <strong>
                {isIslamic
                  ? country.labels.islamicInsurance
                  : country.labels.insurance}
                :
              </strong>{" "}
              {formatCurrency(result.monthlyInsurance, country)}/mo
            </span>
            <span>
              <strong>{country.labels.propertyTax}:</strong>{" "}
              {formatCurrency(result.monthlyPropertyTax, country)}/mo
            </span>
            <span>
              <strong>{country.labels.hoa}:</strong>{" "}
              {formatCurrency(result.monthlyHoa, country)}/mo
            </span>
            {result.isPmiApplicable && !isIslamic && (
              <span>
                <strong>{result.pmiLabel}:</strong>{" "}
                {formatCurrency(
                  country.code === "CA"
                    ? result.cmhcMonthlyImpact
                    : result.monthlyPmi,
                  country
                )}
                /mo
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Amortization Schedule Table */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 print:px-0 py-4 print:overflow-visible">
          {viewMode === "annual" ? (
            <table
              dir="ltr"
              className="mortafy-print-table w-full text-left border-collapse text-xs tabular-nums"
            >
              <thead>
                <tr className="border-b-2 border-[#130936]/15 print:border-slate-900 text-[#130936]/65 print:text-slate-900 uppercase text-[10px] font-extrabold">
                  <th className="py-2.5 px-2 whitespace-nowrap">Year</th>
                  <th className="py-2.5 px-2 whitespace-nowrap">
                    {isIslamic ? "Equity Buyout" : "Principal Paid"}
                  </th>
                  <th className="py-2.5 px-2 whitespace-nowrap">
                    {isIslamic ? "Bank Rental" : "Interest Paid"}
                  </th>
                  <th className="py-2.5 px-2 whitespace-nowrap">
                    Extra Prepayment
                  </th>
                  <th className="py-2.5 px-2 whitespace-nowrap">
                    Client Equity %
                  </th>
                  <th className="py-2.5 px-2 text-right whitespace-nowrap">
                    Remaining Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#130936]/8 print:divide-slate-200">
                {result.annualSchedule.map((row) => (
                  <tr
                    key={row.year}
                    className="hover:bg-[#F4F7F8] transition-colors"
                  >
                    <td className="py-2.5 px-2 font-extrabold text-[#130936] print:text-slate-900 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#A82FFC] print:hidden" />
                        Year {row.year} ({2025 + row.year})
                      </span>
                    </td>
                    <td
                      dir="ltr"
                      className="py-2.5 px-2 font-bold text-emerald-700 print:text-slate-900 whitespace-nowrap"
                    >
                      {formatCurrency(row.principalPaid, country)}
                    </td>
                    <td
                      dir="ltr"
                      className="py-2.5 px-2 font-semibold text-rose-600 print:text-slate-900 whitespace-nowrap"
                    >
                      {formatCurrency(row.interestPaid, country)}
                    </td>
                    <td
                      dir="ltr"
                      className="py-2.5 px-2 font-bold text-[#A82FFC] print:text-slate-900 whitespace-nowrap"
                    >
                      {row.extraPayment > 0
                        ? `+\u200E${formatCurrency(row.extraPayment, country)}`
                        : "—"}
                    </td>
                    <td className="py-2.5 px-2 font-bold text-[#130936] print:text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#E3ECEE] rounded-full overflow-hidden print:hidden">
                          <div
                            className="h-full bg-[#A82FFC]"
                            style={{ width: `${row.clientEquityPct}%` }}
                          />
                        </div>
                        <span>{row.clientEquityPct.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td
                      dir="ltr"
                      className="py-2.5 px-2 text-right font-extrabold text-[#130936] print:text-slate-900 whitespace-nowrap"
                    >
                      {formatCurrency(row.endingBalance, country)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table
              dir="ltr"
              className="mortafy-print-table w-full text-left border-collapse text-xs tabular-nums"
            >
              <thead>
                <tr className="border-b-2 border-[#130936]/15 print:border-slate-900 text-[#130936]/65 print:text-slate-900 uppercase text-[10px] font-extrabold">
                  <th className="py-2.5 px-2 whitespace-nowrap">Payment #</th>
                  <th className="py-2.5 px-2 whitespace-nowrap">
                    {isIslamic ? "Equity Buyout" : "Principal Paid"}
                  </th>
                  <th className="py-2.5 px-2 whitespace-nowrap">
                    {isIslamic ? "Rental Paid" : "Interest Paid"}
                  </th>
                  <th className="py-2.5 px-2 whitespace-nowrap">Extra Paid</th>
                  <th className="py-2.5 px-2 whitespace-nowrap">
                    Total Installment
                  </th>
                  <th className="py-2.5 px-2 text-right whitespace-nowrap">
                    Remaining Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#130936]/8 print:divide-slate-200">
                {result.schedule.map((row) => (
                  <tr
                    key={row.paymentNumber}
                    className="hover:bg-[#F4F7F8] transition-colors"
                  >
                    <td className="py-2 px-2 font-bold text-[#130936] print:text-slate-900 whitespace-nowrap">
                      #{row.paymentNumber}{" "}
                      <span className="text-[10px] text-[#130936]/50 print:text-slate-600">
                        (Y{row.year} M{row.monthInYear})
                      </span>
                    </td>
                    <td
                      dir="ltr"
                      className="py-2 px-2 font-semibold text-emerald-700 print:text-slate-900 whitespace-nowrap"
                    >
                      {formatCurrency(row.principalPaid, country)}
                    </td>
                    <td
                      dir="ltr"
                      className="py-2 px-2 font-semibold text-rose-600 print:text-slate-900 whitespace-nowrap"
                    >
                      {formatCurrency(row.interestPaid, country)}
                    </td>
                    <td
                      dir="ltr"
                      className="py-2 px-2 font-bold text-[#A82FFC] print:text-slate-900 whitespace-nowrap"
                    >
                      {row.extraPayment > 0
                        ? `+\u200E${formatCurrency(row.extraPayment, country)}`
                        : "—"}
                    </td>
                    <td
                      dir="ltr"
                      className="py-2 px-2 font-bold text-[#130936] print:text-slate-900 whitespace-nowrap"
                    >
                      {formatCurrency(row.totalPayment, country)}
                    </td>
                    <td
                      dir="ltr"
                      className="py-2 px-2 text-right font-extrabold text-[#130936] print:text-slate-900 whitespace-nowrap"
                    >
                      {formatCurrency(row.remainingBalance, country)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Formal Regulatory Compliance Disclaimer Footer */}
        <div className="bg-[#F4F7F8] print:bg-white px-5 sm:px-7 print:px-0 py-3.5 border-t border-[#130936]/10 print:border-slate-900 flex items-start gap-2 text-[11px] text-[#130936]/70 print:text-slate-800 safe-bottom">
          <ShieldCheck className="w-4 h-4 text-[#A82FFC] print:text-slate-900 shrink-0 mt-0.5" />
          <p>
            <strong>Regulatory Compliance Notice ({country.name}):</strong>{" "}
            {country.regulatoryDisclaimer} Prepared for{" "}
            <span className="underline font-bold">{clientName}</span> by{" "}
            <span className="underline font-bold">{brokerName}</span>.{" "}
            <strong>Illustrative estimate only. Generated via Mortafy.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
