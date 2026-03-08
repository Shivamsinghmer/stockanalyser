"use client";

import { StockAnalysis } from "../lib/parseAnalysis";
import { TrendingUp } from "lucide-react";

interface TrendCardProps {
  data: StockAnalysis;
  animationDelay?: number;
}

function TrendBadge({ trend }: { trend: string }) {
  const config = {
    BULLISH: {
      bg: "bg-green-100 dark:bg-green-900/40",
      text: "text-green-700 dark:text-green-300",
      dot: "bg-green-500",
    },
    BEARISH: {
      bg: "bg-red-100 dark:bg-red-900/40",
      text: "text-red-700 dark:text-red-300",
      dot: "bg-red-500",
    },
    SIDEWAYS: {
      bg: "bg-amber-100 dark:bg-amber-900/40",
      text: "text-amber-700 dark:text-amber-300",
      dot: "bg-amber-500",
    },
  }[trend] || {
    bg: "bg-[var(--muted)]",
    text: "text-[var(--muted-foreground)]",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {trend}
    </span>
  );
}

function EmaRow({
  period,
  value,
  currentPrice,
}: {
  period: string;
  value: string;
  currentPrice: string;
}) {
  const emaNum = parseFloat(value.replace(/[^0-9.]/g, ""));
  const priceNum = parseFloat(currentPrice.replace(/[^0-9.]/g, ""));
  const isAbove = !isNaN(emaNum) && !isNaN(priceNum) && priceNum > emaNum;
  const isUnknown = isNaN(emaNum) || isNaN(priceNum);

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0">
      <span className="text-sm text-[var(--muted-foreground)] font-medium">
        EMA {period}
      </span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-medium text-[var(--foreground)]">
          {value}
        </span>
        <span className="text-base">
          {isUnknown ? "—" : isAbove ? "✅" : "❌"}
        </span>
      </div>
    </div>
  );
}

export function TrendCard({ data, animationDelay = 200 }: TrendCardProps) {
  const isGoldenCross = /golden\s*cross/i.test(data.maSignal);
  const isDeathCross = /death\s*cross/i.test(data.maSignal);

  return (
    <div
      className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-sm card-animate hover:shadow-md transition-shadow duration-300"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={18} className="text-[var(--primary)] opacity-80" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Trend Analysis
        </h2>
      </div>

      {/* Primary Trend */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[11px] text-[var(--muted-foreground)] uppercase tracking-widest font-semibold">
          Primary Trend
        </p>
        <TrendBadge trend={data.trend} />
      </div>

      {/* EMA Rows */}
      <div className="mb-5 bg-[var(--background)] rounded-xl border border-[var(--border)] px-4 py-2">
        <EmaRow period="20" value={data.ema20} currentPrice={data.currentPrice} />
        <EmaRow period="50" value={data.ema50} currentPrice={data.currentPrice} />
        <EmaRow period="200" value={data.ema200} currentPrice={data.currentPrice} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* MA Signal */}
        {data.maSignal !== "—" && (
          <div>
            <p className="text-[11px] text-[var(--muted-foreground)] mb-2 uppercase tracking-widest font-semibold flex-shrink-0">
              MA Signal
            </p>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
                isGoldenCross
                  ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                  : isDeathCross
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
                  : "bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]"
              }`}
            >
              {isGoldenCross ? "⚡" : isDeathCross ? "💀" : "📊"} {data.maSignal}
            </span>
          </div>
        )}

        {/* Trend Structure */}
        {data.trendStructure && data.trendStructure !== "—" && (
          <div>
            <p className="text-[11px] text-[var(--muted-foreground)] mb-2 uppercase tracking-widest font-semibold flex-shrink-0">
              Structure
            </p>
            <span className="text-[13px] font-medium text-[var(--foreground)] bg-[var(--muted)] px-3 py-1.5 rounded-lg border border-[var(--border)] inline-block">
              {data.trendStructure}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
