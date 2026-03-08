"use client";

import { StockAnalysis } from "../lib/parseAnalysis";
import { Package } from "lucide-react";

interface VolumeCardProps {
  data: StockAnalysis;
  animationDelay?: number;
}

export function VolumeCard({ data, animationDelay = 700 }: VolumeCardProps) {
  const ratio = parseFloat(data.volumeRatio);
  const valid = !isNaN(ratio);

  const ratioColor = valid
    ? ratio >= 1.5
      ? "text-green-500 dark:text-green-400"
      : ratio < 0.75
      ? "text-[var(--destructive)]"
      : "text-amber-500"
    : "text-[var(--muted-foreground)]";

  const ratioLabel = valid
    ? ratio >= 1.5
      ? "above average volume"
      : ratio < 0.75
      ? "below average volume"
      : "near average volume"
    : "volume data unavailable";



  return (
    <div
      className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 shadow-sm card-animate hover:shadow-md transition-shadow duration-300"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Package size={18} className="text-[var(--primary)] opacity-80" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Volume Analysis
        </h2>
      </div>

      {/* Large ratio display */}
      <div className="text-center mb-6">
        <div className={`text-5xl font-mono font-medium count-animate tracking-tight ${ratioColor}`}>
          {valid ? `${ratio.toFixed(1)}x` : "—"}
        </div>
        <p className="text-[11px] uppercase tracking-widest text-[var(--muted-foreground)] mt-2 font-semibold">
          {ratioLabel}
        </p>
      </div>

      {/* Interpretation */}
      {data.volumeInterpretation !== "—" && data.volumeInterpretation && (
        <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] text-[13px] text-[var(--foreground)] leading-relaxed mb-4">
          {data.volumeInterpretation}
        </div>
      )}

      {/* Raw volumes */}
      <div className="flex gap-3">
        {[
          { label: "Today", value: data.volume },
          { label: "Avg", value: data.avgVolume },
        ].map((v) => (
          <div key={v.label} className="flex-1 p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-center">
            <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest mb-1">
              {v.label}
            </p>
            <p className="font-mono font-medium text-[13px] text-[var(--foreground)]">
              {v.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
