# StockSense - AI-Powered Institutional Stock Analysis Dashboard

StockSense is an institutional-grade, real-time stock technical analysis dashboard. It provides powerful AI-driven insights—including EMA trends, RSI, MACD, Bollinger Bands, support/resistance levels, candlestick pattern matching, and comprehensive trade recommendations—all packed in a sleek, premium, Bloomberg-terminal-esque UI.

## 🚀 Features

- **AI Prompt Analysis**: Just ask naturally (e.g., "Analyze HDFC Bank this month").
- **Real-Time Data Extraction**: Hooked up to an n8n webhook processing powerful agentic workflows.
- **Premium UI**: Built with Next.js, Tailwind CSS, and shadcn styling.
- **Indicators Covered**:
  - Moving Averages (EMA 20, 50, 200)
  - Momentum (RSI, MACD, Stochastic)
  - Volatility (Bollinger Bands, ATR)
  - Raw Price Action (Support, Resistance, Pivot Points)
  - Candlestick Patterns
- **Trade Setups**: Explicit Stop Loss, Target Zones, Timeframes, and Risk/Reward Ratios.
- **Dark & Light Modes**: Seamless theme toggling to fit your trading environment.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Hooking**: Axios API fetching connecting to n8n Webhook.
- **Fonts**: Inter, Source Serif 4, JetBrains Mono.

## ⚙️ Setup & Installation

Follow these steps to spin up the dashboard locally:

### 1. Clone the repository

```bash
git clone <your-github-repo-url>
cd stockanalyser
```

### 2. Install dependencies

Make sure you have Node installed (v18+ recommended).

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file at the root of your project. Copy the template from `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and paste your specific n8n webhook URL:
```env
NEXT_PUBLIC_N8N_WEBHOOK_URL="https://your_n8n_cloud_url.com/webhook/stock-analysis"
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔗 n8n Workflow Integration

This project relies on an external API (n8n Webhook) for dynamic stock parsing. Ensure that your backend returns data in the designated Markdown table format so that `src/lib/parseAnalysis.ts` can extract figures seamlessly.

### Example Webhook JSON Payload format expected from Frontend:
```json
{
  "query": "Analyze Tesla stock"
}
```
*or directly by Ticker:*
```json
{
  "company": "Tesla Inc.",
  "symbol": "TSLA"
}
```

## 📜 Contributing & Modifying
If you wish to edit the parsing regex, simply tweak `src/lib/parseAnalysis.ts`. Component files are modular inside `src/components/`, ensuring easy customization over the trading indicators.
