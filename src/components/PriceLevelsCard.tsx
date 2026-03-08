"use client";

import { StockAnalysis } from "../lib/parseAnalysis";
import { Layers } from "lucide-react";

interface PriceLevelsCardProps {
  data: StockAnalysis;
  animationDelay?: number;
}

interface LevelRowProps {
  label: string;
  value: string;
  bgClass: string;
  textClass?: string;
  dotColor: string;
  isCurrent?: boolean;
}

function LevelRow({
  label,
  value,
  bgClass,
  textClass = "text-[var(--foreground)]",
  dotColor,
  isCurrent = false,
}: LevelRowProps) {
  return (
    <div
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg ${bgClass} ${
        isCurrent ? "font-bold" : ""
      } transition-all duration-200`}
    >
      {/* Dot */}
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColor}`} />

      {/* Label */}
      <span className={`text-xs font-medium flex-1 uppercase tracking-wider ${textClass}`}>
        {label}
      </span>

      {/* Price */}
      <span
        className={`font-mono text-sm font-semibold ${textClass} ${
          isCurrent ? "text-base" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function PriceLevelsCard({
  data,
  animationDelay = 500,
}: PriceLevelsCardProps) {
  const levels = [
    {
      label: "R2",
      value: data.r2,
      bgClass: "bg-red-100 dark:bg-red-900/30",
      textClass: "text-red-700 dark:text-red-300",
      dotColor: "bg-red-500",
    },
    {
      label: "R1",
      value: data.r1,
      bgClass: "bg-red-50 dark:bg-red-900/15",
      textClass: "text-red-600 dark:text-red-400",
      dotColor: "bg-red-400",
    },
    {
      label: "Pivot",
      value: data.pp,
      bgClass: "bg-[var(--muted)]",
      textClass: "text-[var(--muted-foreground)]",
      dotColor: "bg-amber-400",
    },
    {
      label: "Current",
      value: data.currentPrice,
      bgClass: "bg-[var(--primary)]",
      textClass: "text-[var(--primary-foreground)]",
      dotColor: "bg-[var(--primary-foreground)]",
      isCurrent: true,
    },
    {
      label: "S1",
      value: data.s1,
      bgClass: "bg-green-50 dark:bg-green-900/15",
      textClass: "text-green-600 dark:text-green-400",
      dotColor: "bg-green-400",
    },
    {
      label: "S2",
      value: data.s2,
      bgClass: "bg-green-100 dark:bg-green-900/30",
      textClass: "text-green-700 dark:text-green-300",
      dotColor: "bg-green-500",
    },
  ];

  return (
    <div
      className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 shadow-sm card-animate hover:shadow-[0_0_0_1px_var(--primary)] transition-shadow duration-300"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Layers size={18} className="text-[var(--primary)]" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Key Price Levels
        </h2>
      </div>

      {/* Price Ladder */}
      <div className="relative flex gap-3">
        {/* Vertical line */}
        <div className="flex flex-col items-center">
          <div className="flex-1 w-px bg-gradient-to-b from-red-400 via-amber-400 to-green-400 ml-[5px]" />
        </div>

        {/* Levels */}
        <div className="flex-1 space-y-1.5">
          {levels.map((level) => (
            <LevelRow key={level.label} {...level} />
          ))}
        </div>
      </div>
    </div>
  );
}
