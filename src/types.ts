export type Category = "Forex" | "Commodities" | "Crypto" | "Indices" | "Stocks";

export interface MarketSymbol {
  symbol: string;
  category: Category;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
  spread: string;
  sparkline?: number[];
}

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AIAnalysisResult {
  analysis: string;
  bias: "Bullish" | "Bearish" | "Neutral";
  confidence: number;
  supportLevel: string;
  resistanceLevel: string;
  keyFactors: string[];
  source?: "gemini" | "fallback";
}

export interface AISignal {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  timeframe: string;
  entry: string;
  stopLoss: string;
  takeProfit1: string;
  takeProfit2: string;
  confidence: number;
  timestamp: string;
  status: "ACTIVE" | "WIN" | "LOSS" | "PENDING";
  rationale: string;
}

export interface TradePosition {
  id: string;
  symbol: string;
  type: "HIGHER" | "LOWER" | "BUY" | "SELL";
  amount: number;
  entryPrice: number;
  currentPrice: number;
  expirationTime: string;
  timestamp: number;
  payout: number;
  status: "OPEN" | "WON" | "LOST";
  pl: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  impact: "High" | "Medium" | "Low";
  summary: string;
  relatedSymbols: string[];
}

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  impact: "High" | "Medium" | "Low";
  actual?: string;
  forecast?: string;
  previous?: string;
}

export interface UserAccount {
  name: string;
  accountType: "Demo Account" | "Real Live Account" | "VIP Institutional";
  accountNumber: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  tier: string;
  avatarUrl?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "signal" | "alert" | "system" | "trade";
  read: boolean;
}

export interface WindowsAppSettings {
  theme: "dark" | "light" | "system";
  accentColor: string;
  launchOnStartup: boolean;
  minimizeToTray: boolean;
  highDpiScaling: boolean;
  offlineCacheEnabled: boolean;
  encryptedDatabase: boolean;
  securityPin: string;
  soundEffects: boolean;
  nativeNotifications: boolean;
  autoSyncOffline: boolean;
}

export type ViewTab =
  | "dashboard"
  | "markets"
  | "watchlist"
  | "portfolio"
  | "chart"
  | "analysis"
  | "signals"
  | "news"
  | "calendar"
  | "alerts"
  | "reports"
  | "settings"
  | "task-list"
  | "analytics"
  | "installer_hub";
