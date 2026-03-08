"use client";

import { StockAnalysis } from "@/lib/parseAnalysis";

interface StockHeaderProps {
  data: StockAnalysis;
}

export function StockHeader({ data }: StockHeaderProps) {
  const isPositive =
    !data.changePct.startsWith("-") &&
    data.changePct !== "—" &&
    data.changePct !== "";
  const isNegative = data.changePct.startsWith("-");
  const bias = data.bias;

  const borderColor =
    bias === "BULLISH"
      ? "border-green-500"
      : bias === "BEARISH"
      ? "border-[var(--destructive)]"
      : "border-[var(--primary)]";

  const changeColor = isPositive
    ? "text-green-500"
    : isNegative
    ? "text-[var(--destructive)]"
    : "text-[var(--muted-foreground)]";

  const stats = [
    { label: "Open", value: data.dayOpen },
    { label: "High", value: data.dayHigh },
    { label: "Low", value: data.dayLow },
    { label: "Prev Close", value: data.prevClose },
    { label: "Volume", value: data.volume },
  ];

  return (
    <div
      className={`w-full rounded-2xl bg-[var(--card)] border border-[var(--border)] border-l-4 ${borderColor} p-6 sm:p-8 shadow-sm card-animate`}
      style={{ animationDelay: "0ms" }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative">
        {/* Left: Name + Ticker */}
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 opacity-80">
            {data.ticker}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
            {data.company}
          </h1>
        </div>

        {/* Center: Price */}
        <div className="md:text-center flex-1">
          <p className="text-[10px] text-[var(--muted-foreground)] font-semibold uppercase tracking-widest mb-1.5 opacity-80">
            Last Price
          </p>
          <div className="text-4xl sm:text-5xl font-mono font-medium text-[var(--foreground)] count-animate tracking-tighter">
            {data.currentPrice !== "—"
              ? data.currentPrice.includes("₹") ||
                data.currentPrice.includes("$")
                ? data.currentPrice
                : `${data.currentPrice}`
              : "—"}
          </div>
        </div>

        {/* Right: Change */}
        <div className={`flex-1 md:text-right ${changeColor}`}>
          <div className="text-2xl sm:text-3xl font-mono font-medium tracking-tighter mb-1">
            {isPositive ? "▲" : isNegative ? "▼" : ""}{" "}
            {data.change !== "—" ? data.change : "—"}
          </div>
          <div className="text-[13px] font-mono font-semibold tracking-wider opacity-90 inline-block px-3 py-1 rounded-md bg-[var(--background)] border border-[var(--border)]">
            {data.changePct !== "—" ? `${data.changePct}%` : "—"}
          </div>
        </div>
      </div>

      {/* Stat Pills */}
      <div className="mt-8 flex flex-wrap gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-2"
          >
            <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest font-semibold flex-shrink-0">
              {s.label}
            </span>
            <span className="text-sm font-mono font-medium text-[var(--foreground)]">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
