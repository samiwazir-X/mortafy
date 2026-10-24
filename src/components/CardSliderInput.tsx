"use client";

import React, { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";

interface CardSliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (newValue: number) => void;
  formattedValue: string;
  secondaryBadge?: string;
  onSecondaryBadgeClick?: () => void;
  suffix?: string;
  prefix?: string;
  helperText?: string;
  decimals?: number;
}

export default function CardSliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formattedValue,
  secondaryBadge,
  onSecondaryBadgeClick,
  suffix,
  prefix,
  helperText,
  decimals = 0,
}: CardSliderInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rawText, setRawText] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setRawText(decimals > 0 ? value.toFixed(decimals) : String(Math.round(value)));
    }
  }, [value, isEditing, decimals]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const commitEdit = () => {
    setIsEditing(false);
    const cleaned = rawText.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max * 2, parsed));
      onChange(clamped);
    } else {
      setRawText(decimals > 0 ? value.toFixed(decimals) : String(Math.round(value)));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setRawText(decimals > 0 ? value.toFixed(decimals) : String(Math.round(value)));
    }
  };

  const clampedForProgress = Math.min(max, Math.max(min, value));
  const progressPct =
    max > min ? ((clampedForProgress - min) / (max - min)) * 100 : 0;

  return (
    <div className="relative bg-[#FFFFFF] rounded-[18px] px-4 pt-3 pb-3.5 shadow-[0_4px_16px_rgba(19,9,54,0.06)] border border-white/80 transition-shadow hover:shadow-[0_6px_20px_rgba(19,9,54,0.1)] select-none">
      {/* Top Row: Label + Helper or Secondary Badge */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[12px] font-medium tracking-tight text-[#130936]/65">
          {label}
        </span>
        {helperText && (
          <span className="text-[11px] font-medium text-[#130936]/50">
            {helperText}
          </span>
        )}
      </div>

      {/* Main Value Display / Tap-to-Type Precision Input */}
      <div className="flex items-center justify-between gap-2 min-h-[34px]">
        {isEditing ? (
          <div className="flex items-center gap-1.5 flex-1 bg-[#F4F7F8] rounded-xl px-2.5 py-1 ring-2 ring-[#A82FFC]">
            {prefix && (
              <span className="text-base font-bold text-[#130936]/60">
                {prefix}
              </span>
            )}
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              aria-label={label}
              className="w-full bg-transparent text-[19px] font-bold text-[#130936] focus:outline-none"
            />
            {suffix && (
              <span className="text-sm font-bold text-[#130936]/60">
                {suffix}
              </span>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            title="Tap to type exact value"
            className="group flex items-center gap-2 text-left focus:outline-none"
          >
            <span className="text-[20px] sm:text-[21px] font-extrabold tracking-tight text-[#130936] group-hover:text-[#A82FFC] transition-colors">
              {formattedValue}
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#A82FFC]/10 text-[#A82FFC]">
              <Pencil className="w-3 h-3" />
            </span>
          </button>
        )}

        {secondaryBadge && (
          <button
            type="button"
            onClick={onSecondaryBadgeClick ?? (() => setIsEditing(true))}
            className="px-2.5 py-1 rounded-lg bg-[#F4F7F8] hover:bg-[#A82FFC]/15 text-[#130936] hover:text-[#A82FFC] font-bold text-xs transition-colors shrink-0 border border-[#130936]/10"
          >
            {secondaryBadge}
          </button>
        )}
      </div>

      {/* Bottom-Edge Ergonomic Slider with min-h-[44px] invisible touch/drag hitbox */}
      <div className="relative mt-1.5 h-3 flex items-center">
        {/* Visual Track */}
        <div className="w-full h-[5px] bg-[#E3ECEE] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#A82FFC] to-[#C46BFF] rounded-full transition-[width] duration-75"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Visual 20px Purple Thumb (#A82FFC) with inner white dot */}
        <div
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#A82FFC] shadow-[0_2px_8px_rgba(168,47,252,0.55)] flex items-center justify-center transition-[left] duration-75"
          style={{ left: `${progressPct}%` }}
        >
          <span className="w-2 h-2 rounded-full bg-white" />
        </div>

        {/* Invisible Touch / Drag Hitbox strictly >= 44px height */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clampedForProgress}
          aria-label={`${label} slider`}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-x-0 -top-4 w-full min-h-[44px] h-[44px] opacity-0 cursor-pointer z-10 touch-pan-y"
        />
      </div>
    </div>
  );
}
