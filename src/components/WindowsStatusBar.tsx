import React, { useState, useEffect } from "react";
import { Signal, ShieldCheck, Database, HardDrive } from "lucide-react";
import { UserAccount } from "../types";

interface WindowsStatusBarProps {
  user: UserAccount;
  isOffline: boolean;
}

export const WindowsStatusBar: React.FC<WindowsStatusBarProps> = ({ user, isOffline }) => {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString("en-GB") + " " + now.toLocaleTimeString("en-GB");
      setTimeStr(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="h-7 bg-[#090d16] border-t border-[#21262d] text-slate-300 text-[11px] font-mono select-none flex items-center justify-between px-3 z-30 shrink-0">
      {/* Account Metrics (Matching image_1.png) */}
      <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-0.5">
        <div>
          <span className="text-slate-400 font-sans">Balance: </span>
          <strong className="text-slate-100">${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
        </div>

        <div className="hidden sm:block">
          <span className="text-slate-400 font-sans">Equity: </span>
          <strong className="text-slate-100">${user.equity.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
        </div>

        <div className="hidden md:block">
          <span className="text-slate-400 font-sans">Margin: </span>
          <strong className="text-slate-100">${user.margin.toFixed(2)}</strong>
        </div>

        <div className="hidden lg:block">
          <span className="text-slate-400 font-sans">Free Margin: </span>
          <strong className="text-slate-100">${user.freeMargin.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
        </div>

        <div className="hidden xl:block">
          <span className="text-slate-400 font-sans">Margin Level: </span>
          <strong className="text-slate-100">{user.marginLevel}%</strong>
        </div>
      </div>

      {/* Right Side: Local Time + Network Signal Bars */}
      <div className="flex items-center space-x-4 shrink-0 pl-3 border-l border-[#30363d]">
        <div className="hidden sm:flex items-center space-x-1.5 text-slate-400">
          <Database className="w-3 h-3 text-cyan-400" />
          <span className="text-[10px]">SQLite Cache</span>
        </div>

        <div className="flex items-center space-x-1 text-slate-300 font-mono text-[10px]">
          <span>Local Time:</span>
          <strong className="text-slate-100">{timeStr || "27/05/2024 14:44:25"}</strong>
        </div>

        {/* Network signal bar icon matching image_1.png */}
        <div className="flex items-center space-x-0.5" title={isOffline ? "Offline Mode (Cached in SQLite)" : "Optimal Connection 12ms"}>
          <Signal className={`w-3.5 h-3.5 ${isOffline ? "text-rose-400" : "text-emerald-400"}`} />
        </div>
      </div>
    </footer>
  );
};
