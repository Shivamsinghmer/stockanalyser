"use client";

import { StockAnalysis } from "../lib/parseAnalysis";
import { TrendingDown } from "lucide-react";

interface VolatilityCardProps {
  data: StockAnalysis;
  animationDelay?: number;
}

export function VolatilityCard({
  data,
  animationDelay = 400,
}: VolatilityCardProps) {
  const upper = parseFloat(data.bbUpper.replace(/[^0-9.]/g, ""));
  const lower = parseFloat(data.bbLower.replace(/[^0-9.]/g, ""));
  const middle = parseFloat(data.bbMiddle.replace(/[^0-9.]/g, ""));
  const current = parseFloat(data.currentPrice.replace(/[^0-9.]/g, ""));

  const hasValidBB = !isNaN(upper) && !isNaN(lower) && upper !== lower;
  const pricePct = hasValidBB
    ? Math.min(Math.max(((current - lower) / (upper - lower)) * 100, 2), 98)
    : 50;

  const atrNum = parseFloat(data.atr.replace(/[^0-9.]/g, ""));
  const priceForAtr = !isNaN(current) && current > 0 ? current : 1;
  const atrPct = !isNaN(atrNum) ? (atrNum / priceForAtr) * 100 : 0;
  const volatilityLevel =
    atrPct < 1.5 ? "Low" : atrPct < 3.5 ? "Medium" : "High";

  const volColor =
    volatilityLevel === "High"
      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
      : volatilityLevel === "Medium"
      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
      : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";

  return (
    <div
      className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-sm card-animate hover:shadow-md transition-shadow duration-300"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingDown size={18} className="text-[var(--primary)] opacity-80" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Volatility
        </h2>
      </div>

      {/* Bollinger Bands */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] text-[var(--muted-foreground)] font-semibold uppercase tracking-widest">
            Bollinger Bands
          </p>
          {data.bbSqueeze && (
            <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full font-bold tracking-wider uppercase">
              Squeeze ⚠️
            </span>
          )}
        </div>

        {/* Band values */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Upper", value: data.bbUpper, color: "text-red-500 dark:text-red-400" },
            { label: "Middle", value: data.bbMiddle, color: "text-[var(--primary)]" },
            { label: "Lower", value: data.bbLower, color: "text-green-500 dark:text-green-400" },
          ].map((b) => (
            <div key={b.label} className="text-center p-3 bg-[var(--background)] border border-[var(--border)] rounded-xl">
              <p className={`font-mono font-bold text-sm ${b.color}`}>
                {b.value}
              </p>
              <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest mt-1 font-semibold">
                {b.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[var(--muted-foreground)] uppercase tracking-widest font-semibold mb-1">
              ATR (14)
            </p>
            <p className="font-mono font-medium text-lg text-[var(--foreground)]">
              {data.atr}
            </p>
          </div>
          <span className={`text-[11px] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider ${volColor}`}>
            {volatilityLevel} Volatility
          </span>
        </div>
      </div>
    </div>
  );
}
