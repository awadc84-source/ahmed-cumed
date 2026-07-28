import React from "react";
import { Sliders } from "lucide-react";

export const TechnicalIndicatorsCard: React.FC = () => {
  const indicators = [
    { name: "RSI (14)", value: "64.21", status: "Neutral", color: "text-slate-300" },
    { name: "MACD (12,26,9)", value: "0.00045", status: "Bullish", color: "text-emerald-400" },
    { name: "EMA 20", value: "1.08721", status: "Bullish", color: "text-emerald-400" },
    { name: "EMA 50", value: "1.08612", status: "Bullish", color: "text-emerald-400" },
    { name: "ADX (14)", value: "25.32", status: "Strong", color: "text-amber-400" },
    { name: "ATR (14)", value: "0.00085", status: "Low", color: "text-sky-400" },
  ];

  return (
    <div className="bg-[#090d16] border border-[#21262d] rounded-xl p-4 flex flex-col justify-between h-full shadow-md">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Sliders className="w-4 h-4" />
        </div>
        <span className="font-bold text-slate-100 text-sm tracking-wide">Technical Indicators</span>
      </div>

      {/* Grid Table of Indicators (Matching image_1.png) */}
      <div className="space-y-2 text-xs font-mono">
        {indicators.map((ind, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-1 px-2 rounded hover:bg-[#161b22] transition-colors border-b border-[#21262d]/40"
          >
            <span className="text-slate-400 font-sans">{ind.name}</span>
            <div className="flex items-center space-x-3">
              <span className="text-slate-200 font-semibold">{ind.value}</span>
              <span className={`w-16 text-right font-bold ${ind.color}`}>
                {ind.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Signal Meter (Radial Gauge matching image_1.png: Overall Signal 78% Bullish) */}
      <div className="pt-3 border-t border-[#21262d] mt-2 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Overall Signal</span>

        {/* Circular Gauge */}
        <div className="flex items-center space-x-2">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="#21262d"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="#10b981"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="113"
                strokeDashoffset={113 - (113 * 78) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-mono font-extrabold text-emerald-400">
              <span>78%</span>
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-emerald-400">Bullish</span>
            <span className="text-[10px] text-slate-400">Strong Buy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
