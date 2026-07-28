import React from "react";
import { Settings, Shield, HardDrive, Monitor, Lock, Key } from "lucide-react";
import { WindowsAppSettings } from "../types";

interface SettingsViewProps {
  settings: WindowsAppSettings;
  setSettings: React.Dispatch<React.SetStateAction<WindowsAppSettings>>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings }) => {
  const toggle = (key: keyof WindowsAppSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 bg-[#090d16] p-6 text-slate-200 overflow-y-auto space-y-6 font-sans">
      <div className="bg-[#0d1117] border border-[#21262d] p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Windows 11 Desktop Preferences</h1>
            <p className="text-xs text-slate-400">Manage native app shell settings, offline database encryption, & system tray</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-6 shadow-xl space-y-6">
        {/* System & Shell Settings */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2 border-b border-[#21262d] pb-2">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>Windows Integration</span>
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-[#161b22] rounded-xl border border-[#30363d] cursor-pointer">
              <div>
                <span className="font-bold text-slate-200 block">Launch on Windows Startup</span>
                <span className="text-slate-400 text-[11px]">Automatically boot Apex Market AI in background tray when Windows logs in.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.launchOnStartup}
                onChange={() => toggle("launchOnStartup")}
                className="w-4 h-4 text-cyan-500 rounded border-slate-600 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#161b22] rounded-xl border border-[#30363d] cursor-pointer">
              <div>
                <span className="font-bold text-slate-200 block">Minimize to System Tray</span>
                <span className="text-slate-400 text-[11px]">Keep active market update services running when close button is pressed.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.minimizeToTray}
                onChange={() => toggle("minimizeToTray")}
                className="w-4 h-4 text-cyan-500 rounded border-slate-600 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#161b22] rounded-xl border border-[#30363d] cursor-pointer">
              <div>
                <span className="font-bold text-slate-200 block">High-DPI Display Scaling</span>
                <span className="text-slate-400 text-[11px]">Crisp chart rendering on 4K multi-monitor desktop setups.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.highDpiScaling}
                onChange={() => toggle("highDpiScaling")}
                className="w-4 h-4 text-cyan-500 rounded border-slate-600 focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* Security & Offline Local Cache */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2 border-b border-[#21262d] pb-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Security & Local SQLite Database</span>
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-[#161b22] rounded-xl border border-[#30363d] cursor-pointer">
              <div>
                <span className="font-bold text-slate-200 block">Encrypted SQLite Configuration Files</span>
                <span className="text-slate-400 text-[11px]">Encrypt local market cache with AES-256 bits credential lock.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.encryptedDatabase}
                onChange={() => toggle("encryptedDatabase")}
                className="w-4 h-4 text-amber-500 rounded border-slate-600 focus:ring-0"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
