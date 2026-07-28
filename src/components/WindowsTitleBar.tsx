import React, { useState } from "react";
import { 
  Search, 
  Bell, 
  ShieldCheck, 
  Minimize2, 
  Maximize2, 
  X, 
  ChevronDown, 
  Globe, 
  Sun, 
  Moon, 
  Minus, 
  Grid2X2,
  Download,
  Wifi,
  WifiOff,
  Sliders,
  Sparkles
} from "lucide-react";
import { UserAccount, AppNotification, ViewTab } from "../types";

interface WindowsTitleBarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  user: UserAccount;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  unreadCount: number;
  openNotifications: () => void;
  openQuickSearch: () => void;
  isOffline: boolean;
  onMinimizeToTray: () => void;
  onToggleMaximize: () => void;
  isMaximized: boolean;
  openInstallerHub: () => void;
  openAiAssistant: () => void;
}

export const WindowsTitleBar: React.FC<WindowsTitleBarProps> = ({
  activeTab,
  setActiveTab,
  user,
  isDarkMode,
  setIsDarkMode,
  unreadCount,
  openNotifications,
  openQuickSearch,
  isOffline,
  onMinimizeToTray,
  onToggleMaximize,
  isMaximized,
  openInstallerHub,
  openAiAssistant,
}) => {
  const [showSnapMenu, setShowSnapMenu] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <header className="h-12 bg-[#0d1117] border-b border-[#21262d] text-slate-200 select-none flex items-center justify-between px-3 z-50 relative shadow-sm">
      {/* Left: Window Icon + Brand Logo + Ticker Mini Bar */}
      <div className="flex items-center space-x-3">
        {/* Apex Market AI Logo */}
        <div 
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center space-x-2 cursor-pointer group hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-cyan-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#090d16] rounded-[7px] flex items-center justify-center">
              <span className="text-amber-400 font-extrabold text-sm tracking-tighter">A</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="font-extrabold text-sm text-slate-100 tracking-wide font-sans">APEX</span>
              <span className="text-[10px] bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent font-bold tracking-wider">MARKET AI</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono -mt-1 hidden sm:block">WIN11 DESKTOP EDITION</span>
          </div>
        </div>

        {/* Live Top Header Ticker Ribbon (from image_1.png) */}
        <div className="hidden lg:flex items-center space-x-3 text-xs border-l border-[#30363d] pl-3 py-0.5">
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-[#161b22] border border-[#30363d]/60 font-mono text-[11px]">
            <span className="text-slate-300 font-medium">EUR/USD</span>
            <span className="text-emerald-400 font-semibold">+0.32%</span>
            <span className="text-emerald-400 text-[10px]">▲</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-[#161b22] border border-[#30363d]/60 font-mono text-[11px]">
            <span className="text-slate-300 font-medium">XAU/USD</span>
            <span className="text-emerald-400 font-semibold">+0.58%</span>
            <span className="text-emerald-400 text-[10px]">▲</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-[#161b22] border border-[#30363d]/60 font-mono text-[11px]">
            <span className="text-slate-300 font-medium">BTC/USD</span>
            <span className="text-rose-400 font-semibold">-1.25%</span>
            <span className="text-rose-400 text-[10px]">▼</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-[#161b22] border border-[#30363d]/60 font-mono text-[11px]">
            <span className="text-slate-300 font-medium">NAS100</span>
            <span className="text-emerald-400 font-semibold">+0.41%</span>
            <span className="text-emerald-400 text-[10px]">▲</span>
          </div>
        </div>
      </div>

      {/* Middle: Search / Command Palette shortcut trigger */}
      <div className="hidden md:flex items-center max-w-xs w-full mx-4">
        <button
          onClick={openQuickSearch}
          className="w-full flex items-center justify-between bg-[#161b22] hover:bg-[#21262d] text-slate-400 hover:text-slate-200 border border-[#30363d] rounded-md px-3 py-1 text-xs transition-all shadow-inner"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search currency, symbol, AI signals...</span>
          </div>
          <kbd className="text-[10px] bg-[#0d1117] border border-[#30363d] px-1.5 py-0.5 rounded text-slate-400 font-mono">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Desktop Packaging Hub + Language + Dark/Light + Notifications + User Profile + Native Windows 11 TitleBar controls */}
      <div className="flex items-center space-x-2">
        {/* Offline Status indicator */}
        {isOffline ? (
          <div className="flex items-center space-x-1 text-rose-400 text-[11px] bg-rose-950/40 border border-rose-800/50 px-2 py-0.5 rounded-full" title="Offline Mode: Changes cached locally in SQLite/IndexedDB">
            <WifiOff className="w-3 h-3 animate-pulse" />
            <span className="hidden xl:inline">Offline Cache</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-emerald-400 text-[11px] bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-full" title="Live Synced to Cloud Server">
            <Wifi className="w-3 h-3" />
            <span className="hidden xl:inline">Live Sync</span>
          </div>
        )}

        {/* Desktop Installer / Deliverables Hub Button */}
        <button
          onClick={openInstallerHub}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-medium transition-all"
          title="Windows 11 Installer (.exe), Portable ZIP, Desktop Packaging Center"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Installer & Packages</span>
        </button>

        {/* AI Co-Pilot trigger */}
        <button
          onClick={openAiAssistant}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-medium transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline">AI Co-Pilot</span>
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-[#161b22] text-xs text-slate-300 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{language}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          {showLangDropdown && (
            <div className="absolute right-0 mt-1 w-32 bg-[#161b22] border border-[#30363d] rounded-md shadow-xl py-1 text-xs text-slate-200 z-50">
              {["English", "Deutsch", "Español", "Français", "العربية", "日本語"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setShowLangDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#21262d] transition-colors"
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark/Light mode toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-1.5 rounded hover:bg-[#161b22] text-slate-400 hover:text-slate-200 transition-colors"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Windows 11 Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={openNotifications}
          className="p-1.5 rounded hover:bg-[#161b22] text-slate-400 hover:text-slate-200 relative transition-colors"
          title="Windows Desktop Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-cyan-500 text-slate-950 font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Badge (Matching image_1.png: Ahmed Premium) */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#30363d]">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-[#0d1117] font-bold text-xs shadow">
            A
          </div>
          <div className="hidden lg:flex flex-col text-left -space-y-0.5">
            <span className="text-xs font-semibold text-slate-200">{user.name}</span>
            <div className="flex items-center space-x-1">
              <span className="text-[9px] text-amber-400 font-medium">Premium</span>
              <ShieldCheck className="w-2.5 h-2.5 text-amber-400" />
            </div>
          </div>
        </div>

        {/* --- Windows 11 Native Frame Window Controls --- */}
        <div className="flex items-center space-x-0.5 ml-2 pl-2 border-l border-[#30363d]">
          {/* Minimize to Tray */}
          <button
            onClick={onMinimizeToTray}
            className="p-2 hover:bg-[#21262d] text-slate-400 hover:text-slate-100 transition-colors"
            title="Minimize to Windows System Tray"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Maximize / Snap Layouts */}
          <div className="relative">
            <button
              onClick={onToggleMaximize}
              onMouseEnter={() => setShowSnapMenu(true)}
              onMouseLeave={() => setShowSnapMenu(false)}
              className="p-2 hover:bg-[#21262d] text-slate-400 hover:text-slate-100 transition-colors"
              title="Window Maximize & Windows 11 Snap Layouts"
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Windows 11 Snap Layouts Hover Popup */}
            {showSnapMenu && (
              <div 
                onMouseEnter={() => setShowSnapMenu(true)}
                onMouseLeave={() => setShowSnapMenu(false)}
                className="absolute right-0 top-10 w-44 bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl p-2 z-50 text-slate-300 animate-in fade-in duration-150"
              >
                <div className="text-[10px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">Windows 11 Snap Layouts</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="h-10 bg-[#21262d] hover:bg-cyan-500/20 hover:border-cyan-500 border border-[#30363d] rounded flex transition-all cursor-pointer">
                    <div className="w-1/2 border-r border-[#30363d]"></div>
                    <div className="w-1/2"></div>
                  </div>
                  <div className="h-10 bg-[#21262d] hover:bg-cyan-500/20 hover:border-cyan-500 border border-[#30363d] rounded flex transition-all cursor-pointer">
                    <div className="w-2/3 border-r border-[#30363d]"></div>
                    <div className="w-1/3"></div>
                  </div>
                  <div className="h-10 bg-[#21262d] hover:bg-cyan-500/20 hover:border-cyan-500 border border-[#30363d] rounded grid grid-cols-3 gap-0.5 p-0.5 transition-all cursor-pointer">
                    <div className="bg-[#30363d]"></div>
                    <div className="bg-[#30363d]"></div>
                    <div className="bg-[#30363d]"></div>
                  </div>
                  <div className="h-10 bg-[#21262d] hover:bg-cyan-500/20 hover:border-cyan-500 border border-[#30363d] rounded grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5 transition-all cursor-pointer">
                    <div className="bg-[#30363d]"></div>
                    <div className="bg-[#30363d]"></div>
                    <div className="bg-[#30363d]"></div>
                    <div className="bg-[#30363d]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Close Window Button */}
          <button
            onClick={() => onMinimizeToTray()}
            className="p-2 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
            title="Close Application (Minimizes to System Tray)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
