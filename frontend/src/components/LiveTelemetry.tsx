import React from 'react';
import { Activity, Zap, DollarSign, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { RemittanceRecord, STELLAR_EXPERT_TESTNET } from '../utils/stellar';

interface LiveTelemetryProps {
  remittances: RemittanceRecord[];
}

export const LiveTelemetry: React.FC<LiveTelemetryProps> = ({ remittances }) => {
  const totalVolumePhp = remittances.reduce((acc, r) => acc + r.amountPhp, 0);
  const pendingCount = remittances.filter((r) => r.status === 'Pending').length;
  const claimedCount = remittances.filter((r) => r.status === 'Claimed').length;

  return (
    <div className="space-y-6">
      
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Total Volume */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Protocol Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">
            ₱{totalVolumePhp.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Live Soroban State</span>
        </div>

        {/* Metric 2: Avg Settlement Speed */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Settlement Time</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">&lt; 3.5s</p>
          <span className="text-[10px] text-cyan-400 font-semibold mt-1 block">Stellar Consensus</span>
        </div>

        {/* Metric 3: Avg Transaction Fee */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Network Fee</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">&lt; $0.001</p>
          <span className="text-[10px] text-amber-400 font-semibold mt-1 block">99.9% savings vs banks</span>
        </div>

        {/* Metric 4: Active Escrows */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Escrows Active</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-white">{pendingCount} Active</p>
          <span className="text-[10px] text-indigo-400 font-semibold mt-1 block">{claimedCount} Claimed</span>
        </div>

      </div>

      {/* Live Transaction Ledger Stream */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 text-slate-100 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <h3 className="text-base sm:text-lg font-extrabold text-white">Live Activity & Ledger Events</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Stellar Testnet</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Remittance ID</th>
                <th className="pb-3 font-semibold">Recipient / Memo</th>
                <th className="pb-3 font-semibold">Amount (PHP)</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Stellar Explorer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {remittances.slice(0, 6).map((rem) => (
                <tr key={rem.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-cyan-300">
                    #{rem.id}
                  </td>
                  <td className="py-3">
                    <p className="font-semibold text-slate-200">{rem.recipientName}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-xs">{rem.memo}</p>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-white">
                      {rem.amount} {rem.currency}
                    </span>
                    <span className="text-[10px] text-emerald-400 block">
                      ≈ ₱{rem.amountPhp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        rem.status === 'Claimed'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                          : rem.status === 'Refunded'
                          ? 'bg-purple-950/80 text-purple-400 border-purple-800'
                          : 'bg-amber-950/80 text-amber-400 border-amber-800'
                      }`}
                    >
                      {rem.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {rem.txHash ? (
                      <a
                        href={`${STELLAR_EXPERT_TESTNET}/tx/${rem.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-xs font-semibold transition-colors"
                      >
                        <span className="font-mono">{rem.txHash.slice(0, 6)}...</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Simulated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
