import React from "react";
import { TrendingUp, ChevronRight } from "lucide-react";
import { MarketSymbol, ViewTab } from "../types";

interface MarketOverviewCardProps {
  symbols: MarketSymbol[];
  activeSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  setActiveTab: (tab: ViewTab) => void;
}

export const MarketOverviewCard: React.FC<MarketOverviewCardProps> = ({
  symbols,
  activeSymbol,
  onSelectSymbol,
  setActiveTab,
}) => {
  const displaySymbols = symbols.slice(0, 6);

  return (
    <div className="bg-[#090d16] border border-[#21262d] rounded-xl p-4 flex flex-col justify-between h-full shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-wide">Market Overview</span>
        </div>

        <button
          onClick={() => setActiveTab("markets")}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-0.5 transition-colors"
        >
          <span>View all</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* List (Matching image_1.png) */}
      <div className="space-y-1.5 text-xs font-mono flex-1">
        {displaySymbols.map((s) => {
          const isSelected = activeSymbol === s.symbol;
          const isPositive = s.changePercent >= 0;
          return (
            <button
              key={s.symbol}
              onClick={() => onSelectSymbol(s.symbol)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all ${
                isSelected
                  ? "bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-bold"
                  : "hover:bg-[#161b22] text-slate-300"
              }`}
            >
              <div className="flex items-center space-x-2 font-sans font-semibold">
                <span>{s.symbol}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-slate-200">{s.price.toFixed(s.symbol.includes("JPY") || s.symbol.includes("BTC") || s.symbol.includes("NAS") ? 2 : 5)}</span>
                <span className={`w-16 text-right font-bold rounded px-1 py-0.5 text-[11px] ${
                  isPositive ? "text-emerald-400 bg-emerald-950/40" : "text-rose-400 bg-rose-950/40"
                }`}>
                  {isPositive ? `+${s.changePercent.toFixed(2)}%` : `${s.changePercent.toFixed(2)}%`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
