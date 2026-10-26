import React, { useState, useEffect } from "react";
import { Search, X, TrendingUp, Zap, Download, Settings, LineChart, ListChecks, PieChart } from "lucide-react";
import { ViewTab } from "../types";

interface QuickCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ViewTab) => void;
  onSelectSymbol: (symbol: string) => void;
}

export const QuickCommandPalette: React.FC<QuickCommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { label: "Switch to Dashboard", tab: "dashboard", icon: LineChart },
    { label: "Trade EUR/USD", symbol: "EUR/USD", icon: TrendingUp },
    { label: "Trade XAU/USD (Gold)", symbol: "XAU/USD", icon: TrendingUp },
    { label: "Trade BTC/USD (Bitcoin)", symbol: "BTC/USD", icon: TrendingUp },
    { label: "View Live AI Signals", tab: "signals", icon: Zap },
    { label: "Open Task List", tab: "task-list", icon: ListChecks },
    { label: "Open Analytics Dashboard", tab: "analytics", icon: PieChart },
    { label: "Windows 11 Installer & Packages Hub", tab: "installer_hub", icon: Download },
    { label: "Windows App Preferences", tab: "settings", icon: Settings },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden font-sans text-slate-200">
        <div className="p-3 border-b border-[#21262d] flex items-center space-x-2">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or pair symbol..."
            className="flex-1 bg-transparent text-sm text-slate-100 focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 max-h-72 overflow-y-auto space-y-1 text-xs">
          {filtered.map((cmd, idx) => {
            const Icon = cmd.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (cmd.tab) setActiveTab(cmd.tab as ViewTab);
                  if (cmd.symbol) {
                    onSelectSymbol(cmd.symbol);
                    setActiveTab("dashboard");
                  }
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#161b22] text-left transition-colors"
              >
                <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-medium text-slate-200">{cmd.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
