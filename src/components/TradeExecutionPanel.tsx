import React, { useState } from "react";
import { 
  Plus, 
  ChevronDown, 
  Minus, 
  Plus as PlusIcon, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Star, 
  DollarSign, 
  Zap, 
  ShieldAlert,
  CheckCircle2
} from "lucide-react";
import { UserAccount, TradePosition } from "../types";

interface TradeExecutionPanelProps {
  user: UserAccount;
  symbol: string;
  setSymbol: (sym: string) => void;
  onExecuteTrade: (position: Omit<TradePosition, "id" | "timestamp" | "currentPrice" | "status" | "pl">) => void;
  onTopUpDemo: () => void;
}

export const TradeExecutionPanel: React.FC<TradeExecutionPanelProps> = ({
  user,
  symbol,
  setSymbol,
  onExecuteTrade,
  onTopUpDemo,
}) => {
  const [autoTrading, setAutoTrading] = useState(false);
  const [accountType, setAccountType] = useState<"Demo Account" | "Real Account">("Demo Account");
  const [timeframe, setTimeframe] = useState("15 Minutes");
  const [expirationTime, setExpirationTime] = useState("15:00");
  const [amount, setAmount] = useState(100);
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);

  const payoutRate = 0.89; // 89% payout
  const calculatedPayout = amount + amount * payoutRate;
  const riskPercent = ((amount / user.balance) * 100).toFixed(2);

  const handleAmountChange = (delta: number) => {
    setAmount((prev) => Math.max(10, prev + delta));
  };

  const handleExecute = (direction: "HIGHER" | "LOWER") => {
    onExecuteTrade({
      symbol,
      type: direction,
      amount,
      entryPrice: 1.08907,
      expirationTime,
      payout: calculatedPayout,
    });

    setTradeSuccessMsg(`${direction} order of $${amount} executed on ${symbol}!`);
    setTimeout(() => setTradeSuccessMsg(null), 3000);
  };

  return (
    <div className="w-80 bg-[#0d1117] border-l border-[#21262d] flex flex-col justify-between p-4 select-none shrink-0 text-slate-200">
      <div className="space-y-4">
        {/* Top Bar: Trade / Auto Trading Toggle (Matching image_1.png) */}
        <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
          <span className="font-bold text-sm tracking-wide text-slate-100">Trade</span>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Auto Trading</span>
            <button
              onClick={() => setAutoTrading(!autoTrading)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                autoTrading ? "bg-emerald-500" : "bg-[#21262d]"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoTrading ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Account Selector (Matching image_1.png: $ 10,250.75 Demo Account +) */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 font-medium">Account</label>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-2.5 flex items-center justify-between hover:border-cyan-500/40 transition-colors">
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-slate-100 font-mono">
                ${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Demo Account</span>
            </div>

            <button
              onClick={onTopUpDemo}
              className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 transition-colors"
              title="Deposit / Top Up Demo Balance"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Asset Selector (Matching image_1.png: EUR/USD) */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 font-medium">Asset</label>
          <div className="relative">
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-[#161b22] border border-[#30363d] rounded-xl p-2.5 text-xs font-bold text-slate-100 appearance-none focus:outline-none focus:border-cyan-500"
            >
              <option value="EUR/USD">🇪🇺🇺🇸 EUR/USD (Forex)</option>
              <option value="GBP/USD">🇬🇧🇺🇸 GBP/USD (Forex)</option>
              <option value="USD/JPY">🇺🇸🇯🇵 USD/JPY (Forex)</option>
              <option value="XAU/USD">🪙 XAU/USD (Gold Spot)</option>
              <option value="BTC/USD">₿ BTC/USD (Bitcoin Spot)</option>
              <option value="NAS100">📈 NAS100 (Nasdaq Futures)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Timeframe Selector (Matching image_1.png: 15 Minutes) */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 font-medium">Timeframe</label>
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-[#161b22] border border-[#30363d] rounded-xl p-2.5 text-xs text-slate-100 appearance-none focus:outline-none focus:border-cyan-500"
            >
              <option value="1 Minute">1 Minute</option>
              <option value="5 Minutes">5 Minutes</option>
              <option value="15 Minutes">15 Minutes</option>
              <option value="30 Minutes">30 Minutes</option>
              <option value="1 Hour">1 Hour</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Expiration Time (Matching image_1.png: 15:00) */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 font-medium">Expiration</label>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-100">
            <span className="font-mono font-bold">{expirationTime}</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Amount Input with - / + buttons (Matching image_1.png: $ 100) */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 font-medium">Amount</label>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-1.5 flex items-center justify-between">
            <button
              onClick={() => handleAmountChange(-25)}
              className="p-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-slate-300 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center space-x-1 font-mono font-extrabold text-slate-100 text-sm">
              <span>$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 10)}
                className="w-20 bg-transparent text-center focus:outline-none font-extrabold"
              />
            </div>

            <button
              onClick={() => handleAmountChange(25)}
              className="p-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-slate-300 transition-colors"
            >
              <PlusIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Risk & Payout Calculations (Matching image_1.png) */}
        <div className="space-y-1.5 pt-2 border-t border-[#21262d] text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Risk:</span>
            <span>{riskPercent}% (${amount.toFixed(2)})</span>
          </div>

          <div className="flex justify-between items-center text-emerald-400 font-bold">
            <span>Payout:</span>
            <span className="text-sm">+${calculatedPayout.toFixed(2)}</span>
          </div>
        </div>

        {/* Order Success Toast Notification */}
        {tradeSuccessMsg && (
          <div className="p-2 bg-emerald-950/90 border border-emerald-500 text-emerald-300 rounded-lg text-xs flex items-center space-x-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{tradeSuccessMsg}</span>
          </div>
        )}

        {/* Action Buttons: HIGHER & LOWER (Matching image_1.png) */}
        <div className="space-y-2 pt-2">
          {/* HIGHER Button */}
          <button
            onClick={() => handleExecute("HIGHER")}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-between shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all"
          >
            <span>HIGHER</span>
            <ArrowUpRight className="w-6 h-6 stroke-[3]" />
          </button>

          {/* LOWER Button */}
          <button
            onClick={() => handleExecute("LOWER")}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-500 hover:from-rose-500 hover:to-red-400 text-slate-950 font-black text-sm tracking-wider uppercase flex items-center justify-between shadow-lg shadow-rose-600/30 active:scale-[0.98] transition-all"
          >
            <span>LOWER</span>
            <ArrowDownRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Confidence Star Rating at Bottom (Matching image_1.png: Confidence ★★★★★) */}
      <div className="pt-4 border-t border-[#21262d] flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Confidence</span>
        <div className="flex items-center space-x-1 text-emerald-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
          ))}
        </div>
      </div>
    </div>
  );
};
