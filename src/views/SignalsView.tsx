import React from "react";
import { Zap, ArrowUpRight, ArrowDownRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import { AISignal } from "../types";

interface SignalsViewProps {
  signals: AISignal[];
  onExecuteSignal: (sig: AISignal) => void;
}

export const SignalsView: React.FC<SignalsViewProps> = ({ signals, onExecuteSignal }) => {
  return (
    <div className="flex-1 bg-[#090d16] p-6 text-slate-200 overflow-y-auto space-y-6 font-sans">
      <div className="bg-[#0d1117] border border-[#21262d] p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Live AI Trade Signals</h1>
            <p className="text-xs text-slate-400">Institutional signals generated with entry, stop loss, and take profit targets</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {signals.map((sig) => {
          const isBuy = sig.type === "BUY";
          return (
            <div
              key={sig.id}
              className="bg-[#0d1117] border border-[#21262d] hover:border-cyan-500/40 rounded-2xl p-5 shadow-xl space-y-4 transition-all"
            >
              <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-base text-slate-100">{sig.symbol}</span>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-black ${
                    isBuy ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40" : "bg-rose-950 text-rose-400 border border-rose-500/40"
                  }`}>
                    {sig.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">({sig.timeframe})</span>
                </div>

                <span className="text-xs text-slate-400 font-mono">{sig.timestamp}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div className="bg-[#161b22] p-2.5 rounded-xl border border-[#30363d]">
                  <span className="text-slate-400 text-[10px] block">Entry Price</span>
                  <strong className="text-slate-100 text-sm">{sig.entry}</strong>
                </div>

                <div className="bg-[#161b22] p-2.5 rounded-xl border border-[#30363d]">
                  <span className="text-slate-400 text-[10px] block">Stop Loss</span>
                  <strong className="text-rose-400 text-sm">{sig.stopLoss}</strong>
                </div>

                <div className="bg-[#161b22] p-2.5 rounded-xl border border-[#30363d]">
                  <span className="text-slate-400 text-[10px] block">Take Profit 1</span>
                  <strong className="text-emerald-400 text-sm">{sig.takeProfit1}</strong>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic">
                "{sig.rationale}"
              </p>

              <button
                onClick={() => onExecuteSignal(sig)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
              >
                1-Click Execute Order Ticket
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
