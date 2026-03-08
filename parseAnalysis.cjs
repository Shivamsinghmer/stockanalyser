"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var parseAnalysis_exports = {};
__export(parseAnalysis_exports, {
  parseAnalysis: () => parseAnalysis
});
module.exports = __toCommonJS(parseAnalysis_exports);
function extract(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return (match[1] || match[2] || "").trim();
    }
  }
  return "\u2014";
}
function extractBool(text, patterns) {
  for (const pattern of patterns) {
    if (pattern.test(text)) return true;
  }
  return false;
}
function extractBias(text) {
  const upper = text.toUpperCase();
  const bullishCount = (upper.match(/\bBULLISH\b/g) || []).length;
  const bearishCount = (upper.match(/\bBEARISH\b/g) || []).length;
  const neutralCount = (upper.match(/\bNEUTRAL\b/g) || []).length;
  const sidewaysCount = (upper.match(/\bSIDEWAYS\b/g) || []).length;
  const biasMatch = upper.match(
    /(?:OVERALL\s+BIAS|BIAS\s*[:=])\s*(BULLISH|BEARISH|NEUTRAL|SIDEWAYS)/
  );
  if (biasMatch) return biasMatch[1];
  if (bullishCount > bearishCount && bullishCount > neutralCount)
    return "BULLISH";
  if (bearishCount > bullishCount && bearishCount > neutralCount)
    return "BEARISH";
  if (sidewaysCount > 0) return "SIDEWAYS";
  return "NEUTRAL";
}
function extractAction(text) {
  const upper = text.toUpperCase();
  const actionMatch = upper.match(
    /(?:RECOMMENDATION|ACTION|TRADE\s+ACTION|SUGGESTED\s+ACTION)\s*[:=]?\s*(BUY|SELL|WAIT|AVOID|HOLD)/
  );
  if (actionMatch) {
    const a = actionMatch[1];
    if (a === "HOLD") return "WAIT";
    return a;
  }
  if (/\bSTRONG\s+BUY\b/.test(upper)) return "BUY";
  if (/\bSTRONG\s+SELL\b/.test(upper)) return "SELL";
  const bias = extractBias(text);
  if (bias === "BULLISH") return "BUY";
  if (bias === "BEARISH") return "SELL";
  return "WAIT";
}
function extractRisks(text) {
  const risks = [];
  const risksSection = text.match(
    /(?:KEY\s+RISKS?|RISKS?\s*[:=])([\s\S]*?)(?:\n#{1,3}\s|\n\*\*[A-Z]|\n---|\Z)/i
  );
  if (risksSection) {
    const lines = risksSection[1].split("\n");
    for (const line of lines) {
      const cleaned = line.replace(/^[\s\-\*\•\d\.]+/, "").trim();
      if (cleaned.length > 10 && cleaned.length < 300) {
        risks.push(cleaned);
      }
    }
  }
  if (risks.length === 0) {
    const lines = text.split("\n");
    for (const line of lines) {
      if (/risk|stop.?loss|downside|concern|warning|caution/i.test(line) && line.length > 15) {
        const cleaned = line.replace(/^[\s\-\*\•\d\.]+/, "").trim();
        if (cleaned.length > 10) risks.push(cleaned);
        if (risks.length >= 4) break;
      }
    }
  }
  return risks.slice(0, 5);
}
function extractOutlook(text) {
  const section = text.match(
    /(?:OUTLOOK|OVERALL\s+OUTLOOK|CONCLUSION|SUMMARY|ANALYST\s+NOTE|BIAS\s*&\s*OUTLOOK)([\s\S]{50,600}?)(?:\n#{1,3}\s|\n\*\*[A-Z]{3,}|\n---)/i
  );
  if (section) return section[1].replace(/\*+/g, "").trim();
  const paras = text.split(/\n{2,}/);
  for (let i = paras.length - 1; i >= 0; i--) {
    const p = paras[i].replace(/\*+/g, "").trim();
    if (p.length > 50) return p.substring(0, 600);
  }
  return "Analysis complete. Review the metrics above for a complete picture.";
}
function parseAnalysis(text, ticker, company) {
  const t = typeof text === "string" ? text : JSON.stringify(text);
  const currentPrice = extract(t, [
    /\|\s*Current\s*Price\s*\|\s*([^|]+)\s*\|/i,
    /Current\s*Price\s*[:=₹$]\s*([\d,\.]+)/i
  ]);
  const ohlc = extract(t, [
    /\|\s*Today Open \/ High \/ Low\s*\|\s*([^|]+)\s*\|/i
  ]);
  const ohlcParts = ohlc.split("/").map((s) => s.trim());
  const dayOpen = ohlcParts[0] || "\u2014";
  const dayHigh = ohlcParts[1] || "\u2014";
  const dayLow = ohlcParts[2] || "\u2014";
  const prevClose = extract(t, [
    /\|\s*Previous\s*Close\s*\|\s*([^|]+)\s*\|/i,
    /Prev(?:ious)?\s*Close\s*[:=₹$]\s*([\d,\.]+)/i
  ]);
  const changeRaw = extract(t, [
    /\|\s*Change\s*\|\s*([^|]+)\s*\|/i,
    /Change\s*[:=₹$]\s*([+-]?[\d,\.]+)/i
  ]);
  const changeParts = changeRaw.split("(").map((s) => s.replace(")", "").trim());
  const change = changeParts[0] || "\u2014";
  const changePct = changeParts[1] || "\u2014";
  const volAvg = extract(t, [
    /\|\s*Volume vs Avg\s*\|\s*([^|]+)\s*\|/i
  ]);
  const volParts = volAvg.split("(").map((s) => s.replace(")", "").trim());
  const volume = volParts[0] || "\u2014";
  const volumeRatioMatches = volParts[1] ? volParts[1].match(/([\d\.]+)[xX]/) : null;
  const volumeRatio = volumeRatioMatches ? volumeRatioMatches[1] : "\u2014";
  let avgVolume = "\u2014";
  if (volume !== "\u2014" && volumeRatio !== "\u2014" && !isNaN(parseFloat(volumeRatio))) {
    const volNum = parseFloat(volume.replace(/[^0-9.]/g, ""));
    const ratioNum = parseFloat(volumeRatio);
    if (ratioNum > 0) avgVolume = Math.round(volNum / ratioNum).toLocaleString();
  }
  const highsLows = extract(t, [
    /\|\s*52-Week High \/ Low\s*\|\s*([^|]+)\s*\|/i
  ]);
  const hlParts = highsLows.split("/").map((s) => s.trim());
  const weekHigh52 = hlParts[0] || "\u2014";
  const weekLow52 = hlParts[1] || "\u2014";
  const trendRaw = extract(t, [
    /\-\s*\*\*Primary\s*Trend:\*\*\s*(.+)/i
  ]);
  let trend = "SIDEWAYS";
  if (/BULLISH|UP/i.test(trendRaw)) trend = "BULLISH";
  else if (/BEARISH|DOWN/i.test(trendRaw)) trend = "BEARISH";
  else trend = "SIDEWAYS";
  const ema20 = extract(t, [
    /\-\s*\*\*EMA\s*20:\*\*\s*([^\s—]+)/i
  ]);
  const ema50 = extract(t, [
    /\-\s*\*\*EMA\s*50:\*\*\s*([^\s—]+)/i
  ]);
  const ema200 = extract(t, [
    /\-\s*\*\*EMA\s*200:\*\*\s*([^\s—]+)/i
  ]);
  const maSignal = extract(t, [
    /\-\s*\*\*MA\s*Signal:\*\*\s*(.+)/i
  ]);
  const rsiLine = extract(t, [
    /\-\s*\*\*RSI\s*\(14\):\*\*\s*(.+)/i
  ]);
  const rsiParts = rsiLine.split("\u2192").map((s) => s.trim());
  const rsi = rsiParts[0] || "\u2014";
  const rsiSignal = rsiParts[1] ? rsiParts[1].replace(/[^a-zA-Z]/g, "") : "\u2014";
  const macdLineRaw = extract(t, [
    /\-\s*\*\*MACD:\*\*\s*(.+)/i
  ]);
  const macdLine = extract(macdLineRaw, [/Line=([^\s]+)/i]);
  const macdSignal = extract(macdLineRaw, [/Signal=([^\s]+)/i]);
  const macdHist = extract(macdLineRaw, [/Hist=([^\s]+)/i]);
  const stochLine = extract(t, [
    /\-\s*\*\*Stochastic:\*\*\s*(.+)/i
  ]);
  const stochK = extract(stochLine, [/%K=([^\s]+)/i]);
  const stochD = extract(stochLine, [/%D=([^\s]+)/i]);
  const bbLine = extract(t, [
    /\-\s*\*\*Bollinger\s*Bands:\*\*\s*(.+)/i
  ]);
  const bbUpper = extract(bbLine, [/Upper=([^\s]+)/i]);
  const bbMiddle = extract(bbLine, [/Mid=([^\s]+)/i]);
  const bbLower = extract(bbLine, [/Lower=([^\s]+)/i]);
  const bbSqueeze = extractBool(t, [
    /→\s*Squeeze:\s*Yes/i
  ]);
  const atrLine = extract(t, [
    /\-\s*\*\*ATR\s*(?:\(14\))?:\*\*\s*([^\s(]+)/i
  ]);
  const atr = atrLine;
  const pp = extract(t, [
    /\|\s*.*?Pivot\s*Point\s*\|\s*([^|]+)\s*\|/i
  ]);
  const r1 = extract(t, [
    /\|\s*.*?Resistance\s*1\s*\(R1\)\s*\|\s*([^|]+)\s*\|/i
  ]);
  const r2 = extract(t, [
    /\|\s*.*?Resistance\s*2\s*\(R2\)\s*\|\s*([^|]+)\s*\|/i
  ]);
  const s1 = extract(t, [
    /\|\s*.*?Support\s*1\s*\(S1\)\s*\|\s*([^|]+)\s*\|/i
  ]);
  const s2 = extract(t, [
    /\|\s*.*?Support\s*2\s*\(S2\)\s*\|\s*([^|]+)\s*\|/i
  ]);
  const pattern = extract(t, [
    /\-\s*\*\*Detected:\*\*\s*(.+)/i
  ]);
  const patternMeaning = extract(t, [
    /\-\s*\*\*Meaning:\*\*\s*(.+)/i
  ]);
  let patternSignal = "NEUTRAL";
  if (/bullish|up/i.test(patternMeaning)) patternSignal = "BULLISH";
  else if (/bearish|down/i.test(patternMeaning)) patternSignal = "BEARISH";
  const volumeInterpretation = extract(t, [
    /\-\s*Interpretation:\s*(.+)/i
  ]);
  const bias = extractBias(t);
  const confidence = extract(t, [
    /(?:Confidence|Confidence\s*Level)\s*[:=]\s*(High|Medium|Low)/i
  ]);
  const outlookText = extractOutlook(t);
  const action = extractAction(t);
  const entryZone = extract(t, [
    /\|\s*\**(?:Entry\s*Zone|Buy\s*Zone)\**\s*\|\s*([^|]+)\s*\|/i
  ]);
  const stopLoss = extract(t, [
    /\|\s*\**(?:Stop\s*Loss|SL)\**\s*\|\s*([^|]+)\s*\|/i
  ]);
  const target1 = extract(t, [
    /\|\s*\**(?:Target\s*1|TP1)\**\s*\|\s*([^|]+)\s*\|/i
  ]);
  const target2 = extract(t, [
    /\|\s*\**(?:Target\s*2|TP2)\**\s*\|\s*([^|]+)\s*\|/i
  ]);
  const riskReward = extract(t, [
    /\|\s*\**(?:Risk\s*:\s*Reward|R:R)\**\s*\|\s*([^|]+)\s*\|/i
  ]);
  const timeframe = extract(t, [
    /\|\s*\**(?:Holding\s*Period|Timeframe|Time\s*Frame)\**\s*\|\s*([^|]+)\s*\|/i
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
    patternSignal,
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
    rawText: t
  };
}
