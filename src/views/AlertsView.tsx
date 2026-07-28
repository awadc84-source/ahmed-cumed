import React, { useState } from "react";
import { Bell, Plus, Trash2, CheckCircle2 } from "lucide-react";

export const AlertsView: React.FC = () => {
  const [alerts, setAlerts] = useState([
    { id: "1", symbol: "EUR/USD", targetPrice: "1.09120", condition: "Price Above", active: true },
    { id: "2", symbol: "XAU/USD", targetPrice: "2050.00", condition: "Price Above", active: true },
    { id: "3", symbol: "BTC/USD", targetPrice: "66500.00", condition: "Price Below", active: true },
  ]);

  const [symbol, setSymbol] = useState("EUR/USD");
  const [price, setPrice] = useState("1.09500");

  const addAlert = () => {
    setAlerts((prev) => [
      ...prev,
      { id: Date.now().toString(), symbol, targetPrice: price, condition: "Price Above", active: true },
    ]);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex-1 bg-[#090d16] p-6 text-slate-200 overflow-y-auto space-y-6 font-sans">
      <div className="bg-[#0d1117] border border-[#21262d] p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Windows Native Price Alerts</h1>
            <p className="text-xs text-slate-400">Receive instant desktop toast notifications when price levels trigger</p>
          </div>
        </div>
      </div>

      {/* Add Alert */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-5 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-slate-100">Create New Price Alert</h2>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none"
          >
            <option value="EUR/USD">EUR/USD</option>
            <option value="GBP/USD">GBP/USD</option>
            <option value="XAU/USD">XAU/USD</option>
            <option value="BTC/USD">BTC/USD</option>
          </select>

          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Target Price..."
            className="bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none"
          />

          <button
            onClick={addAlert}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Set Alert</span>
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-5 shadow-xl space-y-3">
        <h2 className="text-sm font-bold text-slate-100">Active Desktop Alerts</h2>
        <div className="space-y-2 font-mono text-xs">
          {alerts.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 bg-[#161b22] border border-[#30363d] rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-100 font-sans">{a.symbol}</span>
                <span className="text-slate-400">{a.condition}</span>
                <strong className="text-amber-400">{a.targetPrice}</strong>
              </div>

              <button
                onClick={() => removeAlert(a.id)}
                className="p-1.5 rounded-lg hover:bg-rose-950 text-rose-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
