import React from "react";
import { Zap, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AISignal, ViewTab } from "../types";

interface SignalsCardProps {
  signals: AISignal[];
  onExecuteSignal: (sig: AISignal) => void;
  setActiveTab: (tab: ViewTab) => void;
}

export const SignalsCard: React.FC<SignalsCardProps> = ({
  signals,
  onExecuteSignal,
  setActiveTab,
}) => {
  const displaySignals = signals.slice(0, 3);

  return (
    <div className="bg-[#090d16] border border-[#21262d] rounded-xl p-4 flex flex-col justify-between h-full shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Zap className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-wide">Signals</span>
        </div>

        <button
          onClick={() => setActiveTab("signals")}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-0.5 transition-colors"
        >
          <span>View all signals</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Signals List (Matching image_1.png) */}
      <div className="space-y-2 text-xs font-mono flex-1">
        {displaySignals.map((sig) => {
          const isBuy = sig.type === "BUY";
          return (
            <div
              key={sig.id}
              className="flex items-center justify-between p-2 rounded-lg bg-[#161b22] border border-[#30363d]/60 hover:border-cyan-500/40 transition-all group"
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 font-sans">
                  <span className="font-bold text-slate-200">{sig.symbol}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold flex items-center ${
                    isBuy ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40" : "bg-rose-950 text-rose-400 border border-rose-500/40"
                  }`}>
                    {sig.type}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                  <span>{sig.timestamp}</span>
                  <span>•</span>
                  <span>Entry: <strong className="text-slate-300">{sig.entry}</strong></span>
                </div>
              </div>

              {/* 1-Click Trade Execute */}
              <button
                onClick={() => onExecuteSignal(sig)}
                className="px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold transition-all group-hover:scale-105"
                title="1-Click Fill Order Ticket"
              >
                Trade
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
