import React, { useState } from "react";
import { 
  Download, 
  ShieldCheck, 
  Monitor, 
  FolderCheck, 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  HardDrive, 
  CheckCircle2, 
  Terminal, 
  FileText, 
  PackageCheck,
  Laptop
} from "lucide-react";

export const WindowsInstallerHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"wizard" | "inno" | "nsis" | "electron" | "tauri" | "docs">("wizard");
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  // Installer Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [installPath, setInstallPath] = useState("C:\\Program Files\\ApexMarketAI");
  const [createDesktopShortcut, setCreateDesktopShortcut] = useState(true);
  const [createStartMenuShortcut, setCreateStartMenuShortcut] = useState(true);
  const [registerAppsFeatures, setRegisterAppsFeatures] = useState(true);
  const [installProgress, setInstallProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installCompleted, setInstallCompleted] = useState(false);

  const startSimulatedInstall = () => {
    setIsInstalling(true);
    setInstallProgress(0);
    const interval = setInterval(() => {
      setInstallProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsInstalling(false);
          setInstallCompleted(true);
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(label);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  // Sample Scripts
  const innoScript = `; Apex Market AI - Inno Setup Script for Windows 11
#define MyAppName "Apex Market AI"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Apex AI Technologies Inc."
#define MyAppExeName "ApexMarketAI.exe"

[Setup]
AppId={{7D09204E-A40F-43EB-8BF7-238027DEF9AD}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\\{#MyAppName}
DefaultGroupName={#MyAppName}
OutputDir=dist_installer
OutputBaseFilename=Setup_ApexMarketAI_v1.0.0
SetupIconFile=assets\\app_icon.ico
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
UninstallDisplayIcon={app}\\{#MyAppExeName}

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "dist\\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\\{#MyAppName}"; Filename: "{app}\\{#MyAppExeName}"
Name: "{autodesktop}\\{#MyAppName}"; Filename: "{app}\\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent`;

  const electronMainJs = `// Electron Main Process for Apex Market AI - Windows 11 Native Shell
const { app, BrowserWindow, Tray, Menu, ipcMain, nativeTheme } = require('electron');
const path = require('path');

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    frame: false, // Windows 11 Native Custom Title Bar
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'assets/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL('http://localhost:3000'); // or file://${__dirname}/dist/index.html

  // System Tray setup
  tray = new Tray(path.join(__dirname, 'assets/icon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Apex Market AI', click: () => mainWindow.show() },
    { label: 'Live Signals', click: () => { mainWindow.show(); mainWindow.webContents.send('navigate', 'signals'); } },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('Apex Market AI - Live Windows Desktop');
  tray.setContextMenu(contextMenu);

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

app.whenReady().then(createWindow);`;

  return (
    <div className="flex-1 bg-[#090d16] p-6 text-slate-200 overflow-y-auto space-y-6 select-none font-sans">
      {/* Title Header */}
      <div className="flex items-center justify-between bg-[#0d1117] border border-[#21262d] p-4 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-cyan-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <Download className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <span>Windows 11 Installer & Deliverables Hub</span>
              <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
                Setup.exe + Portable
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Build scripts, installer wizards, Electron/Tauri configurations & executable packaging tools.
            </p>
          </div>
        </div>

        {/* Top Action Download Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => copyToClipboard(innoScript, "Setup.exe Config")}
            className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Setup.exe Script</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#21262d] pb-2 text-xs font-medium">
        {[
          { id: "wizard", label: "Installer Wizard Simulator", icon: Monitor },
          { id: "inno", label: "InnoSetup Script (.iss)", icon: Code2 },
          { id: "electron", label: "Electron Main Shell", icon: Terminal },
          { id: "docs", label: "Installation Guide", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#161b22]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Sections */}
      {activeTab === "wizard" && (
        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-6 shadow-xl max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#21262d]">
            <div className="flex items-center space-x-2">
              <PackageCheck className="w-5 h-5 text-amber-400" />
              <span className="font-extrabold text-slate-100 text-sm">
                Apex Market AI v1.0.0 Setup Wizard
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Step {wizardStep} of 3</span>
          </div>

          {/* Step 1: Options */}
          {wizardStep === 1 && (
            <div className="space-y-4 text-xs text-slate-300">
              <p className="text-slate-300">
                Select options for installing <strong>Apex Market AI</strong> on your Windows 11 system:
              </p>

              <div className="space-y-2 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
                <label className="text-slate-400 block font-medium">Installation Directory:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={installPath}
                    onChange={(e) => setInstallPath(e.target.value)}
                    className="flex-1 bg-[#090d16] border border-[#30363d] rounded-lg px-3 py-2 font-mono text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <button className="px-3 py-2 rounded-lg bg-[#21262d] text-slate-300 font-semibold hover:bg-[#30363d]">
                    Browse...
                  </button>
                </div>
              </div>

              <div className="space-y-2 bg-[#161b22] p-4 rounded-xl border border-[#30363d]">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createDesktopShortcut}
                    onChange={(e) => setCreateDesktopShortcut(e.target.checked)}
                    className="rounded bg-[#090d16] border-[#30363d] text-cyan-500 focus:ring-0"
                  />
                  <span>Create Desktop Shortcut</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createStartMenuShortcut}
                    onChange={(e) => setCreateStartMenuShortcut(e.target.checked)}
                    className="rounded bg-[#090d16] border-[#30363d] text-cyan-500 focus:ring-0"
                  />
                  <span>Create Start Menu Program Folder</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={registerAppsFeatures}
                    onChange={(e) => setRegisterAppsFeatures(e.target.checked)}
                    className="rounded bg-[#090d16] border-[#30363d] text-cyan-500 focus:ring-0"
                  />
                  <span>Register in Windows Apps & Features (Automatic Uninstall Support)</span>
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => {
                    setWizardStep(2);
                    startSimulatedInstall();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
                >
                  Install Now
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Installation Progress */}
          {wizardStep === 2 && (
            <div className="space-y-4 py-4 text-xs">
              <div className="flex justify-between items-center text-slate-300 font-medium">
                <span>{installCompleted ? "Installation Complete!" : "Extracting and registering native binaries..."}</span>
                <span className="font-mono text-cyan-400 font-bold">{installProgress}%</span>
              </div>

              <div className="w-full bg-[#161b22] h-3 rounded-full overflow-hidden border border-[#30363d]">
                <div
                  className="bg-gradient-to-r from-amber-400 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-md"
                  style={{ width: `${installProgress}%` }}
                />
              </div>

              {installCompleted ? (
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Apex Market AI Successfully Installed!</span>
                  </div>
                  <p className="text-xs text-emerald-200/90">
                    Registered in Windows 11 Apps & Features. Shortcuts placed on Desktop and Start Menu.
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 text-[11px] font-mono">
                  Writing to C:\Program Files\ApexMarketAI\ApexMarketAI.exe...
                </p>
              )}

              <div className="flex justify-end pt-4">
                {installCompleted && (
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
                  >
                    Finish Setup
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Code Script Viewers */}
      {activeTab === "inno" && (
        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">InnoSetup Installer Script (Setup.iss)</span>
            <button
              onClick={() => copyToClipboard(innoScript, "InnoSetup")}
              className="px-2.5 py-1 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-cyan-400 text-xs font-semibold flex items-center space-x-1"
            >
              {copiedScript === "InnoSetup" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript === "InnoSetup" ? "Copied!" : "Copy Script"}</span>
            </button>
          </div>

          <pre className="p-4 bg-[#090d16] border border-[#30363d] rounded-xl text-[11px] font-mono text-cyan-300/90 overflow-x-auto leading-relaxed">
            {innoScript}
          </pre>
        </div>
      )}

      {activeTab === "electron" && (
        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Electron Main Process Code (main.js)</span>
            <button
              onClick={() => copyToClipboard(electronMainJs, "Electron")}
              className="px-2.5 py-1 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-cyan-400 text-xs font-semibold flex items-center space-x-1"
            >
              {copiedScript === "Electron" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript === "Electron" ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>

          <pre className="p-4 bg-[#090d16] border border-[#30363d] rounded-xl text-[11px] font-mono text-amber-300/90 overflow-x-auto leading-relaxed">
            {electronMainJs}
          </pre>
        </div>
      )}

      {activeTab === "docs" && (
        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-6 space-y-4 text-xs leading-relaxed text-slate-300">
          <h2 className="text-sm font-bold text-slate-100 border-b border-[#21262d] pb-2">
            Windows 11 Native Desktop App Installation & Deployment Guide
          </h2>

          <div className="space-y-3">
            <h3 className="font-bold text-cyan-400">1. Desktop Packaging Options</h3>
            <p>
              Apex Market AI supports both Electron and Tauri for native desktop shell wrapping with full hardware acceleration and Windows 11 Mica / Fluent design support.
            </p>

            <h3 className="font-bold text-cyan-400">2. Building the Windows Installer Setup.exe</h3>
            <p className="bg-[#161b22] p-3 rounded-xl border border-[#30363d] font-mono text-[11px] text-amber-300">
              npm run build<br/>
              iscc Setup.iss // Compiles Setup_ApexMarketAI_v1.0.0.exe
            </p>

            <h3 className="font-bold text-cyan-400">3. Offline Capabilities</h3>
            <p>
              When disconnected from the internet, market state, AI signal logs, and order tickets are persisted locally in SQLite / IndexedDB cache with auto-synchronization when connection resumes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
