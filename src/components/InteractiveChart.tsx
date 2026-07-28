import React, { useState, useRef, useEffect } from "react";
import { 
  Star, 
  Crosshair, 
  TrendingUp, 
  Layers, 
  Type, 
  Ruler, 
  ZoomIn, 
  Trash2, 
  Sliders, 
  RotateCcw, 
  RotateCw, 
  Camera, 
  Maximize2, 
  Minus,
  Sparkles,
  BarChart2
} from "lucide-react";
import { Candle, MarketSymbol } from "../types";

interface InteractiveChartProps {
  symbol: string;
  timeframe: string;
  setTimeframe: (tf: string) => void;
  candles: Candle[];
  symbolInfo: MarketSymbol;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenIndicatorsModal?: () => void;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  symbol,
  timeframe,
  setTimeframe,
  candles,
  symbolInfo,
  isFavorite,
  onToggleFavorite,
  onOpenIndicatorsModal,
}) => {
  const [activeTool, setActiveTool] = useState<string>("crosshair");
  const [chartType, setChartType] = useState<"candlestick" | "area" | "line">("candlestick");
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const timeframes = ["1m", "5m", "15m", "30m", "1h", "4h", "1D", "1W", "1M"];

  // Calculate chart boundaries
  const prices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...(prices.length ? prices : [1.08400])) * 0.9995;
  const maxPrice = Math.max(...(prices.length ? prices : [1.09200])) * 1.0005;
  const priceRange = maxPrice - minPrice || 0.008;

  const resistancePrice = Number((symbolInfo.price * 1.002).toFixed(5));
  const supportPrice = Number((symbolInfo.price * 0.996).toFixed(5));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || candles.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Determine candle index
    const chartWidth = rect.width - 60; // Leave space for Y axis
    const index = Math.min(
      candles.length - 1,
      Math.max(0, Math.floor((x / chartWidth) * candles.length))
    );

    setHoveredCandle(candles[index]);
    setHoverPos({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredCandle(null);
    setHoverPos(null);
  };

  const latestCandle = candles[candles.length - 1] || {
    open: symbolInfo.price,
    high: symbolInfo.price,
    low: symbolInfo.price,
    close: symbolInfo.price,
    volume: 5234
  };

  const currentDisplayCandle = hoveredCandle || latestCandle;

  return (
    <div className="bg-[#090d16] border border-[#21262d] rounded-xl flex flex-col h-full overflow-hidden shadow-lg select-none">
      {/* Chart Header Bar (Matching image_1.png) */}
      <div className="bg-[#0d1117] border-b border-[#21262d] px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Flag + Pair Name + Favorite + Timeframe Selector */}
        <div className="flex items-center space-x-3">
          {/* Flag / Icon */}
          <div className="flex items-center -space-x-1">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-[10px] font-bold flex items-center justify-center text-white border border-[#0d1117]">🇪🇺</span>
            <span className="w-5 h-5 rounded-full bg-red-600 text-[10px] font-bold flex items-center justify-center text-white border border-[#0d1117]">🇺🇸</span>
          </div>

          <div className="flex items-center space-x-1.5 font-bold text-slate-100 text-sm">
            <span>{symbol}</span>
            <button onClick={onToggleFavorite} className="text-slate-400 hover:text-amber-400 transition-colors">
              <Star className={`w-3.5 h-3.5 ${isFavorite ? "text-amber-400 fill-amber-400" : ""}`} />
            </button>
          </div>

          {/* Timeframes */}
          <div className="hidden sm:flex items-center space-x-0.5 bg-[#161b22] p-0.5 rounded-lg border border-[#30363d]">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                  timeframe === tf
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Right Chart Action Buttons */}
        <div className="flex items-center space-x-2 text-slate-400 text-xs">
          <button 
            onClick={() => setChartType(chartType === "candlestick" ? "area" : "candlestick")}
            className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-[#161b22] text-slate-300 transition-colors border border-[#30363d]/60"
          >
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="capitalize">{chartType}</span>
          </button>

          <button 
            onClick={onOpenIndicatorsModal}
            className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-[#161b22] text-slate-300 transition-colors border border-[#30363d]/60"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Indicators</span>
          </button>

          <div className="hidden lg:flex items-center space-x-1 pl-2 border-l border-[#30363d]">
            <button className="p-1.5 rounded hover:bg-[#161b22] hover:text-slate-200" title="Undo">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded hover:bg-[#161b22] hover:text-slate-200" title="Redo">
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded hover:bg-[#161b22] hover:text-slate-200" title="Take Chart Snapshot">
              <Camera className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded hover:bg-[#161b22] hover:text-slate-200" title="Full Screen">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Status Legend Line (OHLC & Indicators from image_1.png) */}
      <div className="px-3 py-1.5 bg-[#090d16] border-b border-[#21262d]/50 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-slate-300">
        <span className="text-cyan-400 font-bold">{symbol} · {timeframe} · APEX</span>
        <span>O <strong className="text-slate-100">{currentDisplayCandle.open.toFixed(5)}</strong></span>
        <span>H <strong className="text-emerald-400">{currentDisplayCandle.high.toFixed(5)}</strong></span>
        <span>L <strong className="text-rose-400">{currentDisplayCandle.low.toFixed(5)}</strong></span>
        <span>C <strong className="text-emerald-400">{currentDisplayCandle.close.toFixed(5)}</strong></span>
        <span className="text-emerald-400 font-semibold">+0.00043 (+0.04%)</span>

        {/* Technical overlay badges */}
        <div className="hidden xl:flex items-center space-x-3 text-[10px]">
          <span className="text-amber-400 font-semibold">EMA 20 close <strong className="text-amber-300">1.08721</strong></span>
          <span className="text-sky-400 font-semibold">EMA 50 close <strong className="text-sky-300">1.08612</strong></span>
          <span className="text-indigo-400">BB 20 2 <strong className="text-indigo-300">1.08891 1.08999 1.08783</strong></span>
          <span className="text-teal-400">Vol <strong className="text-teal-300">5.234K</strong></span>
        </div>
      </div>

      {/* Main Chart Canvas Area + Left Drawing Toolbar */}
      <div className="flex-1 flex relative overflow-hidden bg-[#090d16]">
        {/* Left Drawing Tools Panel */}
        <div className="w-10 bg-[#0d1117] border-r border-[#21262d] flex flex-col items-center py-2 space-y-2 text-slate-400 shrink-0">
          {[
            { id: "crosshair", icon: Crosshair, title: "Crosshair (Cursor)" },
            { id: "trendline", icon: TrendingUp, title: "Trend Line" },
            { id: "fibonacci", icon: Layers, title: "Fibonacci Retracement" },
            { id: "text", icon: Type, title: "Text Annotation" },
            { id: "ruler", icon: Ruler, title: "Price/Time Ruler" },
            { id: "zoom", icon: ZoomIn, title: "Zoom" },
            { id: "clear", icon: Trash2, title: "Clear Drawing Tools" },
          ].map((tool) => {
            const Icon = tool.icon;
            const isSelected = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                title={tool.title}
                className={`p-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                    : "hover:bg-[#161b22] hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>

        {/* Interactive SVG Canvas */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="flex-1 relative cursor-crosshair overflow-hidden"
        >
          <svg className="w-full h-full absolute inset-0">
            {/* Background Grid Lines */}
            <defs>
              <pattern id="chartGrid" width="60" height="40" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#21262d" strokeWidth="0.5" opacity="0.4" />
              </pattern>
              {/* Bollinger Band Gradient */}
              <linearGradient id="bbGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#chartGrid)" />

            {/* Resistance Line (1.09120 green dash) */}
            <g>
              <line 
                x1="0" 
                y1="18%" 
                x2="90%" 
                y2="18%" 
                stroke="#10b981" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
              />
              <rect x="80%" y="15%" width="75" height="18" rx="3" fill="#065f46" stroke="#10b981" />
              <text x="81%" y="22%" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">Resistance</text>
            </g>

            {/* Support Line (1.08540 blue dash) */}
            <g>
              <line 
                x1="0" 
                y1="75%" 
                x2="90%" 
                y2="75%" 
                stroke="#3b82f6" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
              />
              <rect x="80%" y="72%" width="65" height="18" rx="3" fill="#1e3a8a" stroke="#3b82f6" />
              <text x="81%" y="79%" fill="#60a5fa" fontSize="10" fontFamily="monospace" fontWeight="bold">Support</text>
            </g>

            {/* Simulated Technical Overlay Curves: EMA 20 & EMA 50 */}
            <path
              d="M 10 240 Q 150 180, 300 200 T 500 120 T 700 160 T 900 110"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.8"
            />
            <path
              d="M 10 260 Q 150 210, 300 220 T 500 150 T 700 180 T 900 140"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.8"
            />

            {/* Render Candlesticks */}
            {candles.map((candle, idx) => {
              const count = candles.length || 1;
              const width = 800; // SVG relative coordinate
              const step = (width - 70) / count;
              const x = idx * step + 15;
              const isBullish = candle.close >= candle.open;

              // Normalized Y positions
              const highY = 280 - ((candle.high - minPrice) / priceRange) * 220;
              const lowY = 280 - ((candle.low - minPrice) / priceRange) * 220;
              const openY = 280 - ((candle.open - minPrice) / priceRange) * 220;
              const closeY = 280 - ((candle.close - minPrice) / priceRange) * 220;

              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.max(2, Math.abs(openY - closeY));

              // Volume bar Y
              const volHeight = Math.min(40, (candle.volume / 10000) * 35);
              const volY = 320 - volHeight;

              return (
                <g key={idx} className="transition-opacity hover:opacity-100">
                  {/* High/Low Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={isBullish ? "#10b981" : "#f43f5e"}
                    strokeWidth="1"
                  />
                  {/* Candle Body */}
                  <rect
                    x={x - 3}
                    y={bodyTop}
                    width="6"
                    height={bodyHeight}
                    fill={isBullish ? "#10b981" : "#f43f5e"}
                    rx="0.5"
                  />
                  {/* Volume Bar at bottom */}
                  <rect
                    x={x - 2}
                    y={volY}
                    width="4"
                    height={volHeight}
                    fill={isBullish ? "#10b981" : "#f43f5e"}
                    opacity="0.3"
                  />
                </g>
              );
            })}

            {/* Interactive Hover Crosshair */}
            {hoverPos && (
              <g className="pointer-events-none">
                {/* Horizontal line */}
                <line
                  x1="0"
                  y1={hoverPos.y}
                  x2="100%"
                  y2={hoverPos.y}
                  stroke="#94a3b8"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />
                {/* Vertical line */}
                <line
                  x1={hoverPos.x}
                  y1="0"
                  x2={hoverPos.x}
                  y2="100%"
                  stroke="#94a3b8"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />
              </g>
            )}
          </svg>

          {/* Right Y-Axis Price Bar */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-[#0d1117] border-l border-[#21262d] flex flex-col justify-between py-2 text-[10px] font-mono text-slate-400 select-none">
            <span>{maxPrice.toFixed(5)}</span>
            <span className="text-emerald-400">{(maxPrice * 0.998).toFixed(5)}</span>
            <span>{((maxPrice + minPrice) / 2).toFixed(5)}</span>
            <span className="text-sky-400">{(minPrice * 1.002).toFixed(5)}</span>
            <span>{minPrice.toFixed(5)}</span>

            {/* Current Price Tag (Highlight badge matching image_1.png) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-emerald-500 text-slate-950 px-1.5 py-1 rounded-l text-[11px] font-bold shadow-md animate-pulse">
              {symbolInfo.price.toFixed(5)}
              <div className="text-[8px] font-normal text-slate-900 opacity-90">09:35</div>
            </div>
          </div>

          {/* Bottom Time X-Axis */}
          <div className="absolute bottom-0 left-0 right-16 h-5 bg-[#0d1117] border-t border-[#21262d] flex items-center justify-between px-6 text-[10px] font-mono text-slate-400">
            <span>18:00</span>
            <span>27</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>28</span>
          </div>
        </div>
      </div>
    </div>
  );
};
