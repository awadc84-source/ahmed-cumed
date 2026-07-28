import React from "react";
import { Briefcase, ArrowUpRight, ArrowDownRight, CheckCircle2, DollarSign } from "lucide-react";
import { TradePosition, UserAccount } from "../types";

interface PortfolioViewProps {
  user: UserAccount;
  positions: TradePosition[];
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ user, positions }) => {
  return (
    <div className="flex-1 bg-[#090d16] p-6 text-slate-200 overflow-y-auto space-y-6 font-sans">
      {/* Portfolio Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4 shadow-lg space-y-1">
          <span className="text-xs text-slate-400">Total Account Balance</span>
          <div className="text-xl font-extrabold text-slate-100 font-mono">
            ${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4 shadow-lg space-y-1">
          <span className="text-xs text-slate-400">Net Equity</span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">
            ${user.equity.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4 shadow-lg space-y-1">
          <span className="text-xs text-slate-400">Used Margin</span>
          <div className="text-xl font-extrabold text-slate-100 font-mono">
            ${user.margin.toFixed(2)}
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4 shadow-lg space-y-1">
          <span className="text-xs text-slate-400">Active Positions</span>
          <div className="text-xl font-extrabold text-cyan-400 font-mono">
            {positions.length}
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-cyan-400" />
          <span>Active Trade Executions</span>
        </h2>

        {positions.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No active positions open. Place a order ticket from the Trade panel!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#161b22] text-slate-400 border-b border-[#21262d] uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Asset</th>
                  <th className="py-2.5 px-3">Direction</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-right">Entry Price</th>
                  <th className="py-2.5 px-3 text-right">Est. Payout</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]/50">
                {positions.map((pos) => {
                  const isHigher = pos.type === "HIGHER" || pos.type === "BUY";
                  return (
                    <tr key={pos.id} className="hover:bg-[#161b22] transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-100 font-sans">{pos.symbol}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          isHigher ? "bg-emerald-950 text-emerald-400" : "bg-rose-950 text-rose-400"
                        }`}>
                          {pos.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-200">${pos.amount}</td>
                      <td className="py-3 px-3 text-right text-slate-300">{pos.entryPrice}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400">+${pos.payout.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold text-[10px]">
                          {pos.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
