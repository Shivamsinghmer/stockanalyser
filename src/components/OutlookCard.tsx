"use client";

import { StockAnalysis } from "../lib/parseAnalysis";
import { Eye } from "lucide-react";

interface OutlookCardProps {
  data: StockAnalysis;
  animationDelay?: number;
}

export function OutlookCard({ data, animationDelay = 800 }: OutlookCardProps) {
  const biasConfig = {
    BULLISH: {
      icon: "🟢",
      cls: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700",
      label: "BULLISH",
    },
    BEARISH: {
      icon: "🔴",
      cls: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700",
      label: "BEARISH",
    },
    NEUTRAL: {
      icon: "🟡",
      cls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700",
      label: "NEUTRAL",
    },
    SIDEWAYS: {
      icon: "⬜",
      cls: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600",
      label: "SIDEWAYS",
    },
  }[data.bias] || {
    icon: "🟡",
    cls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700",
    label: "NEUTRAL",
  };

  const confidenceStars =
    data.confidence.toLowerCase() === "high"
      ? "★★★"
      : data.confidence.toLowerCase() === "medium"
      ? "★★☆"
      : data.confidence.toLowerCase() === "low"
      ? "★☆☆"
      : null;

  return (
    <div
      className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 md:p-7 shadow-sm card-animate hover:shadow-[0_0_0_1px_var(--primary)] transition-shadow duration-300"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Eye size={18} className="text-[var(--primary)]" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Overall Outlook & Bias
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Bias Indicator */}
        <div className="flex flex-col items-center md:items-start gap-3 md:w-48 flex-shrink-0">
          <div
            className={`text-center w-full px-5 py-5 rounded-2xl border-2 font-bold ${biasConfig.cls}`}
          >
            <div className="text-4xl mb-2">{biasConfig.icon}</div>
            <div className="text-xl tracking-wider">{biasConfig.label}</div>
          </div>

          {/* Confidence */}
          {confidenceStars && (
            <div className="text-center w-full">
              <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                Confidence
              </p>
              <span className="text-xl text-[var(--primary)]">
                {confidenceStars}
              </span>
              <p className="text-xs text-[var(--muted-foreground)] capitalize mt-0.5">
                {data.confidence}
              </p>
            </div>
          )}
        </div>

        {/* Right: Outlook Text */}
        <div className="flex-1">
          <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-medium mb-3">
            AI Analyst Commentary
          </p>
          <p className="text-[var(--foreground)] leading-relaxed text-sm md:text-[15px]">
            {data.outlookText}
          </p>
        </div>
      </div>
    </div>
  );
}
