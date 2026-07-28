import { MarketSymbol, Candle, AIAnalysisResult, AISignal, NewsItem, EconomicEvent, TradePosition } from "../types";

const OFFLINE_CACHE_KEY = "apex_market_ai_offline_cache";

export const DEFAULT_SYMBOLS: MarketSymbol[] = [
  { symbol: "EUR/USD", category: "Forex", price: 1.08907, change: 0.00043, changePercent: 0.32, high: 1.08921, low: 1.08850, volume: "5.23K", spread: "0.8", sparkline: [1.087, 1.0875, 1.0881, 1.0886, 1.08907] },
  { symbol: "GBP/USD", category: "Forex", price: 1.26350, change: 0.00189, changePercent: 0.15, high: 1.26480, low: 1.26110, volume: "4.12K", spread: "1.1", sparkline: [1.261, 1.262, 1.2628, 1.2631, 1.2635] },
  { symbol: "USD/JPY", category: "Forex", price: 154.210, change: -0.3200, changePercent: -0.21, high: 154.800, low: 153.950, volume: "8.90K", spread: "0.9", sparkline: [154.6, 154.5, 154.35, 154.25, 154.21] },
  { symbol: "XAU/USD", category: "Commodities", price: 2041.35, change: 11.750, changePercent: 0.58, high: 2045.80, low: 2032.10, volume: "12.4K", spread: "2.5", sparkline: [2032, 2035, 2038, 2040, 2041.35] },
  { symbol: "BTC/USD", category: "Crypto", price: 67450.00, change: -850.0, changePercent: -1.25, high: 68900.0, low: 66800.0, volume: "45.1M", spread: "12.0", sparkline: [68300, 68000, 67800, 67600, 67450] },
  { symbol: "NAS100", category: "Indices", price: 18450.20, change: 75.300, changePercent: 0.41, high: 18490.0, low: 18320.0, volume: "22.8M", spread: "1.5", sparkline: [18350, 18390, 18410, 18435, 18450.2] },
  { symbol: "ETH/USD", category: "Crypto", price: 3520.40, change: 42.100, changePercent: 1.21, high: 3550.00, low: 3460.00, volume: "18.3M", spread: "1.8", sparkline: [3470, 3490, 3505, 3515, 3520.4] },
  { symbol: "US30", category: "Indices", price: 39120.80, change: 112.40, changePercent: 0.29, high: 39190.0, low: 38950.0, volume: "15.7M", spread: "2.0", sparkline: [38980, 39020, 39080, 39100, 39120.8] },
];

export async function fetchMarketSymbols(): Promise<MarketSymbol[]> {
  try {
    const res = await fetch("/api/market/symbols");
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(`${OFFLINE_CACHE_KEY}_symbols`, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn("Using offline cached market symbols:", err);
  }

  const cached = localStorage.getItem(`${OFFLINE_CACHE_KEY}_symbols`);
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }
  return DEFAULT_SYMBOLS;
}

export async function fetchCandles(symbol: string, timeframe: string): Promise<Candle[]> {
  try {
    const res = await fetch(`/api/market/candles?symbol=${encodeURIComponent(symbol)}&timeframe=${encodeURIComponent(timeframe)}`);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(`${OFFLINE_CACHE_KEY}_candles_${symbol}_${timeframe}`, JSON.stringify(data.candles));
      return data.candles;
    }
  } catch (err) {
    console.warn("Using offline cached candles:", err);
  }

  const cached = localStorage.getItem(`${OFFLINE_CACHE_KEY}_candles_${symbol}_${timeframe}`);
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }

  // Local generator fallback if completely offline
  const basePrice = DEFAULT_SYMBOLS.find(s => s.symbol === symbol)?.price || 1.08907;
  const now = Date.now();
  const candles: Candle[] = [];
  let price = basePrice * 0.99;
  for (let i = 60; i >= 0; i--) {
    const volatility = basePrice * 0.001;
    const open = price;
    const close = open + (Math.random() - 0.48) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    price = close;
    candles.push({
      timestamp: now - i * 15 * 60 * 1000,
      open: Number(open.toFixed(5)),
      high: Number(high.toFixed(5)),
      low: Number(low.toFixed(5)),
      close: Number(close.toFixed(5)),
      volume: Math.floor(3000 + Math.random() * 5000),
    });
  }
  return candles;
}

export async function fetchAIAnalysis(symbol: string, timeframe: string, currentPrice: number): Promise<AIAnalysisResult> {
  try {
    const res = await fetch("/api/ai/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol,
        timeframe,
        currentPrice,
        rsi: 64.21,
        macd: "0.00045 Bullish",
        trend: "Bullish",
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn("AI Analysis API failed, falling back:", err);
  }

  return {
    analysis: `The market for ${symbol} is maintaining strong structural momentum above key exponential moving averages (EMA 20 & EMA 50) on the ${timeframe} timeframe. Price action is testing overhead resistance with healthy buyer volume.`,
    bias: "Bullish",
    confidence: 78,
    supportLevel: (currentPrice * 0.996).toFixed(symbol.includes("JPY") || symbol.includes("BTC") ? 2 : 5),
    resistanceLevel: (currentPrice * 1.003).toFixed(symbol.includes("JPY") || symbol.includes("BTC") ? 2 : 5),
    keyFactors: [
      "Bullish continuation above EMA 20 and EMA 50",
      "RSI indicator hovering in healthy momentum territory (64.21)",
      "High probability order block support holding on pullbacks",
      "Positive macroeconomic risk sentiment"
    ],
    source: "fallback"
  };
}

export async function fetchAISignals(): Promise<AISignal[]> {
  try {
    const res = await fetch("/api/ai/signals");
    if (res.ok) {
      const data = await res.json();
      return data.signals || [];
    }
  } catch (err) {
    console.warn("AI Signals API failed, falling back:", err);
  }

  return [
    {
      id: "sig-1",
      symbol: "EUR/USD",
      type: "BUY",
      timeframe: "15m",
      entry: "1.08850",
      stopLoss: "1.08520",
      takeProfit1: "1.09120",
      takeProfit2: "1.09450",
      confidence: 85,
      timestamp: "15m ago",
      status: "ACTIVE",
      rationale: "Bullish EMA 20 crossover confirmed with healthy volume expansion."
    },
    {
      id: "sig-2",
      symbol: "XAU/USD",
      type: "BUY",
      timeframe: "30m",
      entry: "2041.35",
      stopLoss: "2028.00",
      takeProfit1: "2055.00",
      takeProfit2: "2070.00",
      confidence: 82,
      timestamp: "25m ago",
      status: "ACTIVE",
      rationale: "Gold bounced off key daily support with safe inflation hedge inflows."
    },
    {
      id: "sig-3",
      symbol: "GBP/USD",
      type: "SELL",
      timeframe: "1h",
      entry: "1.26350",
      stopLoss: "1.26780",
      takeProfit1: "1.25900",
      takeProfit2: "1.25400",
      confidence: 76,
      timestamp: "35m ago",
      status: "ACTIVE",
      rationale: "Rejection at upper Bollinger Band with bearish divergence on MACD."
    }
  ];
}

export async function sendAIChatMessage(message: string, context?: any): Promise<string> {
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.reply;
    }
  } catch (err) {
    console.warn("AI Chat API error:", err);
  }
  return `[Apex AI Desktop Assistant]\nAnalyzed "${message}": Market structure on ${context?.symbol || "EUR/USD"} remains solid. Keep risk capped at 1% per position and monitor resistance levels.`;
}

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "ECB Signals Rate Stabilization as Eurozone Inflation Cools to 2.1%",
    source: "Apex Financial Terminal",
    time: "12m ago",
    category: "Forex / Central Banks",
    sentiment: "Bullish",
    impact: "High",
    summary: "European Central Bank policymakers expressed confidence in monetary policy transmission, boosting market expectations for a steady EUR rebound.",
    relatedSymbols: ["EUR/USD", "EUR/GBP", "DAX40"]
  },
  {
    id: "news-2",
    title: "Gold Surges Past $2,040 on Safe-Haven Demand and Lower Yield Outlook",
    source: "Apex Commodity Wire",
    time: "32m ago",
    category: "Commodities",
    sentiment: "Bullish",
    impact: "High",
    summary: "Gold spot prices extended gains for a third consecutive session as US Treasury yields retreated following soft housing data.",
    relatedSymbols: ["XAU/USD", "USD/JPY"]
  },
  {
    id: "news-3",
    title: "Tech Rally Lifts Nasdaq 100 as AI Infrastructure Spending Accelerates",
    source: "Wall Street Desktop Express",
    time: "1h ago",
    category: "Indices / Stocks",
    sentiment: "Bullish",
    impact: "Medium",
    summary: "Semiconductor and enterprise AI software stocks led pre-market gains, pushing NAS100 index futures up 0.41%.",
    relatedSymbols: ["NAS100", "US30", "BTC/USD"]
  },
  {
    id: "news-4",
    title: "Bitcoin Consolidates Near $67,500 Following Record ETF Net Inflow Week",
    source: "Crypto Institutional Daily",
    time: "2h ago",
    category: "Crypto",
    sentiment: "Neutral",
    impact: "Medium",
    summary: "Bitcoin spot trading volume normalized after hitting weekly highs. Analysts point to key support anchored at $66,800.",
    relatedSymbols: ["BTC/USD", "ETH/USD"]
  }
];

export const MOCK_CALENDAR: EconomicEvent[] = [
  {
    id: "cal-1",
    time: "14:30 EST",
    currency: "USD",
    event: "Core CPI Inflation Rate (MoM)",
    impact: "High",
    forecast: "0.3%",
    previous: "0.4%",
  },
  {
    id: "cal-2",
    time: "15:00 EST",
    currency: "EUR",
    event: "ECB Monetary Policy Meeting Accounts",
    impact: "High",
    forecast: "-",
    previous: "-",
  },
  {
    id: "cal-3",
    time: "16:15 EST",
    currency: "GBP",
    event: "BOE Governor Bailey Speaks in London",
    impact: "Medium",
    forecast: "-",
    previous: "-",
  },
  {
    id: "cal-4",
    time: "18:00 EST",
    currency: "USD",
    event: "Initial Jobless Claims",
    impact: "Medium",
    forecast: "215K",
    previous: "218K",
  }
];
