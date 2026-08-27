import React from 'react';
import { X, ExternalLink, ShieldCheck, Wallet, Check, AlertCircle, Sparkles } from 'lucide-react';
import { WalletType, WalletState } from '../utils/stellar';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletType: WalletType) => Promise<void>;
  wallet: WalletState;
  errorMessage: string | null;
  isConnecting: boolean;
}

interface WalletOption {
  id: WalletType;
  name: string;
  badge: string;
  badgeColor: string;
  icon: string;
  description: string;
  website: string;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: 'freighter',
    name: 'Freighter Wallet',
    badge: 'Recommended',
    badgeColor: 'bg-cyan-950/80 text-cyan-400 border-cyan-700/60',
    icon: '🚀',
    description: 'Official Stellar browser extension with hardware wallet support.',
    website: 'https://www.freighter.app/',
  },
  {
    id: 'albedo',
    name: 'Albedo',
    badge: 'No Extension Needed',
    badgeColor: 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60',
    icon: '⚡',
    description: 'Web-based delegated signer. Works instantly without installing extensions.',
    website: 'https://albedo.link/',
  },
  {
    id: 'xbull',
    name: 'xBull Wallet',
    badge: 'Browser & Mobile',
    badgeColor: 'bg-purple-950/80 text-purple-400 border-purple-700/60',
    icon: '🐂',
    description: 'Feature-rich multi-platform wallet supporting advanced Stellar operations.',
    website: 'https://xbull.app/',
  },
  {
    id: 'lobstr',
    name: 'LOBSTR / WalletConnect',
    badge: 'Mobile App',
    badgeColor: 'bg-blue-950/80 text-blue-400 border-blue-700/60',
    icon: '🦞',
    description: 'Leading mobile wallet with QR code connection via WalletConnect.',
    website: 'https://lobstr.co/',
  },
  {
    id: 'rabet',
    name: 'Rabet Wallet',
    badge: 'Extension',
    badgeColor: 'bg-amber-950/80 text-amber-400 border-amber-700/60',
    icon: '🐇',
    description: 'Lightweight browser extension designed for open-source dApps.',
    website: 'https://rabet.io/',
  },
];

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onSelectWallet,
  wallet,
  errorMessage,
  isConnecting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-card rounded-3xl p-6 sm:p-7 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white font-sans">
              Connect Stellar Wallet
            </h3>
            <p className="text-xs text-slate-400">Select your preferred Stellar & Soroban provider</p>
          </div>
        </div>

        {/* Error Alert Display (3 Error Types: Wallet Missing, Rejected, Insufficient Balance) */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start space-x-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block text-rose-200">Wallet Error</span>
              <p className="text-[11px] leading-relaxed mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Multi-Wallet Options List */}
        <div className="space-y-2.5">
          {WALLET_OPTIONS.map((opt) => {
            const isSelected = wallet.connected && wallet.walletType === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => onSelectWallet(opt.id)}
                disabled={isConnecting}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-500/20'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl p-1.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-105 transition-transform">
                    {opt.icon}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {opt.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${opt.badgeColor}`}>
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs">{opt.description}</p>
                  </div>
                </div>

                {isSelected ? (
                  <span className="p-1 rounded-full bg-emerald-500 text-slate-950">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-slate-600 group-hover:text-cyan-400 transition-colors">
                    →
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>StellarWalletsKit Protocol</span>
          </span>
          <span className="text-slate-500">Testnet Supported</span>
        </div>

      </div>
    </div>
  );
};
