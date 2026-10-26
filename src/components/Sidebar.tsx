import React from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Star, 
  Briefcase, 
  LineChart, 
  BrainCircuit, 
  Zap, 
  Newspaper, 
  CalendarDays, 
  Bell, 
  FileText, 
  ListChecks,
  PieChart,
  Settings, 
  Sparkles,
  Download,
  Server,
  Radio
} from "lucide-react";
import { ViewTab } from "../types";

interface SidebarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  openAiAssistant: () => void;
  openInstallerHub: () => void;
  isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openAiAssistant,
  openInstallerHub,
  isCollapsed = false,
}) => {
  const mainNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "markets", label: "Markets", icon: TrendingUp },
    { id: "watchlist", label: "Watchlist", icon: Star },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "chart", label: "Chart", icon: LineChart },
    { id: "analysis", label: "Analysis", icon: BrainCircuit },
    { id: "signals", label: "Signals", icon: Zap },
    { id: "news", label: "News", icon: Newspaper },
    { id: "calendar", label: "Calendar", icon: CalendarDays },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "task-list", label: "Task List", icon: ListChecks },
    { id: "analytics", label: "Analytics", icon: PieChart },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "installer_hub", label: "Installer Hub", icon: Download, badge: "Win11" },
  ];

  return (
    <aside className="w-52 bg-[#090d16] border-r border-[#21262d] flex flex-col justify-between py-3 select-none z-20 shrink-0">
      {/* Top Nav List */}
      <div className="space-y-1 px-2">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ViewTab)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-amber-500/10 text-cyan-400 border-l-2 border-cyan-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#161b22]"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section: AI Assistant Button + Live Server Connection Status */}
      <div className="px-2 space-y-3 pt-3 border-t border-[#21262d]/60">
        {/* Glowing AI Assistant Button (from image_1.png) */}
        <button
          onClick={openAiAssistant}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-900/60 via-indigo-900/40 to-slate-900 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all group"
        >
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-cyan-200">AI Assistant</span>
        </button>

        {/* Live Server Connection Status (from image_1.png) */}
        <div className="bg-[#161b22]/80 border border-[#30363d]/80 rounded-lg p-2 text-[11px] font-mono text-slate-400">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold text-[11px]">Connected</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
            <span>Server: <strong className="text-slate-200">Live</strong></span>
            <span className="text-slate-400">v1.0.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
