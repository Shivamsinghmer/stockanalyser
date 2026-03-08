"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center py-16 card-animate">
      <div className="max-w-md w-full mx-auto text-center p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2 font-serif">
          Analysis Failed
        </h2>
        <p className="text-[var(--muted-foreground)] text-sm mb-6 leading-relaxed">
          {error ||
            "Something went wrong while fetching the stock analysis. Please check the ticker symbol and try again."}
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all duration-200"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    </div>
  );
}
