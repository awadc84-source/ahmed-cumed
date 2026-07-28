import React from "react";
import { BrainCircuit, RefreshCw, Sparkles, ShieldCheck } from "lucide-react";
import { AIAnalysisResult } from "../types";

interface AnalysisViewProps {
  analysis: AIAnalysisResult;
  isLoading: boolean;
  onRefresh: () => void;
  symbol: string;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  analysis,
  isLoading,
  onRefresh,
  symbol,
}) => {
  return (
    <div className="flex-1 bg-[#090d16] p-6 text-slate-200 overflow-y-auto space-y-6 font-sans">
      <div className="bg-[#0d1117] border border-[#21262d] p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <span>Apex Institutional AI Market Analysis</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h1>
            <p className="text-xs text-slate-400">Deep technical pattern breakdown & confidence modeling powered by Gemini</p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-colors shadow-lg"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Re-Analyze {symbol}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0d1117] border border-[#21262d] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
            <span className="text-sm font-bold text-slate-100">Technical Overview for {symbol}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              analysis.bias === "Bullish"
                ? "bg-emerald-950 text-emerald-400 border-emerald-500/50"
                : "bg-rose-950 text-rose-400 border-rose-500/50"
            }`}>
              {analysis.bias} Bias
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-300">
            {analysis.analysis}
          </p>

          <div className="pt-4 border-t border-[#21262d] space-y-2">
            <h3 className="text-xs font-bold text-cyan-400">Key Confluence Factors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {analysis.keyFactors?.map((f, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#161b22] border border-[#30363d] text-slate-300 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-[#21262d] pb-3">
            Key Structural Parameters
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#161b22] rounded-xl border border-[#30363d] flex justify-between">
              <span className="text-slate-400">Key Resistance:</span>
              <strong className="text-emerald-400">{analysis.resistanceLevel || "1.09120"}</strong>
            </div>

            <div className="p-3 bg-[#161b22] rounded-xl border border-[#30363d] flex justify-between">
              <span className="text-slate-400">Key Support:</span>
              <strong className="text-sky-400">{analysis.supportLevel || "1.08540"}</strong>
            </div>

            <div className="p-3 bg-[#161b22] rounded-xl border border-[#30363d] flex justify-between">
              <span className="text-slate-400">AI Confidence:</span>
              <strong className="text-amber-400">{analysis.confidence}%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
