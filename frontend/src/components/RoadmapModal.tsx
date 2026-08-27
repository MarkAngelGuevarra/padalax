import React from 'react';
import { X, CheckCircle2, Circle, ArrowUpRight, Award, Shield, Cpu, Code2, Globe } from 'lucide-react';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BeltLevel {
  level: number;
  name: string;
  belt: string;
  badgeColor: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  description: string;
  deliverables: string[];
}

const BELT_LEVELS: BeltLevel[] = [
  {
    level: 1,
    name: 'Stellar Network Fundamentals',
    belt: '⚪ White Belt',
    badgeColor: 'bg-slate-200 text-slate-900 border-slate-300',
    status: 'Completed',
    description: 'Programmatic keypair creation, Friendbot Testnet funding, account balance querying, and Stellar Payment submission with Memo.',
    deliverables: ['scripts/level1_stellar_setup.js', 'Horizon RPC Integration', 'Payment Explorer Confirmation'],
  },
  {
    level: 2,
    name: 'Soroban Environment & Contract Scaffolding',
    belt: '🟡 Yellow Belt',
    badgeColor: 'bg-yellow-400/20 text-yellow-300 border-yellow-500/40',
    status: 'Completed',
    description: 'Soroban Rust smart contract environment setup, workspace profile optimization, and core WASM contract structure.',
    deliverables: ['contracts/padalax_remit/Cargo.toml', 'Cargo.toml Root Workspace', 'WASM Optimization Profile'],
  },
  {
    level: 3,
    name: 'State Modeling, Access Control & Tests',
    belt: '🟠 Orange Belt',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    status: 'Completed',
    description: 'Persistent escrow storage, SHA-256 hashlock preimage verification, time-lock expirations, require_auth(), and unit test suite.',
    deliverables: ['contracts/padalax_remit/src/lib.rs', 'contracts/padalax_remit/src/test.rs (4/4 Pass)', 'Event Publishing (TOPIC_REMIT)'],
  },
  {
    level: 4,
    name: 'Web3 Frontend & Wallet Connection',
    belt: '🟢 Green Belt',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    status: 'Completed',
    description: 'React + Vite Web3 PWA with Freighter wallet connection, dynamic deposit triggers, and real-time balance feeds.',
    deliverables: ['React + Vite + Tailwind PWA', 'Freighter Wallet API Integration', 'Vercel Continuous Deployment'],
  },
  {
    level: 5,
    name: 'Advanced UX, QR Vouchers & Telemetry',
    belt: '🔵 Blue Belt',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    status: 'Completed',
    description: 'Dynamic QR code generator, live PHP/XLM exchange rates, Viber/WhatsApp claim share links, and protocol telemetry.',
    deliverables: ['Dynamic QR Code Generator', 'Live PHP Currency Converter', 'Real-Time Protocol Metrics'],
  },
  {
    level: 6,
    name: 'Mainnet Deployment & Gasless Relayer',
    belt: '⚫ Black Belt',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    status: 'In Progress',
    description: 'Public Stellar Mainnet deployment, fee-bump sponsored gasless transactions for recipient payouts, and contract security audit.',
    deliverables: ['Stellar Mainnet Contract Deploy', 'FeeBumpTransaction Gasless Sponsor', 'Security Audit Report'],
  },
  {
    level: 7,
    name: 'SEP-24 Fiat Off-Ramp & Production Scaling',
    belt: '🏆 Master Track',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    status: 'Upcoming',
    description: 'Live integration with Stellar Anchor SEP-24 rails connecting directly to GCash, Maya, and Philippine InstaPay banking networks.',
    deliverables: ['SEP-24 Interactive Anchor Flow', 'Direct GCash/Maya API Bridge', 'Go-To-Market Pilot Program'],
  },
];

export const RoadmapModal: React.FC<RoadmapModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] glass-card rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl overflow-y-auto text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white font-sans">
              Stellar RiseIn Monthly Builder Roadmap
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              PadalaX protocol milestone tracker from White Belt to Master Track
            </p>
          </div>
        </div>

        {/* Levels List */}
        <div className="space-y-4">
          {BELT_LEVELS.map((item) => (
            <div
              key={item.level}
              className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-800/80 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${item.badgeColor}`}>
                    Level {item.level} • {item.belt}
                  </span>
                  <h4 className="font-bold text-white text-sm sm:text-base">{item.name}</h4>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  {item.status === 'Completed' && (
                    <span className="inline-flex items-center space-x-1 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </span>
                  )}
                  {item.status === 'In Progress' && (
                    <span className="inline-flex items-center space-x-1 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/60">
                      <Circle className="w-3.5 h-3.5 animate-pulse text-amber-400 fill-amber-400" />
                      <span>In Progress</span>
                    </span>
                  )}
                  {item.status === 'Upcoming' && (
                    <span className="text-slate-400 text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                {item.deliverables.map((del, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-cyan-300"
                  >
                    ✓ {del}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
