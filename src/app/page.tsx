"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { StockHeader } from "@/components/StockHeader";
import { MarketDataCard } from "@/components/MarketDataCard";
import { TrendCard } from "@/components/TrendCard";
import { MomentumCard } from "@/components/MomentumCard";
import { VolatilityCard } from "@/components/VolatilityCard";
import { PriceLevelsCard } from "@/components/PriceLevelsCard";
import { CandlestickCard } from "@/components/CandlestickCard";
import { VolumeCard } from "@/components/VolumeCard";
import { OutlookCard } from "@/components/OutlookCard";
import { TradeSetupCard } from "@/components/TradeSetupCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { parseAnalysis, StockAnalysis } from "@/lib/parseAnalysis";

type AppState = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [rawExpanded, setRawExpanded] = useState(false);
  const [currentTicker, setCurrentTicker] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (company: string, symbol: string, query?: string) => {
    setCurrentTicker(symbol || "AI Analysis");
    setAppState("loading");
    setAnalysis(null);
    setErrorMsg("");
    setRawExpanded(false);

    try {
      const payload = query ? { query } : { company, symbol };
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      
      if (!webhookUrl) {
        throw new Error("Webhook URL is not configured. Please check your .env file.");
      }
      
      const response = await axios.post(
        webhookUrl,
        payload,
        { timeout: 120000 }
      );

      const rawText = response.data;
      console.log("Raw API Response:", rawText);
      const parsed = parseAnalysis(
        typeof rawText === "string" ? rawText : JSON.stringify(rawText, null, 2),
        symbol || "AI Scan",
        company || "Unknown Company"
      );
      console.log("Parsed Data:", parsed);

      setAnalysis(parsed);
      setAppState("success");

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: unknown) {
      console.error("Analysis failed:", err);
      let msg = "Failed to fetch analysis. Please try again.";
      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNABORTED") {
          msg = "Request timed out. The analysis is taking too long. Please try again.";
        } else if (err.response) {
          msg = `Server error (${err.response.status}): ${err.response.statusText}`;
        } else if (!err.response) {
          msg = "Network error. Check your connection and try again.";
        }
      }
      setErrorMsg(msg);
      setAppState("error");
    }
  };

  const handleRetry = () => {
    setAppState("idle");
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* ─── Fixed Header ─── */}
      <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-md" />
            <span className="text-xl font-mono font-bold text-[var(--primary)] text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-amber-700">
              StockSense
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {appState === "success" && analysis && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[var(--muted-foreground)] border border-[var(--border)] px-2.5 py-1.5 rounded-full bg-[var(--muted)]">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {analysis.ticker}
              </span>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero Section */}
        <section className="py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-semibold px-4 py-2 rounded-full border border-[var(--primary)]/30 mb-6">
              <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse" />
              Live AI Analysis — Powered by Real-Time Data
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[var(--foreground)] leading-tight mb-4">
              Institutional-Grade{" "}
              <span className="text-[var(--primary)]">Stock Analysis</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--muted-foreground)] mb-10 max-w-xl mx-auto leading-relaxed">
              Powered by AI + Real-Time Market Data. Get EMA trends, RSI, MACD,
              Bollinger Bands, support/resistance, and full trade setups in
              seconds.
            </p>

            <SearchBar onSearch={handleSearch} isLoading={appState === "loading"} />
          </div>
        </section>

        {/* ─── Results / State Sections ─── */}
        <div ref={resultsRef}>
          {/* Loading */}
          {appState === "loading" && (
            <LoadingState ticker={currentTicker} />
          )}

          {/* Error */}
          {appState === "error" && (
            <ErrorState error={errorMsg} onRetry={handleRetry} />
          )}

          {/* Success */}
          {appState === "success" && analysis && (
            <div className="space-y-5">
              {/* Stock Header */}
              <StockHeader data={analysis} />

              {/* Row 1: MarketData (col-span-2) + TrendCard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  <MarketDataCard data={analysis} animationDelay={100} />
                </div>
                <div>
                  <TrendCard data={analysis} animationDelay={200} />
                </div>
              </div>

              {/* Row 2: Momentum + Volatility + PriceLevels */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <MomentumCard data={analysis} animationDelay={300} />
                <VolatilityCard data={analysis} animationDelay={400} />
                <PriceLevelsCard data={analysis} animationDelay={500} />
              </div>

              {/* Row 3: Volume + Candlestick */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <VolumeCard data={analysis} animationDelay={600} />
                <CandlestickCard data={analysis} animationDelay={700} />
              </div>

              {/* Row 4: Outlook (col-span-2) + TradeSetup */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  <OutlookCard data={analysis} animationDelay={800} />
                </div>
                <div>
                  <TradeSetupCard data={analysis} animationDelay={900} />
                </div>
              </div>

              {/* ─── Raw Analysis Collapsible ─── */}
              <div
                className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden card-animate"
                style={{ animationDelay: "1000ms" }}
              >
                <button
                  onClick={() => setRawExpanded(!rawExpanded)}
                  className="w-full flex items-center justify-between p-5 hover:bg-[var(--muted)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--ring)]"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[var(--primary)]" />
                    <span className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-widest">
                      View Raw AI Analysis
                    </span>
                  </div>
                  {rawExpanded ? (
                    <ChevronUp size={18} className="text-[var(--muted-foreground)]" />
                  ) : (
                    <ChevronDown size={18} className="text-[var(--muted-foreground)]" />
                  )}
                </button>

                {rawExpanded && (
                  <div className="border-t border-[var(--border)] p-5">
                    <pre className="whitespace-pre-wrap text-xs font-mono text-[var(--muted-foreground)] leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto bg-[var(--muted)] p-4 rounded-xl">
                      {analysis.rawText}
                    </pre>
                  </div>
                )}
              </div>

              {/* Search Again CTA */}
              <div className="text-center pt-4 pb-8">
                <p className="text-sm text-[var(--muted-foreground)] mb-3">
                  Analyze another stock?
                </p>
                <button
                  onClick={() => {
                    setAppState("idle");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-8 py-3 rounded-xl border border-[var(--primary)] text-[var(--primary)] font-semibold hover:bg-[var(--accent)] transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                >
                  ← New Search
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-[var(--muted-foreground)]">
            📈 StockSense — AI-powered technical analysis.{" "}
            <span className="text-[var(--primary)]">Not financial advice.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
