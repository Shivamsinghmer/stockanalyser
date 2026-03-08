"use client";

import { StockAnalysis } from "../lib/parseAnalysis";
import { Zap } from "lucide-react";

interface MomentumCardProps {
  data: StockAnalysis;
  animationDelay?: number;
}

function SignalBadge({ signal }: { signal: string }) {
  const isOverbought = /overbought/i.test(signal);
  const isOversold = /oversold/i.test(signal);
  const isBullish = /bullish/i.test(signal);
  const isBearish = /bearish/i.test(signal);

  const cls = isOverbought || isBearish
    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
    : isOversold || isBullish
    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
    : "bg-[var(--muted)] text-[var(--muted-foreground)]";

  if (signal === "—" || !signal) return null;

  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cls}`}>
      {signal}
    </span>
  );
}



export function MomentumCard({ data, animationDelay = 300 }: MomentumCardProps) {
  const rsiNum = parseFloat(data.rsi);
  const histNum = parseFloat(data.macdHist);
  const histDir = !isNaN(histNum) ? (histNum >= 0 ? "↑" : "↓") : "";
  const histColor = !isNaN(histNum)
    ? histNum >= 0
      ? "text-green-500"
      : "text-[var(--destructive)]"
    : "text-[var(--muted-foreground)]";

  return (
    <div
      className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-sm card-animate hover:shadow-md transition-shadow duration-300"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Zap size={18} className="text-[var(--primary)] opacity-80" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Momentum
        </h2>
      </div>

      {/* RSI */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-[11px] text-[var(--muted-foreground)] font-semibold uppercase tracking-widest">
          RSI (14)
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono font-medium text-[var(--foreground)] text-base">
            {data.rsi}
          </span>
          <SignalBadge
            signal={
              !isNaN(rsiNum)
                ? rsiNum >= 70
                  ? "Overbought"
                  : rsiNum <= 30
                  ? "Oversold"
                  : data.rsiSignal || "Neutral"
                : data.rsiSignal
            }
          />
        </div>
      </div>

      {/* MACD */}
      <div className="mb-4 p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2 border-dashed">
          <span className="text-[11px] text-[var(--muted-foreground)] font-semibold uppercase tracking-widest">
            MACD
          </span>
          <span className={`text-sm font-black ${histColor}`}>{histDir}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "MACD", value: data.macdLine },
            { label: "Signal", value: data.macdSignal },
            { label: "Hist", value: data.macdHist },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest mb-1">
                {item.label}
              </p>
              <p className="font-mono font-medium text-[13px] text-[var(--foreground)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stochastic */}
      <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2 border-dashed">
          <span className="text-[11px] text-[var(--muted-foreground)] font-semibold uppercase tracking-widest">
            Stochastic
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { label: "%K", value: data.stochK },
            { label: "%D", value: data.stochD },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest mb-1">
                {item.label}
              </p>
              <p className="font-mono font-medium text-[13px] text-[var(--foreground)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
