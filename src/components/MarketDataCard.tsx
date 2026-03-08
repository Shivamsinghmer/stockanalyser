"use client";

import { StockAnalysis } from "../lib/parseAnalysis";
import { BarChart2 } from "lucide-react";

interface MarketDataCardProps {
  data: StockAnalysis;
  animationDelay?: number;
}

interface MetricTileProps {
  label: string;
  value: string;
  className?: string;
}

function MetricTile({ label, value, className = "" }: MetricTileProps) {
  return (  
    <div
      className={`p-4 bg-[var(--card)] hover:bg-[var(--muted)]/50 transition-colors flex flex-col justify-center ${className}`}
    >
      <p className="text-[10px] text-[var(--muted-foreground)] font-semibold uppercase tracking-widest mb-1.5 opacity-80">
        {label}
      </p>
      <p className="text-base font-mono font-medium text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

export function MarketDataCard({
  data,
  animationDelay = 100,
}: MarketDataCardProps) {
  return (
    <div
      className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-sm card-animate hover:shadow-md transition-shadow duration-300"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 size={18} className="text-[var(--primary)] opacity-80" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Market Snapshot
        </h2>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border border-[var(--border)] border-b-0 sm:border-b rounded-xl overflow-hidden [&>*:nth-child(n+1)]:border-b border-l-0 [&>*:nth-child(odd)]:border-r sm:[&>*:not(:nth-child(4n))]:border-r border-[var(--border)]">
        <MetricTile label="Current Price" value={data.currentPrice} />
        <MetricTile label="Day Open" value={data.dayOpen} />
        <MetricTile label="Day High" value={data.dayHigh} />
        <MetricTile label="Day Low" value={data.dayLow} />
        <MetricTile label="Volume" value={data.volume} />
        <MetricTile label="Avg Volume" value={data.avgVolume} />
        <MetricTile
          label="52W High"
          value={data.weekHigh52}
          className="!text-green-600 dark:!text-green-400"
        />
        <MetricTile
          label="52W Low"
          value={data.weekLow52}
          className="!text-red-500 dark:!text-red-400"
        />
      </div>
    </div>
  );
}
