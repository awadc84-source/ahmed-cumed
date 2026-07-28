import React from "react";
import { FileText, Download, CheckCircle2 } from "lucide-react";

export const ReportsView: React.FC = () => {
  return (
    <div className="flex-1 bg-[#090d16] p-6 text-slate-200 overflow-y-auto space-y-6 font-sans">
      <div className="bg-[#0d1117] border border-[#21262d] p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Trading Performance & PDF Export</h1>
            <p className="text-xs text-slate-400">Export institutional performance statements & tax reports</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-5 shadow-xl space-y-3">
          <h2 className="text-sm font-bold text-slate-100">Monthly Performance Report (May 2024)</h2>
          <p className="text-xs text-slate-400">Detailed breakdown of win rates, profit factor, drawdown, and volume.</p>
          <button className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Statement (PDF)</span>
          </button>
        </div>

        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-5 shadow-xl space-y-3">
          <h2 className="text-sm font-bold text-slate-100">Raw Executions CSV Ledger</h2>
          <p className="text-xs text-slate-400">Export raw order fills and timestamps for accounting software.</p>
          <button className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Raw Fills (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
