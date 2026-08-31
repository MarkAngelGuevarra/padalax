import React, { useState } from 'react';
import { FIAT_RATES, EXCHANGE_RATES } from '../utils/stellar';
import { TrendingUp, RefreshCw, Sparkles } from 'lucide-react';

export const CurrencyTicker: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('AED');
  const [inputAmount, setInputAmount] = useState<number>(100);

  const selectedRate = FIAT_RATES[selectedCurrency] || FIAT_RATES.USD;
  const convertedPhp = inputAmount * selectedRate.rateToPhp;
  const traditionalFee = convertedPhp * EXCHANGE_RATES.PHP_FEE_TRADITIONAL;
  const padalaxSavings = traditionalFee - (EXCHANGE_RATES.PADALAX_FEE * 57.80);

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border-y border-slate-800/80 px-4 py-2.5 overflow-x-auto text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Ticker Badges */}
        <div className="flex items-center space-x-2.5 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
          <div className="flex items-center space-x-1 font-semibold text-cyan-400 shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[10px]">Live OFW FX Rates:</span>
          </div>

          {Object.entries(FIAT_RATES).map(([curr, data]) => (
            <button
              key={curr}
              onClick={() => setSelectedCurrency(curr)}
              className={`shrink-0 px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                selectedCurrency === curr
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{data.flag}</span>
              <span className="font-mono">{curr}/PHP:</span>
              <span className="font-semibold text-white">₱{data.rateToPhp.toFixed(2)}</span>
            </button>
          ))}
        </div>

        {/* Quick Instant FX Mini-Estimator */}
        <div className="flex items-center space-x-2 shrink-0 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800 text-[11px]">
          <span className="text-slate-400">Estimate:</span>
          <input
            type="number"
            min="1"
            value={inputAmount}
            onChange={(e) => setInputAmount(Math.max(1, parseFloat(e.target.value) || 0))}
            className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-center font-bold text-white focus:outline-none focus:border-cyan-500"
          />
          <span className="font-semibold text-cyan-300">{selectedCurrency}</span>
          <span className="text-slate-400">≈</span>
          <span className="font-bold text-emerald-400">₱{convertedPhp.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          <span className="text-cyan-400 font-semibold hidden sm:inline">(Save ~₱{padalaxSavings.toFixed(0)})</span>
        </div>

      </div>
    </div>
  );
};
