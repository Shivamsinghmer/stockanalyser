"use client";

import { useState } from "react";
import { Search, TrendingUp, Loader2, Sparkles, Hash } from "lucide-react";

const POPULAR_STOCKS: Record<string, { company: string; symbol: string }> = {
  "RELIANCE.NS": { company: "Reliance Industries", symbol: "RELIANCE.NS" },
  "TCS.NS": { company: "Tata Consultancy Services", symbol: "TCS.NS" },
  "INFY.NS": { company: "Infosys", symbol: "INFY.NS" },
  "HDFCBANK.NS": { company: "HDFC Bank", symbol: "HDFCBANK.NS" },
  "WIPRO.NS": { company: "Wipro", symbol: "WIPRO.NS" },
  AAPL: { company: "Apple Inc.", symbol: "AAPL" },
  TSLA: { company: "Tesla Inc.", symbol: "TSLA" },
  NVDA: { company: "NVIDIA Corporation", symbol: "NVDA" },
  MSFT: { company: "Microsoft Corporation", symbol: "MSFT" },
  GOOGL: { company: "Alphabet Inc.", symbol: "GOOGL" },
};

interface SearchBarProps {
  onSearch: (company: string, symbol: string, query?: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [mode, setMode] = useState<"ticker" | "prompt">("ticker");
  const [company, setCompany] = useState("");
  const [symbol, setSymbol] = useState("");
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "ticker" && (company.trim() || symbol.trim())) {
      onSearch(company.trim(), symbol.trim().toUpperCase());
    } else if (mode === "prompt" && query.trim()) {
      onSearch("", "", query.trim());
    }
  };

  const handleChipClick = (key: string) => {
    setMode("ticker");
    const stock = POPULAR_STOCKS[key];
    setCompany(stock.company);
    setSymbol(stock.symbol);
  };

  const indianStocks = ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "WIPRO.NS"];
  const usStocks = ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL"];

  const isSubmitDisabled =
    isLoading ||
    (mode === "ticker" && !company.trim() && !symbol.trim()) ||
    (mode === "prompt" && !query.trim());

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      {/* Mode Switches */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => setMode("ticker")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            mode === "ticker"
              ? "bg-[var(--primary)] text-black shadow-md shadow-amber-500/20"
              : "bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
          }`}
        >
          <Hash size={16} /> Exact Ticker
        </button>
        <button
          type="button"
          onClick={() => setMode("prompt")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            mode === "prompt"
              ? "bg-[var(--primary)] text-black shadow-md shadow-amber-500/20"
              : "bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
          }`}
        >
          <Sparkles size={16} /> AI Prompt
        </button>
      </div>

      <div className="bg-[var(--card)] p-5 sm:p-6 rounded-3xl border border-[var(--border)] shadow-sm">
        {mode === "ticker" ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company Name (e.g. Reliance)"
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all duration-200 font-sans text-sm disabled:opacity-60"
                />
              </div>
              <div className="flex-1 relative">
                <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="Ticker (e.g. RELIANCE.NS)"
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all duration-200 font-mono text-sm disabled:opacity-60"
                />
              </div>
            </div>

            {/* Quick Pick Chips */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-[var(--muted-foreground)] font-semibold uppercase tracking-widest mr-2">
                  🇮🇳 India
                </span>
                {indianStocks.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleChipClick(key)}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-200 disabled:opacity-40"
                  >
                    {key}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-[var(--muted-foreground)] font-semibold uppercase tracking-widest mr-2">
                  🇺🇸 US
                </span>
                {usStocks.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleChipClick(key)}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-200 disabled:opacity-40"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="relative">
            <Sparkles className="absolute left-4 top-4 text-[var(--primary)] opacity-80" size={20} />
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Analyze the stock of HDFC Bank based on the last 3 months..."
              disabled={isLoading}
              rows={3}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all duration-200 font-sans text-sm disabled:opacity-60 resize-none"
            />
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full sm:w-auto px-12 py-4 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2.5 mx-auto hover:opacity-90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)] transition-all duration-200 shadow-xl shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="spinner" /> Analyzing...
            </>
          ) : (
            <>
              Generate Analysis →
            </>
          )}
        </button>
      </div>
    </form>
  );
}
