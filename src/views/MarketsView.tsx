import React, { useState } from "react";
import { TrendingUp, Search, Star, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { MarketSymbol, Category, ViewTab } from "../types";

interface MarketsViewProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: string) => void;
  favorites: string[];
  onToggleFavorite: (symbol: string) => void;
  setActiveTab: (tab: ViewTab) => void;
}

export const MarketsView: React.FC<MarketsViewProps> = ({
  symbols,
  onSelectSymbol,
  favorites,
  onToggleFavorite,
  setActiveTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: (Category | "All")[] = ["All", "Forex", "Commodities", "Crypto", "Indices"];

  const filtered = symbols.filter((s) => {
    const matchCat = selectedCategory === "All" || s.category === selectedCategory;
    const matchSearch = s.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex-1 bg-[#090d16] p-6 text-slate-200 overflow-y-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d1117] border border-[#21262d] p-4 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>Global Financial Markets</span>
          </h1>
          <p className="text-xs text-slate-400">Real-time quotes, spreads, and volume across Forex, Crypto & Commodities</p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symbols..."
            className="w-full bg-[#161b22] border border-[#30363d] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 border-b border-[#21262d] pb-3 text-xs font-medium">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedCategory === cat
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#161b22]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Markets Table */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#161b22] text-slate-400 border-b border-[#21262d] uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Symbol</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">24h Change</th>
              <th className="py-3 px-4 text-right">24h High</th>
              <th className="py-3 px-4 text-right">24h Low</th>
              <th className="py-3 px-4 text-right">Spread</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#21262d]/50">
            {filtered.map((s) => {
              const isFav = favorites.includes(s.symbol);
              const isPositive = s.changePercent >= 0;
              return (
                <tr key={s.symbol} className="hover:bg-[#161b22]/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-100 flex items-center space-x-2 font-sans">
                    <button onClick={() => onToggleFavorite(s.symbol)} className="text-slate-400 hover:text-amber-400">
                      <Star className={`w-3.5 h-3.5 ${isFav ? "text-amber-400 fill-amber-400" : ""}`} />
                    </button>
                    <span>{s.symbol}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{s.category}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-100">
                    {s.price.toFixed(s.symbol.includes("JPY") || s.symbol.includes("BTC") || s.symbol.includes("NAS") ? 2 : 5)}
                  </td>
                  <td className={`py-3.5 px-4 text-right font-bold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                    {isPositive ? `+${s.changePercent.toFixed(2)}%` : `${s.changePercent.toFixed(2)}%`}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-300">{s.high}</td>
                  <td className="py-3.5 px-4 text-right text-slate-300">{s.low}</td>
                  <td className="py-3.5 px-4 text-right text-slate-400">{s.spread} pips</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => {
                        onSelectSymbol(s.symbol);
                        setActiveTab("dashboard");
                      }}
                      className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
                    >
                      Trade Chart
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
