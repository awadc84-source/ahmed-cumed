import React from "react";
import { InteractiveChart } from "../components/InteractiveChart";
import { AIAnalysisCard } from "../components/AIAnalysisCard";
import { TechnicalIndicatorsCard } from "../components/TechnicalIndicatorsCard";
import { MarketOverviewCard } from "../components/MarketOverviewCard";
import { SignalsCard } from "../components/SignalsCard";
import { TradeExecutionPanel } from "../components/TradeExecutionPanel";
import { Candle, MarketSymbol, AIAnalysisResult, AISignal, UserAccount, TradePosition, ViewTab } from "../types";

interface DashboardViewProps {
  activeSymbol: string;
  setActiveSymbol: (sym: string) => void;
  timeframe: string;
  setTimeframe: (tf: string) => void;
  candles: Candle[];
  symbolInfo: MarketSymbol;
  symbols: MarketSymbol[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  analysis: AIAnalysisResult;
  isAnalysisLoading: boolean;
  onRefreshAnalysis: () => void;
  signals: AISignal[];
  user: UserAccount;
  onExecuteTrade: (position: Omit<TradePosition, "id" | "timestamp" | "currentPrice" | "status" | "pl">) => void;
  onExecuteSignal: (sig: AISignal) => void;
  onTopUpDemo: () => void;
  setActiveTab: (tab: ViewTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activeSymbol,
  setActiveSymbol,
  timeframe,
  setTimeframe,
  candles,
  symbolInfo,
  symbols,
  isFavorite,
  onToggleFavorite,
  analysis,
  isAnalysisLoading,
  onRefreshAnalysis,
  signals,
  user,
  onExecuteTrade,
  onExecuteSignal,
  onTopUpDemo,
  setActiveTab,
}) => {
  return (
    <div className="flex-1 flex overflow-hidden bg-[#090d16]">
      {/* Left Main Section: Chart + 4 Card Grid below */}
      <div className="flex-1 flex flex-col p-3 space-y-3 overflow-y-auto">
        {/* Main Chart Component */}
        <div className="h-[460px] shrink-0">
          <InteractiveChart
            symbol={activeSymbol}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            candles={candles}
            symbolInfo={symbolInfo}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
        </div>

        {/* 4 Card Grid Below Chart (Matching image_1.png layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 h-52 shrink-0">
          <AIAnalysisCard
            analysis={analysis}
            isLoading={isAnalysisLoading}
            onRefresh={onRefreshAnalysis}
            symbol={activeSymbol}
          />
          <TechnicalIndicatorsCard />
          <MarketOverviewCard
            symbols={symbols}
            activeSymbol={activeSymbol}
            onSelectSymbol={setActiveSymbol}
            setActiveTab={setActiveTab}
          />
          <SignalsCard
            signals={signals}
            onExecuteSignal={onExecuteSignal}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      {/* Right Section: Trade Execution Panel (Matching image_1.png) */}
      <TradeExecutionPanel
        user={user}
        symbol={activeSymbol}
        setSymbol={setActiveSymbol}
        onExecuteTrade={onExecuteTrade}
        onTopUpDemo={onTopUpDemo}
      />
    </div>
  );
};
