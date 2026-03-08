export interface StockAnalysis {
  ticker: string;
  company: string;
  currentPrice: string;
  dayOpen: string;
  dayHigh: string;
  dayLow: string;
  prevClose: string;
  change: string;
  changePct: string;
  volume: string;
  avgVolume: string;
  weekHigh52: string;
  weekLow52: string;
  trend: "BULLISH" | "BEARISH" | "SIDEWAYS";
  ema20: string;
  ema50: string;
  ema200: string;
  maSignal: string;
  trendStructure: string;
  rsi: string;
  rsiSignal: string;
  macdLine: string;
  macdSignal: string;
  macdHist: string;
  stochK: string;
  stochD: string;
  bbUpper: string;
  bbMiddle: string;
  bbLower: string;
  bbSqueeze: boolean;
  atr: string;
  pp: string;
  r1: string;
  r2: string;
  s1: string;
  s2: string;
  pattern: string;
  patternMeaning: string;
  volumeRatio: string;
  volumeInterpretation: string;
  bias: "BULLISH" | "BEARISH" | "NEUTRAL";
  confidence: string;
  outlookText: string;
  action: "BUY" | "SELL" | "WAIT" | "AVOID";
  entryZone: string;
  stopLoss: string;
  target1: string;
  target2: string;
  riskReward: string;
  timeframe: string;
  risks: string[];
  rawText: string;
}

// Helper to extract a value using multiple regex patterns
function extract(text: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return (match[1] || match[2] || "").trim();
    }
  }
  return "—";
}

// Extract boolean flag
function extractBool(text: string, patterns: RegExp[]): boolean {
  for (const pattern of patterns) {
    if (pattern.test(text)) return true;
  }
  return false;
}

// Extract trend bias keyword
function extractBias(
  text: string
): "BULLISH" | "BEARISH" | "NEUTRAL" | "SIDEWAYS" {
  const upper = text.toUpperCase();
  // Check for negation patterns first
  const bullishCount = (upper.match(/\bBULLISH\b/g) || []).length;
  const bearishCount = (upper.match(/\bBEARISH\b/g) || []).length;
  const neutralCount = (upper.match(/\bNEUTRAL\b/g) || []).length;
  const sidewaysCount = (upper.match(/\bSIDEWAYS\b/g) || []).length;

  // Look for explicit "Overall Bias" or "Bias:" section
  const biasMatch = upper.match(
    /(?:OVERALL\s+BIAS|BIAS\s*[:=])\s*(BULLISH|BEARISH|NEUTRAL|SIDEWAYS)/
  );
  if (biasMatch) return biasMatch[1] as "BULLISH" | "BEARISH" | "NEUTRAL" | "SIDEWAYS";

  if (bullishCount > bearishCount && bullishCount > neutralCount)
    return "BULLISH";
  if (bearishCount > bullishCount && bearishCount > neutralCount)
    return "BEARISH";
  if (sidewaysCount > 0) return "SIDEWAYS";
  return "NEUTRAL";
}

function extractAction(text: string): "BUY" | "SELL" | "WAIT" | "AVOID" {
  const upper = text.toUpperCase();

  // Look for explicit recommendation keywords
  const actionMatch = upper.match(
    /(?:RECOMMENDATION|ACTION|TRADE\s+ACTION|SUGGESTED\s+ACTION)\s*[:=]?\s*(BUY|SELL|WAIT|AVOID|HOLD)/
  );
  if (actionMatch) {
    const a = actionMatch[1];
    if (a === "HOLD") return "WAIT";
    return a as "BUY" | "SELL" | "WAIT" | "AVOID";
  }

  if (/\bSTRONG\s+BUY\b/.test(upper)) return "BUY";
  if (/\bSTRONG\s+SELL\b/.test(upper)) return "SELL";

  const bias = extractBias(text);
  if (bias === "BULLISH") return "BUY";
  if (bias === "BEARISH") return "SELL";
  return "WAIT";
}

function extractRisks(text: string): string[] {
  const risks: string[] = [];

  // Look for risks section explicitly
  const risksSection = text.match(
    /(?:KEY\s+RISKS?|RISKS?\s*[:=]|RISK\s+FACTORS?)([\s\S]*?)(?:\n#{1,3}\s|\n\*\*[A-Z]|\n---|\Z)/i
  );
  
  if (risksSection) {
    const lines = risksSection[1].split("\n");
    for (const line of lines) {
      // Must look like a bullet point or numbered item to avoid catching random table rows
      if (/^\s*(?:[-*•]|\d+\.)/.test(line)) {
        const cleaned = line.replace(/^[\s\-\*\•\d\.]+/, "").replace(/\*+/g, "").replace(/\|/g, "").trim();
        // Ignore lines that look like table artifact leftovers (e.g. Reward 1:2)
        if (cleaned.length > 10 && cleaned.length < 300 && !/Reward/i.test(cleaned) && !/Holding Period/i.test(cleaned)) {
          risks.push(cleaned);
        }
      }
    }
  }

  // Fallback: look for bullet points anywhere that contain risk keywords
  if (risks.length === 0) {
    const lines = text.split("\n");
    let inList = false;
    for (const line of lines) {
      if (/^\s*(?:[-*•]|\d+\.)/.test(line)) {
        const cleaned = line.replace(/^[\s\-\*\•\d\.]+/, "").replace(/\*+/g, "").replace(/\|/g, "").trim();
        if (
          /risk|stop.?loss|downside|concern|warning|caution/i.test(line) &&
          cleaned.length > 15 &&
          !/Reward/i.test(cleaned) && 
          !/Holding Period/i.test(cleaned)
        ) {
          risks.push(cleaned);
          if (risks.length >= 4) break;
        }
      }
    }
  }

  return risks.slice(0, 5);
}

function extractOutlook(text: string): string {
  // Look for outlook/conclusion section
  let outlook = "";
  const section = text.match(
    /(?:OUTLOOK|OVERALL\s+OUTLOOK|CONCLUSION|SUMMARY|ANALYST\s+NOTE|BIAS\s*&\s*OUTLOOK)([\s\S]{50,600}?)(?:\n#{1,3}\s|\n\*\*[A-Z]{3,}|\n---|\Z)/i
  );
  if (section) {
    outlook = section[1];
  } else {
    // Take the last meaningful paragraph as outlook fallback
    const paras = text.split(/\n{2,}/);
    for (let i = paras.length - 1; i >= 0; i--) {
      const p = paras[i].trim();
      if (p.length > 50 && !/^\s*\|/.test(p)) {
        outlook = p.substring(0, 600);
        break;
      }
    }
  }
  
  // Clean up outlook text (remove table residue, asterisks, and bias/confidence intro metadata)
  outlook = outlook.replace(/\*+/g, "");
  // Strip lines that start with Bias: ... Confidence: ...
  outlook = outlook.replace(/^(?:\s*Bias[^:]*:[^\n]+|Confidence[^\n]+)\s*\n?/gi, "");
  // Generic fallback if attached inline
  outlook = outlook.replace(/(?:Bias:\s*[A-Z]+\s*Confidence:\s*[A-Za-z]+)\s*/i, "");
  
  outlook = outlook.trim();
  return outlook.length > 20 ? outlook : "Analysis complete. Review the metrics above for a complete picture.";
}

export function parseAnalysis(
  text: string,
  ticker: string,
  company: string
): StockAnalysis {
  // Normalize text for easier parsing
  const t = typeof text === "string" ? text : JSON.stringify(text);

  // TABLES
  const currentPrice = extract(t, [
    /\|\s*Current\s*Price\s*\|\s*([^|]+)\s*\|/i,
    /Current\s*Price\s*[:=₹$]\s*([\d,\.]+)/i,
  ]);

  const ohlc = extract(t, [
    /\|\s*Today Open \/ High \/ Low\s*\|\s*([^|]+)\s*\|/i,
  ]);
  const ohlcParts = ohlc.split("/").map((s) => s.trim());
  const dayOpen = ohlcParts[0] || "—";
  const dayHigh = ohlcParts[1] || "—";
  const dayLow = ohlcParts[2] || "—";

  const prevClose = extract(t, [
    /\|\s*Previous\s*Close\s*\|\s*([^|]+)\s*\|/i,
    /Prev(?:ious)?\s*Close\s*[:=₹$]\s*([\d,\.]+)/i,
  ]);

  const changeRaw = extract(t, [
    /\|\s*Change\s*\|\s*([^|]+)\s*\|/i,
    /Change\s*[:=₹$]\s*([+-]?[\d,\.]+)/i,
  ]);
  const changeParts = changeRaw.split("(").map((s) => s.replace(")", "").trim());
  const change = changeParts[0] || "—";
  const changePct = changeParts[1] || "—";

  const volAvg = extract(t, [
    /\|\s*Volume vs Avg\s*\|\s*([^|]+)\s*\|/i,
  ]);
  const volParts = volAvg.split("(").map((s) => s.replace(")", "").trim());
  const volume = volParts[0] || "—";
  const volumeRatioMatches = volParts[1] ? volParts[1].match(/([\d\.]+)[xX]/) : null;
  const volumeRatio = volumeRatioMatches ? volumeRatioMatches[1] : "—";
  let avgVolume = "—";
  if (volume !== "—" && volumeRatio !== "—" && !isNaN(parseFloat(volumeRatio))) {
      // Estimate avg volume if not explicitly provided
      const volNum = parseFloat(volume.replace(/[^0-9.]/g, ""));
      const ratioNum = parseFloat(volumeRatio);
      if (ratioNum > 0) avgVolume = Math.round(volNum / ratioNum).toLocaleString();
  }

  const highsLows = extract(t, [
    /\|\s*52-Week High \/ Low\s*\|\s*([^|]+)\s*\|/i,
  ]);
  const hlParts = highsLows.split("/").map((s) => s.trim());
  const weekHigh52 = hlParts[0] || "—";
  const weekLow52 = hlParts[1] || "—";

  // Trend
  const trendRaw = extract(t, [
    /\-\s*\*\*Primary\s*Trend:\*\*\s*(.+)/i,
  ]);
  let trend: "BULLISH" | "BEARISH" | "SIDEWAYS" = "SIDEWAYS";
  if (/BULLISH|UP/i.test(trendRaw)) trend = "BULLISH";
  else if (/BEARISH|DOWN/i.test(trendRaw)) trend = "BEARISH";
  else trend = "SIDEWAYS";

  const ema20 = extract(t, [
    /\-\s*\*\*EMA\s*20:\*\*\s*([^\s—]+)/i,
  ]);

  const ema50 = extract(t, [
    /\-\s*\*\*EMA\s*50:\*\*\s*([^\s—]+)/i,
  ]);

  const ema200 = extract(t, [
    /\-\s*\*\*EMA\s*200:\*\*\s*([^\s—]+)/i,
  ]);

  const maSignal = extract(t, [
    /\-\s*\*\*MA\s*Signal:\*\*\s*(.+)/i,
  ]);

  const trendStructure = extract(t, [
    /\-\s*\*\*Trend\s*Structure:\*\*\s*(.+)/i,
  ]);

  // RSI
  const rsiLine = extract(t, [
    /\-\s*\*\*RSI\s*\(14\):\*\*\s*(.+)/i,
  ]);
  const rsiParts = rsiLine.split("→").map((s) => s.trim());
  const rsi = rsiParts[0] || "—";
  const rsiSignal = rsiParts[1] ? rsiParts[1].replace(/[^a-zA-Z]/g, '') : "—";

  // MACD
  const macdLineRaw = extract(t, [
    /\-\s*\*\*MACD:\*\*\s*(.+)/i,
  ]);
  const macdLine = extract(macdLineRaw, [/Line=([^\s]+)/i]);
  const macdSignal = extract(macdLineRaw, [/Signal=([^\s]+)/i]);
  const macdHist = extract(macdLineRaw, [/Hist=([^\s]+)/i]);

  // Stochastic
  const stochLine = extract(t, [
    /\-\s*\*\*Stochastic:\*\*\s*(.+)/i,
  ]);
  const stochK = extract(stochLine, [/%K=([^\s]+)/i]);
  const stochD = extract(stochLine, [/%D=([^\s]+)/i]);

  // Bollinger Bands
  const bbLine = extract(t, [
    /\-\s*\*\*Bollinger\s*Bands:\*\*\s*(.+)/i,
  ]);
  const bbUpper = extract(bbLine, [/Upper=([^\s]+)/i]);
  const bbMiddle = extract(bbLine, [/Mid=([^\s]+)/i]);
  const bbLower = extract(bbLine, [/Lower=([^\s]+)/i]);

  const bbSqueeze = extractBool(t, [
    /→\s*Squeeze:\s*Yes/i,
  ]);

  const atrLine = extract(t, [
    /\-\s*\*\*ATR\s*(?:\(14\))?:\*\*\s*([^\s(]+)/i,
  ]);
  const atr = atrLine;

  // Pivot Points
  const pp = extract(t, [
    /\|\s*.*?Pivot\s*Point\s*\|\s*([^|]+)\s*\|/i,
  ]);

  const r1 = extract(t, [
    /\|\s*.*?Resistance\s*1\s*\(R1\)\s*\|\s*([^|]+)\s*\|/i,
  ]);

  const r2 = extract(t, [
    /\|\s*.*?Resistance\s*2\s*\(R2\)\s*\|\s*([^|]+)\s*\|/i,
  ]);

  const s1 = extract(t, [
    /\|\s*.*?Support\s*1\s*\(S1\)\s*\|\s*([^|]+)\s*\|/i,
  ]);

  const s2 = extract(t, [
    /\|\s*.*?Support\s*2\s*\(S2\)\s*\|\s*([^|]+)\s*\|/i,
  ]);

  // Candlestick Pattern
  const pattern = extract(t, [
    /\-\s*\*\*Detected:\*\*\s*(.+)/i,
  ]);
  
  const patternMeaning = extract(t, [
    /\-\s*\*\*Meaning:\*\*\s*(.+)/i,
  ]);

  // Volume
  const volumeInterpretation = extract(t, [
    /\-\s*Interpretation:\s*(.+)/i,
  ]);

  // Bias & Outlook
  const bias = extractBias(t) as "BULLISH" | "BEARISH" | "NEUTRAL";

  const confidence = extract(t, [
    /(?:Confidence|Confidence\s*Level)\s*[:=]\s*(High|Medium|Low)/i,
  ]);

  const outlookText = extractOutlook(t);

  // Trade Setup
  const action = extractAction(t);

  const entryZone = extract(t, [
    /\|\s*\**(?:Entry\s*Zone|Buy\s*Zone)\**\s*\|\s*([^|]+)\s*\|/i,
  ]);

  const stopLoss = extract(t, [
    /\|\s*\**(?:Stop\s*Loss|SL)\**\s*\|\s*([^|]+)\s*\|/i,
  ]);

  const target1 = extract(t, [
    /\|\s*\**(?:Target\s*1|TP1)\**\s*\|\s*([^|]+)\s*\|/i,
  ]);

  const target2 = extract(t, [
    /\|\s*\**(?:Target\s*2|TP2)\**\s*\|\s*([^|]+)\s*\|/i,
  ]);

  const riskReward = extract(t, [
    /\|\s*\**(?:Risk\s*:\s*Reward|R:R)\**\s*\|\s*([^|]+)\s*\|/i,
  ]);

  const timeframe = extract(t, [
    /\|\s*\**(?:Holding\s*Period|Timeframe|Time\s*Frame)\**\s*\|\s*([^|]+)\s*\|/i,
  ]);

  const risks = extractRisks(t);

  return {
    ticker,
    company,
    currentPrice,
    dayOpen,
    dayHigh,
    dayLow,
    prevClose,
    change,
    changePct,
    volume,
    avgVolume,
    weekHigh52,
    weekLow52,
    trend,
    ema20,
    ema50,
    ema200,
    maSignal,
    trendStructure,
    rsi,
    rsiSignal,
    macdLine,
    macdSignal,
    macdHist,
    stochK,
    stochD,
    bbUpper,
    bbMiddle,
    bbLower,
    bbSqueeze,
    atr,
    pp,
    r1,
    r2,
    s1,
    s2,
    pattern,
    patternMeaning,
    volumeRatio,
    volumeInterpretation,
    bias,
    confidence,
    outlookText,
    action,
    entryZone,
    stopLoss,
    target1,
    target2,
    riskReward,
    timeframe,
    risks,
    rawText: t,
  };
}
