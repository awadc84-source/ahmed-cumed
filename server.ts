import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini AI client lazily/safely
let genAI: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// Simulated real-time market data generator helper
const MOCK_SYMBOLS = [
  { symbol: "EUR/USD", category: "Forex", price: 1.08907, change: 0.00043, changePercent: 0.32, high: 1.08921, low: 1.08850, volume: "5.23K", spread: "0.8" },
  { symbol: "GBP/USD", category: "Forex", price: 1.26350, change: 0.00189, changePercent: 0.15, high: 1.26480, low: 1.26110, volume: "4.12K", spread: "1.1" },
  { symbol: "USD/JPY", category: "Forex", price: 154.210, change: -0.3200, changePercent: -0.21, high: 154.800, low: 153.950, volume: "8.90K", spread: "0.9" },
  { symbol: "XAU/USD", category: "Commodities", price: 2041.35, change: 11.750, changePercent: 0.58, high: 2045.80, low: 2032.10, volume: "12.4K", spread: "2.5" },
  { symbol: "BTC/USD", category: "Crypto", price: 67450.00, change: -850.0, changePercent: -1.25, high: 68900.0, low: 66800.0, volume: "45.1M", spread: "12.0" },
  { symbol: "NAS100", category: "Indices", price: 18450.20, change: 75.300, changePercent: 0.41, high: 18490.0, low: 18320.0, volume: "22.8M", spread: "1.5" },
  { symbol: "ETH/USD", category: "Crypto", price: 3520.40, change: 42.100, changePercent: 1.21, high: 3550.00, low: 3460.00, volume: "18.3M", spread: "1.8" },
  { symbol: "US30", category: "Indices", price: 39120.80, change: 112.40, changePercent: 0.29, high: 39190.0, low: 38950.0, volume: "15.7M", spread: "2.0" },
];

// Generate synthetic candles for charts
function generateCandles(symbol: string, timeframe: string = "15m", count: number = 60) {
  const symbolInfo = MOCK_SYMBOLS.find(s => s.symbol === symbol) || MOCK_SYMBOLS[0];
  let basePrice = symbolInfo.price;
  const now = Date.now();
  
  let stepMs = 15 * 60 * 1000;
  if (timeframe === "1m") stepMs = 60 * 1000;
  if (timeframe === "5m") stepMs = 5 * 60 * 1000;
  if (timeframe === "30m") stepMs = 30 * 60 * 1000;
  if (timeframe === "1h") stepMs = 60 * 60 * 1000;
  if (timeframe === "4h") stepMs = 4 * 60 * 60 * 1000;
  if (timeframe === "1D") stepMs = 24 * 60 * 60 * 1000;

  const candles = [];
  let currentPrice = basePrice * (1 - (count * 0.0008) / 2);

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * stepMs;
    const volatility = basePrice * 0.0015;
    const open = currentPrice;
    const change = (Math.random() - 0.48) * volatility;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.6;
    const low = Math.min(open, close) - Math.random() * volatility * 0.6;
    const volume = Math.floor(2000 + Math.random() * 8000);

    // Calculate simulated indicators
    currentPrice = close;
    candles.push({
      timestamp,
      open: Number(open.toFixed(symbol.includes("JPY") || symbol.includes("BTC") || symbol.includes("NAS") ? 2 : 5)),
      high: Number(high.toFixed(symbol.includes("JPY") || symbol.includes("BTC") || symbol.includes("NAS") ? 2 : 5)),
      low: Number(low.toFixed(symbol.includes("JPY") || symbol.includes("BTC") || symbol.includes("NAS") ? 2 : 5)),
      close: Number(close.toFixed(symbol.includes("JPY") || symbol.includes("BTC") || symbol.includes("NAS") ? 2 : 5)),
      volume,
    });
  }

  // Ensure latest candle reflects current live price
  if (candles.length > 0) {
    candles[candles.length - 1].close = symbolInfo.price;
    candles[candles.length - 1].high = Math.max(candles[candles.length - 1].high, symbolInfo.price);
    candles[candles.length - 1].low = Math.min(candles[candles.length - 1].low, symbolInfo.price);
  }

  return candles;
}

// --- API ROUTES ---

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Apex Market AI",
    version: "1.0.0",
    platform: "Windows 11 Native Desktop",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

app.get("/api/market/symbols", (req, res) => {
  // Add minor jitter for live tick simulation
  const symbolsWithJitter = MOCK_SYMBOLS.map(s => {
    const jitter = (Math.random() - 0.5) * (s.price * 0.0001);
    const newPrice = Number((s.price + jitter).toFixed(s.symbol.includes("JPY") || s.symbol.includes("BTC") || s.symbol.includes("NAS") ? 2 : 5));
    return {
      ...s,
      price: newPrice,
    };
  });
  res.json(symbolsWithJitter);
});

app.get("/api/market/candles", (req, res) => {
  const symbol = (req.query.symbol as string) || "EUR/USD";
  const timeframe = (req.query.timeframe as string) || "15m";
  const candles = generateCandles(symbol, timeframe, 70);
  res.json({ symbol, timeframe, candles });
});

// Gemini AI Market Analysis Endpoint
app.post("/api/ai/analysis", async (req, res) => {
  try {
    const { symbol, timeframe, currentPrice, rsi, macd, trend } = req.body;
    const aiClient = getGenAIClient();

    if (!aiClient) {
      // Return realistic fallback response if API key is not yet set
      return res.json({
        analysis: `The market for ${symbol || "EUR/USD"} is demonstrating strong momentum on the ${timeframe || "15m"} timeframe. Price structure remains well above EMA 20 and EMA 50. Key resistance is identified near 1.09120, with primary support anchored at 1.08540. A clean breakout past resistance targets 1.09450.`,
        bias: "Bullish",
        confidence: 78,
        supportLevel: "1.08540",
        resistanceLevel: "1.09120",
        keyFactors: [
          "Sustained price action above EMA 20 and EMA 50",
          "RSI (14) holding neutral-bullish territory at 64.21",
          "Favorable risk-to-reward ratio on pullbacks to EMA 20 support",
          "Positive correlation with macroeconomic market flow"
        ],
        source: "fallback"
      });
    }

    const prompt = `You are Apex Market AI, an elite institutional trading analyst engine embedded in a Windows 11 desktop app.
Analyze the following asset setup:
- Asset Symbol: ${symbol || "EUR/USD"}
- Timeframe: ${timeframe || "15m"}
- Current Price: ${currentPrice || "1.08907"}
- RSI (14): ${rsi || "64.21"}
- MACD Status: ${macd || "0.00045 Bullish"}
- Structure Trend: ${trend || "Bullish"}

Provide a concise technical summary (2-3 sentences), Market Bias (Bullish/Bearish/Neutral), Confidence Percentage (0-100), Key Support, Key Resistance, and 4 bullet points of technical factors. Return JSON format.`;

    const aiResponse = await aiClient.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = aiResponse.text || "{}";
    const parsed = JSON.parse(text);
    return res.json({ ...parsed, source: "gemini" });
  } catch (error: any) {
    console.error("Gemini AI Analysis Error:", error);
    res.status(500).json({
      error: "Failed to generate AI analysis",
      details: error.message,
    });
  }
});

// Gemini AI Trading Signals Endpoint
app.get("/api/ai/signals", async (req, res) => {
  try {
    const aiClient = getGenAIClient();

    if (!aiClient) {
      return res.json({
        signals: [
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
          },
          {
            id: "sig-4",
            symbol: "BTC/USD",
            type: "BUY",
            timeframe: "4h",
            entry: "67200.00",
            stopLoss: "65800.00",
            takeProfit1: "69500.00",
            takeProfit2: "72000.00",
            confidence: 88,
            timestamp: "1h ago",
            status: "ACTIVE",
            rationale: "Bullish flag breakout pattern on 4h chart with rising institutional volume."
          }
        ],
        source: "fallback"
      });
    }

    const prompt = `Generate 4 active institutional trading signals for Apex Market AI (Forex & Crypto). 
For each signal, provide: id, symbol (e.g. EUR/USD, XAU/USD, GBP/USD, BTC/USD), type (BUY or SELL), timeframe (15m, 30m, 1h, 4h), entry price, stopLoss, takeProfit1, takeProfit2, confidence (60-95), timestamp (e.g. "12m ago"), status ("ACTIVE"), and a 1-sentence technical rationale.
Return valid JSON object containing an array under "signals".`;

    const aiResponse = await aiClient.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(aiResponse.text || "{}");
    return res.json({ ...parsed, source: "gemini" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Gemini AI Interactive Assistant Chat Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    const aiClient = getGenAIClient();

    if (!aiClient) {
      return res.json({
        reply: `[Apex AI Desktop Assistant]\nRegarding "${message}": The market currently shows strong structure on ${context?.symbol || "EUR/USD"}. Based on automated technical indicators, maintaining proper risk management (1-2% per trade) near current support levels offers optimal probability. Configure your GEMINI_API_KEY in Secrets for live adaptive responses!`,
        source: "fallback"
      });
    }

    const response = await aiClient.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction: `You are Apex Market AI, a professional Windows 11 desktop trading co-pilot.
Provide concise, highly accurate, institutional-grade advice on technical analysis, chart patterns, risk management, and order strategies. Keep answers scannable with bullet points and clear risk parameters. Current asset context: ${JSON.stringify(context || {})}`,
      }
    });

    return res.json({ reply: response.text, source: "gemini" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- VITE MIDDLEWARE & STATIC SERVER ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Apex Market AI Windows Desktop App running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
