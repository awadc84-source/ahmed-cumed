import React from "react";
import { Newspaper, Flame, Tag } from "lucide-react";
import { MOCK_NEWS } from "../services/api";

export const NewsView: React.FC = () => {
  return (
    <div className="flex-1 bg-[#090d16] p-6 text-slate-200 overflow-y-auto space-y-6 font-sans">
      <div className="bg-[#0d1117] border border-[#21262d] p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Financial News Wire & AI Sentiment</h1>
            <p className="text-xs text-slate-400">Real-time market headlines tagged with AI sentiment impact ratings</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_NEWS.map((item) => (
          <div
            key={item.id}
            className="bg-[#0d1117] border border-[#21262d] hover:border-cyan-500/40 rounded-2xl p-5 shadow-lg space-y-3 transition-all"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-cyan-400">{item.source}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{item.time}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  item.sentiment === "Bullish"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                    : item.sentiment === "Bearish"
                    ? "bg-rose-950 text-rose-400 border border-rose-500/40"
                    : "bg-slate-800 text-slate-300"
                }`}>
                  {item.sentiment}
                </span>

                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                  {item.impact} Impact
                </span>
              </div>
            </div>

            <h2 className="text-sm font-bold text-slate-100">{item.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p>

            <div className="flex items-center space-x-2 pt-2 border-t border-[#21262d]">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              {item.relatedSymbols.map((sym) => (
                <span key={sym} className="px-2 py-0.5 rounded bg-[#161b22] text-slate-300 font-mono text-[10px]">
                  {sym}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
