import React from "react";
import { CalendarDays, AlertTriangle } from "lucide-react";
import { MOCK_CALENDAR } from "../services/api";

export const CalendarView: React.FC = () => {
  return (
    <div className="flex-1 bg-[#090d16] p-6 text-slate-200 overflow-y-auto space-y-6 font-sans">
      <div className="bg-[#0d1117] border border-[#21262d] p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Economic Event Calendar</h1>
            <p className="text-xs text-slate-400">Track high-impact central bank & macro data releases</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#161b22] text-slate-400 border-b border-[#21262d] uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Currency</th>
              <th className="py-3 px-4">Economic Event</th>
              <th className="py-3 px-4">Impact</th>
              <th className="py-3 px-4 text-right">Forecast</th>
              <th className="py-3 px-4 text-right">Previous</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#21262d]/50">
            {MOCK_CALENDAR.map((cal) => (
              <tr key={cal.id} className="hover:bg-[#161b22] transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-100">{cal.time}</td>
                <td className="py-3.5 px-4 font-bold text-cyan-400 font-sans">{cal.currency}</td>
                <td className="py-3.5 px-4 text-slate-200 font-sans font-medium">{cal.event}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cal.impact === "High" ? "bg-rose-950 text-rose-400 border border-rose-500/40" : "bg-amber-950 text-amber-400"
                  }`}>
                    {cal.impact}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right text-slate-300">{cal.forecast}</td>
                <td className="py-3.5 px-4 text-right text-slate-400">{cal.previous}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
