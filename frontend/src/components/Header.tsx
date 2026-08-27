import React from 'react';
import { Wallet, ShieldCheck, ExternalLink, Award, Sparkles } from 'lucide-react';
import { WalletState } from '../utils/stellar';

interface HeaderProps {
  wallet: WalletState;
  onConnect: () => void;
  onOpenRoadmap: () => void;
}

export const Header: React.FC<HeaderProps> = ({ wallet, onConnect, onOpenRoadmap }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Tag */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <span className="text-2xl">🇵🇭</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
                Padala<span className="text-cyan-400">X</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Soroban v21</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Stellar Cross-Border Remittance Protocol</p>
          </div>
        </div>

        {/* Network & Navigation Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* RiseIn Belt Roadmap Trigger */}
          <button
            onClick={onOpenRoadmap}
            className="hidden sm:flex items-center space-x-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-900/90 text-amber-300 border border-amber-500/30 hover:bg-amber-950/30 hover:border-amber-500/50 transition-all shadow-sm"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>RiseIn Levels 1–7</span>
          </button>

          {/* Stellar Testnet Status & Contract Link */}
          <a
            href="https://stellar.expert/explorer/testnet/contract/CATUXAJ7QPHA5AQM3F3D2HXAFN2BDEZHRTXUL2742XT6LVA2JRO7S3DM"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-white transition-all"
            title="View Deployed Contract on Stellar Expert"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">Contract: CATUX...S3DM</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </a>

          {/* Multi-Wallet Connect Button / Connected Badge */}
          {wallet.connected && wallet.address ? (
            <button
              onClick={onConnect}
              className="flex items-center space-x-2 bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 rounded-xl px-3.5 py-2 shadow-inner transition-all group"
              title="Change Wallet"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <div className="text-left">
                <p className="text-[10px] text-slate-400 leading-none capitalize">
                  {wallet.walletType || 'Stellar'}
                </p>
                <p className="text-xs font-mono font-bold text-slate-200 group-hover:text-cyan-300">
                  {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
                </p>
              </div>
              <span className="text-xs font-semibold text-cyan-300 ml-1 pl-2 border-l border-slate-700">
                {wallet.balanceXLM} XLM
              </span>
            </button>
          ) : (
            <button
              onClick={onConnect}
              className="flex items-center space-x-2 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
