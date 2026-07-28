import React from "react";
import { Star, TrendingUp, Bell, Trash2 } from "lucide-react";
import { MarketSymbol, ViewTab } from "../types";

interface WatchlistViewProps {
  symbols: MarketSymbol[];
  favorites: string[];
  onToggleFavorite: (symbol: string) => void;
  onSelectSymbol: (symbol: string) => void;
  setActiveTab: (tab: ViewTab) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  symbols,
  favorites,
  onToggleFavorite,
  onSelectSymbol,
  setActiveTab,
}) => {
  const watchSymbols = symbols.filter((s) => favorites.includes(s.symbol));

  return (
    <div className="flex-1 bg-[#090d16] p-6 text-slate-200 overflow-y-auto space-y-6 font-sans">
      <div className="bg-[#0d1117] border border-[#21262d] p-4 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>Custom Desktop Watchlist</span>
          </h1>
          <p className="text-xs text-slate-400">Track high-conviction pairs with instant price alert triggers</p>
        </div>
      </div>

      {watchSymbols.length === 0 ? (
        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Star className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-medium">Your watchlist is currently empty.</p>
          <p className="text-xs text-slate-500">Star any symbol in the Markets or Dashboard view to pin it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchSymbols.map((s) => {
            const isPositive = s.changePercent >= 0;
            return (
              <div
                key={s.symbol}
                className="bg-[#0d1117] border border-[#21262d] hover:border-cyan-500/40 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onToggleFavorite(s.symbol)} className="text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                    </button>
                    <span className="font-extrabold text-sm text-slate-100">{s.symbol}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isPositive ? "bg-emerald-950 text-emerald-400" : "bg-rose-950 text-rose-400"
                  }`}>
                    {isPositive ? `+${s.changePercent.toFixed(2)}%` : `${s.changePercent.toFixed(2)}%`}
                  </span>
                </div>

                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-slate-400 text-xs">Live Price:</span>
                  <span className="text-lg font-bold text-slate-100">
                    {s.price.toFixed(s.symbol.includes("JPY") || s.symbol.includes("BTC") || s.symbol.includes("NAS") ? 2 : 5)}
                  </span>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-[#21262d]">
                  <button
                    onClick={() => {
                      onSelectSymbol(s.symbol);
                      setActiveTab("dashboard");
                    }}
                    className="flex-1 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-colors"
                  >
                    Launch Trading Chart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
