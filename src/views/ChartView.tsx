import React, { useState } from "react";
import { InteractiveChart } from "../components/InteractiveChart";
import { Candle, MarketSymbol } from "../types";

interface ChartViewProps {
  activeSymbol: string;
  timeframe: string;
  setTimeframe: (tf: string) => void;
  candles: Candle[];
  symbolInfo: MarketSymbol;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ChartView: React.FC<ChartViewProps> = ({
  activeSymbol,
  timeframe,
  setTimeframe,
  candles,
  symbolInfo,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className="flex-1 bg-[#090d16] p-4 flex flex-col h-full overflow-hidden">
      <div className="flex-1 h-full">
        <InteractiveChart
          symbol={activeSymbol}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          candles={candles}
          symbolInfo={symbolInfo}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </div>
  );
};
