import React, { useMemo } from "react";
import { PieChart, TrendingUp, Target, Activity, Award } from "lucide-react";
import { AISignal, TradePosition, MarketSymbol, UserAccount } from "../types";

interface AnalyticsViewProps {
  signals: AISignal[];
  positions: TradePosition[];
  symbols: MarketSymbol[];
  user: UserAccount;
}

// Deterministic mock equity curve anchored to the account balance
const EQUITY_CURVE = [
  9400, 9520, 9480, 9650, 9780, 9700, 9910, 10040, 9980, 10150, 10090, 10250,
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ signals, positions, symbols, user }) => {
  const stats = useMemo(() => {
    const wins = signals.filter((s) => s.status === "WIN").length;
    const losses = signals.filter((s) => s.status === "LOSS").length;
    const decided = wins + losses;
    const winRate = decided ? Math.round((wins / decided) * 100) : 0;
    const avgConfidence = signals.length
      ? Math.round(signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length)
      : 0;
    return { wins, losses, winRate, avgConfidence, totalSignals: signals.length };
  }, [signals]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    symbols.forEach((s) => {
      map[s.category] = (map[s.category] || 0) + 1;
    });
    const total = symbols.length || 1;
    return Object.entries(map).map(([cat, count]) => ({ cat, count, pct: Math.round((count / total) * 100) }));
  }, [symbols]);

  const confidenceBars = useMemo(() => {
    return [...signals]
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 6)
      .map((s) => ({ symbol: s.symbol, confidence: s.confidence, type: s.type }));
  }, [signals]);

  // Equity curve SVG geometry
  const W = 560;
  const H = 180;
  const minEq = Math.min(...EQUITY_CURVE) * 0.995;
  const maxEq = Math.max(...EQUITY_CURVE) * 1.005;
  const range = maxEq - minEq || 1;
  const stepX = W / (EQUITY_CURVE.length - 1);
  const points = EQUITY_CURVE.map((v, i) => `${(i * stepX).toFixed(1)},${(H - ((v - minEq) / range) * H).toFixed(1)}`);
  const linePath = "M " + points.join(" L ");
  const areaPath = `${linePath} L ${W},${H} L 0,${H} Z`;

  const StatCard: React.FC<{ label: string; value: string; sub?: string; icon: React.FC<{ className?: string }>; color: string }> = ({
    label,
    value,
    sub,
    icon: Icon,
    color,
  }) => (
    <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-4 shadow-lg space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{label}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className={`text-xl font-extrabold font-mono ${color}`}>{value}</div>
      {sub && <span className="text-[10px] text-slate-500">{sub}</span>}
    </div>
  );

  return (
    <div className="flex-1 bg-[#090d16] p-6 text-slate-200 overflow-y-auto space-y-5 font-sans">
      {/* Header */}
      <div className="bg-[#0d1117] border border-[#21262d] p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">Analytics & Performance Trends</h1>
            <p className="text-xs text-slate-400">Charts and statistics derived from your tracked market data</p>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Account Equity" value={`$${user.equity.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} sub="Current net value" icon={TrendingUp} color="text-emerald-400" />
        <StatCard label="Signal Win Rate" value={`${stats.winRate}%`} sub={`${stats.wins}W / ${stats.losses}L`} icon={Award} color="text-cyan-400" />
        <StatCard label="Avg. Confidence" value={`${stats.avgConfidence}%`} sub={`${stats.totalSignals} active signals`} icon={Target} color="text-amber-400" />
        <StatCard label="Open Positions" value={`${positions.length}`} sub="Live executions" icon={Activity} color="text-sky-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Equity curve */}
        <div className="lg:col-span-2 bg-[#0d1117] border border-[#21262d] rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-slate-100">Equity Curve (12 sessions)</h2>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44" preserveAspectRatio="none">
            <defs>
              <linearGradient id="eqArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((p) => (
              <line key={p} x1="0" y1={H * p} x2={W} y2={H * p} stroke="#21262d" strokeWidth="0.5" strokeDasharray="4 4" />
            ))}
            <path d={areaPath} fill="url(#eqArea)" />
            <path d={linePath} fill="none" stroke="#38bdf8" strokeWidth="2" />
          </svg>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Sess 1</span>
            <span>Sess 6</span>
            <span>Sess 12</span>
          </div>
        </div>

        {/* Win / Loss donut */}
        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-slate-100">Signal Outcome Split</h2>
          <div className="flex items-center justify-center">
            <Donut wins={stats.wins} losses={stats.losses} />
          </div>
          <div className="flex justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Wins <strong className="text-emerald-400">{stats.wins}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-300">Losses <strong className="text-rose-400">{stats.losses}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Confidence bars */}
        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-slate-100">Top Signal Confidence</h2>
          <div className="space-y-3">
            {confidenceBars.length === 0 && <div className="text-xs text-slate-500 py-4 text-center">No signals loaded.</div>}
            {confidenceBars.map((s) => (
              <div key={s.symbol} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-mono text-slate-200">{s.symbol}</span>
                  <span className={`font-bold ${s.type === "BUY" ? "text-emerald-400" : "text-rose-400"}`}>{s.confidence}%</span>
                </div>
                <div className="h-2 w-full bg-[#161b22] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.type === "BUY" ? "bg-gradient-to-r from-emerald-600 to-emerald-400" : "bg-gradient-to-r from-rose-600 to-rose-400"}`}
                    style={{ width: `${s.confidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market category distribution */}
        <div className="bg-[#0d1117] border border-[#21262d] rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-slate-100">Market Coverage by Category</h2>
          <div className="space-y-3">
            {categoryData.map((c) => (
              <div key={c.cat} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-200">{c.cat}</span>
                  <span className="text-slate-400 font-mono">{c.count} · {c.pct}%</span>
                </div>
                <div className="h-2 w-full bg-[#161b22] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple SVG donut chart
const Donut: React.FC<{ wins: number; losses: number }> = ({ wins, losses }) => {
  const total = wins + losses;
  const R = 60;
  const C = 2 * Math.PI * R;
  const winPct = total ? wins / total : 0;
  const winDash = winPct * C;

  return (
    <svg viewBox="0 0 160 160" className="w-40 h-40">
      <circle cx="80" cy="80" r={R} fill="none" stroke="#161b22" strokeWidth="18" />
      <circle
        cx="80"
        cy="80"
        r={R}
        fill="none"
        stroke="#10b981"
        strokeWidth="18"
        strokeDasharray={`${winDash} ${C - winDash}`}
        transform="rotate(-90 80 80)"
        strokeLinecap="round"
      />
      {total === 0 && (
        <circle cx="80" cy="80" r={R} fill="none" stroke="#30363d" strokeWidth="18" />
      )}
      <text x="80" y="76" textAnchor="middle" className="fill-slate-100" fontSize="22" fontWeight="bold" fontFamily="monospace">
        {total ? `${Math.round(winPct * 100)}%` : "—"}
      </text>
      <text x="80" y="94" textAnchor="middle" className="fill-slate-500" fontSize="10" fontFamily="monospace">
        win rate
      </text>
    </svg>
  );
};
