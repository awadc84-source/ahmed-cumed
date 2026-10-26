import React, { useState, useEffect } from "react";
import { WindowsTitleBar } from "./components/WindowsTitleBar";
import { Sidebar } from "./components/Sidebar";
import { WindowsStatusBar } from "./components/WindowsStatusBar";
import { DashboardView } from "./views/DashboardView";
import { MarketsView } from "./views/MarketsView";
import { WatchlistView } from "./views/WatchlistView";
import { PortfolioView } from "./views/PortfolioView";
import { ChartView } from "./views/ChartView";
import { AnalysisView } from "./views/AnalysisView";
import { SignalsView } from "./views/SignalsView";
import { NewsView } from "./views/NewsView";
import { CalendarView } from "./views/CalendarView";
import { AlertsView } from "./views/AlertsView";
import { ReportsView } from "./views/ReportsView";
import { SettingsView } from "./views/SettingsView";
import { TaskListView } from "./views/TaskListView";
import { AnalyticsView } from "./views/AnalyticsView";
import { WindowsInstallerHub } from "./components/WindowsInstallerHub";
import { AIAssistantDrawer } from "./components/AIAssistantDrawer";
import { QuickCommandPalette } from "./components/QuickCommandPalette";

import { 
  fetchMarketSymbols, 
  fetchCandles, 
  fetchAIAnalysis, 
  fetchAISignals, 
  DEFAULT_SYMBOLS 
} from "./services/api";

import { 
  MarketSymbol, 
  Candle, 
  AIAnalysisResult, 
  AISignal, 
  UserAccount, 
  TradePosition, 
  WindowsAppSettings, 
  ViewTab 
} from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>("dashboard");
  const [activeSymbol, setActiveSymbol] = useState("EUR/USD");
  const [timeframe, setTimeframe] = useState("15m");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Modals & Panels
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimizedTray, setIsMinimizedTray] = useState(false);

  // Account Data matching image_1.png ($10,250.75 Ahmed Premium)
  const [user, setUser] = useState<UserAccount>({
    name: "Ahmed",
    accountType: "Demo Account",
    accountNumber: "APEX-884920",
    balance: 10250.75,
    equity: 10250.75,
    margin: 0.0,
    freeMargin: 10250.75,
    marginLevel: 0,
    tier: "Premium",
  });

  // App Data State
  const [symbols, setSymbols] = useState<MarketSymbol[]>(DEFAULT_SYMBOLS);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysisResult>({
    analysis: "The market is showing bullish momentum above EMA 20 and EMA 50. Price is near resistance level 1.09120. A breakout above this level may continue the uptrend.",
    bias: "Bullish",
    confidence: 78,
    supportLevel: "1.08540",
    resistanceLevel: "1.09120",
    keyFactors: [
      "Bullish price action above EMA 20 and EMA 50",
      "RSI indicator holding neutral-bullish territory at 64.21",
      "Healthy market order flow support on pullbacks"
    ]
  });
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [positions, setPositions] = useState<TradePosition[]>([]);
  const [favorites, setFavorites] = useState<string[]>(["EUR/USD", "XAU/USD", "BTC/USD"]);

  // Windows Settings
  const [settings, setSettings] = useState<WindowsAppSettings>({
    theme: "dark",
    accentColor: "#38bdf8",
    launchOnStartup: true,
    minimizeToTray: true,
    highDpiScaling: true,
    offlineCacheEnabled: true,
    encryptedDatabase: true,
    securityPin: "1234",
    soundEffects: true,
    nativeNotifications: true,
    autoSyncOffline: true,
  });

  // Handle Online/Offline Status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Keyboard Shortcuts (Ctrl+K, Ctrl+B, Alt+F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch initial symbols and setup tick loop
  useEffect(() => {
    let isMounted = true;
    const loadSymbols = async () => {
      const data = await fetchMarketSymbols();
      if (isMounted) setSymbols(data);
    };
    loadSymbols();

    const interval = setInterval(loadSymbols, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Fetch candles when symbol or timeframe changes
  useEffect(() => {
    let isMounted = true;
    const loadCandles = async () => {
      const data = await fetchCandles(activeSymbol, timeframe);
      if (isMounted) setCandles(data);
    };
    loadCandles();
  }, [activeSymbol, timeframe]);

  // Fetch AI Analysis and Signals
  const loadAIAnalysis = async () => {
    setIsAnalysisLoading(true);
    const symInfo = symbols.find((s) => s.symbol === activeSymbol) || symbols[0];
    const data = await fetchAIAnalysis(activeSymbol, timeframe, symInfo.price);
    setAnalysis(data);
    setIsAnalysisLoading(false);
  };

  useEffect(() => {
    loadAIAnalysis();
  }, [activeSymbol]);

  useEffect(() => {
    const loadSignals = async () => {
      const sigs = await fetchAISignals();
      setSignals(sigs);
    };
    loadSignals();
  }, []);

  // Handlers
  const handleToggleFavorite = (sym?: string) => {
    const target = sym || activeSymbol;
    setFavorites((prev) =>
      prev.includes(target) ? prev.filter((s) => s !== target) : [...prev, target]
    );
  };

  const handleExecuteTrade = (
    pos: Omit<TradePosition, "id" | "timestamp" | "currentPrice" | "status" | "pl">
  ) => {
    const newPos: TradePosition = {
      ...pos,
      id: "pos-" + Date.now(),
      timestamp: Date.now(),
      currentPrice: pos.entryPrice,
      status: "OPEN",
      pl: 0,
    };

    setPositions((prev) => [newPos, ...prev]);
    setUser((prev) => ({
      ...prev,
      balance: prev.balance - pos.amount,
      equity: prev.equity - pos.amount,
      freeMargin: prev.freeMargin - pos.amount,
    }));
  };

  const handleExecuteSignal = (sig: AISignal) => {
    setActiveSymbol(sig.symbol);
    handleExecuteTrade({
      symbol: sig.symbol,
      type: sig.type === "BUY" ? "HIGHER" : "LOWER",
      amount: 100,
      entryPrice: Number(sig.entry) || 1.08850,
      expirationTime: "15:00",
      payout: 189,
    });
    setActiveTab("dashboard");
  };

  const handleTopUpDemo = () => {
    setUser((prev) => ({
      ...prev,
      balance: prev.balance + 10000,
      equity: prev.equity + 10000,
      freeMargin: prev.freeMargin + 10000,
    }));
  };

  const currentSymbolInfo =
    symbols.find((s) => s.symbol === activeSymbol) || symbols[0];

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${isDarkMode ? "bg-[#090d16] text-slate-100" : "bg-slate-100 text-slate-900"} font-sans antialiased`}>
      {/* Windows 11 Native Custom Title Bar */}
      <WindowsTitleBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        unreadCount={3}
        openNotifications={() => setActiveTab("alerts")}
        openQuickSearch={() => setIsCommandPaletteOpen(true)}
        isOffline={isOffline}
        onMinimizeToTray={() => setIsMinimizedTray(!isMinimizedTray)}
        onToggleMaximize={() => setIsMaximized(!isMaximized)}
        isMaximized={isMaximized}
        openInstallerHub={() => setActiveTab("installer_hub")}
        openAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openAiAssistant={() => setIsAiAssistantOpen(true)}
          openInstallerHub={() => setActiveTab("installer_hub")}
        />

        {/* View Tabs Container */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === "dashboard" && (
            <DashboardView
              activeSymbol={activeSymbol}
              setActiveSymbol={setActiveSymbol}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              candles={candles}
              symbolInfo={currentSymbolInfo}
              symbols={symbols}
              isFavorite={favorites.includes(activeSymbol)}
              onToggleFavorite={() => handleToggleFavorite(activeSymbol)}
              analysis={analysis}
              isAnalysisLoading={isAnalysisLoading}
              onRefreshAnalysis={loadAIAnalysis}
              signals={signals}
              user={user}
              onExecuteTrade={handleExecuteTrade}
              onExecuteSignal={handleExecuteSignal}
              onTopUpDemo={handleTopUpDemo}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "markets" && (
            <MarketsView
              symbols={symbols}
              onSelectSymbol={setActiveSymbol}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "watchlist" && (
            <WatchlistView
              symbols={symbols}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectSymbol={setActiveSymbol}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "portfolio" && (
            <PortfolioView user={user} positions={positions} />
          )}

          {activeTab === "chart" && (
            <ChartView
              activeSymbol={activeSymbol}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              candles={candles}
              symbolInfo={currentSymbolInfo}
              isFavorite={favorites.includes(activeSymbol)}
              onToggleFavorite={() => handleToggleFavorite(activeSymbol)}
            />
          )}

          {activeTab === "analysis" && (
            <AnalysisView
              analysis={analysis}
              isLoading={isAnalysisLoading}
              onRefresh={loadAIAnalysis}
              symbol={activeSymbol}
            />
          )}

          {activeTab === "signals" && (
            <SignalsView signals={signals} onExecuteSignal={handleExecuteSignal} />
          )}

          {activeTab === "news" && <NewsView />}

          {activeTab === "calendar" && <CalendarView />}

          {activeTab === "alerts" && <AlertsView />}

          {activeTab === "reports" && <ReportsView />}

          {activeTab === "task-list" && (
            <TaskListView
              signals={signals}
              positions={positions}
              favorites={favorites}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsView
              signals={signals}
              positions={positions}
              symbols={symbols}
              user={user}
            />
          )}

          {activeTab === "settings" && (
            <SettingsView settings={settings} setSettings={setSettings} />
          )}

          {activeTab === "installer_hub" && <WindowsInstallerHub />}
        </main>

        {/* AI Co-Pilot Slide Drawer */}
        <AIAssistantDrawer
          isOpen={isAiAssistantOpen}
          onClose={() => setIsAiAssistantOpen(false)}
          activeSymbol={activeSymbol}
        />
      </div>

      {/* Windows 11 Status Bar */}
      <WindowsStatusBar user={user} isOffline={isOffline} />

      {/* Quick Command Palette (Ctrl+K) */}
      <QuickCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
        onSelectSymbol={setActiveSymbol}
      />
    </div>
  );
}
