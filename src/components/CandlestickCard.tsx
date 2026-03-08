"use client";

import { StockAnalysis } from "../lib/parseAnalysis";
import { CandlestickChart } from "lucide-react";

interface CandlestickCardProps {
  data: StockAnalysis;
  animationDelay?: number;
}

export function CandlestickCard({
  data,
  animationDelay = 600,
}: CandlestickCardProps) {
  const meaningStr = data.patternMeaning.toLowerCase();
  const isBullish = meaningStr.includes("bullish") || meaningStr.includes("up");
  const isBearish = meaningStr.includes("bearish") || meaningStr.includes("down");

  const signalConfig = isBullish
    ? {
        cls: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
        icon: "🟢",
      }
    : isBearish
    ? {
        cls: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
        icon: "🔴",
      }
    : {
        cls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
        icon: "🟡",
      };

  const hasPattern =
    data.pattern !== "—" &&
    data.pattern !== "" &&
    !/no\s*pattern/i.test(data.pattern);

  return (
    <div
      className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-sm card-animate hover:shadow-md transition-shadow duration-300"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-2 mb-6">
        <CandlestickChart size={18} className="text-[var(--primary)] opacity-80" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Candlestick Pattern
        </h2>
      </div>

      {/* Pattern visual icon */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-4 opacity-90 drop-shadow-sm">🕯️</div>
        <h3 className="text-xl font-medium text-[var(--foreground)] font-serif tracking-tight">
          {hasPattern ? data.pattern : "No Pattern Detected"}
        </h3>

        {hasPattern && data.patternMeaning && data.patternMeaning !== "—" && (
          <div className="mt-4">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium border border-transparent shadow-sm ${signalConfig.cls}`}
            >
              <span className="text-base">{signalConfig.icon}</span>
              <span>{data.patternMeaning}</span>
            </span>
          </div>
        )}
      </div>

      {!hasPattern && (
        <p className="text-center text-[var(--muted-foreground)] text-[13px] leading-relaxed p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
          No significant candlestick pattern detected in the current timeframe.
          Monitor for emerging technical patterns.
        </p>
      )}
    </div>
  );
}
