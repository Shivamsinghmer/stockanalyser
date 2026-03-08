"use client";

import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  ticker: string;
}

function SkeletonBox({
  className = "",
  height = "h-4",
}: {
  className?: string;
  height?: string;
}) {
  return (
    <div className={`skeleton rounded-lg ${height} ${className}`} />
  );
}

function SkeletonCard({
  children,
  delayMs = 0,
}: {
  children?: React.ReactNode;
  delayMs?: number;
}) {
  return (
    <div
      className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 shadow-sm"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {/* Card title skeleton */}
      <SkeletonBox className="w-32 mb-5" height="h-4" />
      {children}
    </div>
  );
}

export function LoadingState({ ticker }: LoadingStateProps) {
  return (
    <div className="w-full space-y-6">
      {/* Banner */}
      <div className="w-full rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 flex items-center gap-4">
        <Loader2
          size={24}
          className="spinner text-[var(--primary)] flex-shrink-0"
        />
        <div>
          <p className="font-semibold text-[var(--foreground)]">
            🤖 AI is analyzing{" "}
            <span className="font-mono text-[var(--primary)]">{ticker}</span>
            ...
          </p>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            Fetching live market data and running technical indicators
          </p>
        </div>
      </div>

      {/* Header skeleton */}
      <SkeletonCard>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <SkeletonBox className="w-48" height="h-6" />
            <SkeletonBox className="w-24" height="h-4" />
          </div>
          <SkeletonBox className="w-32 mx-auto" height="h-10" />
          <div className="space-y-2 text-right">
            <SkeletonBox className="w-24 ml-auto" height="h-6" />
            <SkeletonBox className="w-16 ml-auto" height="h-4" />
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonBox key={i} className="w-24" height="h-10" />
          ))}
        </div>
      </SkeletonCard>

      {/* Row 1: MarketData + Trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <SkeletonCard delayMs={50}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <SkeletonBox key={i} className="w-full" height="h-16" />
            ))}
          </div>
        </SkeletonCard>
        <SkeletonCard delayMs={100}>
          <div className="space-y-3">
            <SkeletonBox className="w-24" height="h-7" />
            {[1, 2, 3].map((i) => (
              <SkeletonBox key={i} className="w-full" height="h-10" />
            ))}
            <SkeletonBox className="w-32" height="h-7" />
          </div>
        </SkeletonCard>
      </div>

      {/* Row 2: 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[80, 130, 180].map((delay) => (
          <SkeletonCard key={delay} delayMs={delay}>
            <div className="space-y-3">
              <SkeletonBox className="w-full" height="h-20" />
              <SkeletonBox className="w-full" height="h-14" />
              <SkeletonBox className="w-full" height="h-14" />
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* Row 3: 2 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[200, 250].map((delay) => (
          <SkeletonCard key={delay} delayMs={delay}>
            <div className="space-y-3">
              <SkeletonBox className="w-20 mx-auto" height="h-12" />
              <SkeletonBox className="w-full" height="h-3" />
              <SkeletonBox className="w-full" height="h-14" />
            </div>
          </SkeletonCard>
        ))}
      </div>

      {/* Row 4: 2 cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SkeletonCard delayMs={300}>
          <div className="flex gap-4">
            <SkeletonBox className="w-36" height="h-32" />
            <div className="flex-1 space-y-2">
              <SkeletonBox className="w-full" height="h-4" />
              <SkeletonBox className="w-full" height="h-4" />
              <SkeletonBox className="w-3/4" height="h-4" />
            </div>
          </div>
        </SkeletonCard>
        <SkeletonCard delayMs={350}>
          <div className="space-y-3">
            <SkeletonBox className="w-full" height="h-14" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonBox key={i} className="w-full" height="h-8" />
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}
