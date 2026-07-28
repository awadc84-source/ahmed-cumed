import React from "react";
import { BrainCircuit, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { AIAnalysisResult } from "../types";

interface AIAnalysisCardProps {
  analysis: AIAnalysisResult;
  isLoading: boolean;
  onRefresh: () => void;
  symbol: string;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({
  analysis,
  isLoading,
  onRefresh,
  symbol,
}) => {
  return (
    <div className="bg-[#090d16] border border-[#21262d] rounded-xl p-4 flex flex-col justify-between h-full shadow-md relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-wide">AI Analysis</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Bullish Badge matching image_1.png */}
          <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
            analysis.bias === "Bullish"
              ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/50"
              : analysis.bias === "Bearish"
              ? "bg-rose-950/80 text-rose-400 border-rose-500/50"
              : "bg-slate-800 text-slate-300 border-slate-600"
          }`}>
            {analysis.bias}
          </span>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-lg hover:bg-[#161b22] text-slate-400 hover:text-cyan-400 transition-colors"
            title="Re-run Gemini AI Market Analysis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Analysis Body (Matching image_1.png) */}
      <div className="flex-1 my-2 text-xs leading-relaxed text-slate-300 space-y-2">
        <p className="font-normal text-slate-300">
          <strong className="text-cyan-400 font-semibold">Analysis: </strong>
          {analysis.analysis || "The market is showing bullish momentum above EMA 20 and EMA 50. Price is near resistance level 1.09120. A breakout above this level may continue the uptrend."}
        </p>

        {/* Key factors preview */}
        {analysis.keyFactors && analysis.keyFactors.length > 0 && (
          <div className="pt-2 border-t border-[#21262d]/60 space-y-1">
            {analysis.keyFactors.slice(0, 2).map((factor, idx) => (
              <div key={idx} className="flex items-start space-x-1.5 text-[11px] text-slate-400">
                <span className="text-cyan-400 font-bold">•</span>
                <span className="truncate">{factor}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confidence Score Bar (Matching image_1.png: Confidence 78%) */}
      <div className="pt-3 border-t border-[#21262d] mt-2">
        <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
          <span className="text-slate-400">Confidence:</span>
          <span className="text-emerald-400 font-extrabold">{analysis.confidence}%</span>
        </div>
        <div className="w-full bg-[#161b22] h-2 rounded-full overflow-hidden border border-[#30363d]">
          <div
            className="bg-gradient-to-r from-cyan-500 via-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
            style={{ width: `${analysis.confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
};
