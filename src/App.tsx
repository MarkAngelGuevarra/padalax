import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SendRemittance } from './components/SendRemittance';
import { ClaimRemittance } from './components/ClaimRemittance';
import { RefundRemittance } from './components/RefundRemittance';
import { LiveTelemetry } from './components/LiveTelemetry';
import { VoucherModal } from './components/VoucherModal';
import { RoadmapModal } from './components/RoadmapModal';
import {
  WalletState,
  RemittanceRecord,
  connectFreighter,
  fetchAccountBalance,
  getSavedRemittances
} from './utils/stellar';
import { Send, Gift, RotateCcw, Activity, ShieldCheck, Zap, Globe, Sparkles, ChevronRight } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'send' | 'claim' | 'refund' | 'telemetry'>('send');
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    network: 'TESTNET',
    balanceXLM: '0.00',
  });
  const [remittances, setRemittances] = useState<RemittanceRecord[]>([]);
  const [activeVoucher, setActiveVoucher] = useState<RemittanceRecord | null>(null);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    setRemittances(getSavedRemittances());
  }, []);

  const refreshData = () => {
    setRemittances(getSavedRemittances());
  };

  const handleConnectWallet = async () => {
    const res = await connectFreighter();
    if (res.success && res.address) {
      const bal = await fetchAccountBalance(res.address);
      setWallet({
        connected: true,
        address: res.address,
        network: 'TESTNET',
        balanceXLM: bal,
      });
    } else {
      // Mock demo wallet if Freighter not installed
      setWallet({
        connected: true,
        address: 'GCGV7KLAPAZW6X9R8234DF987TESTNETMOCK',
        network: 'TESTNET',
        balanceXLM: '9850.50',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100">
      
      {/* Top Navbar */}
      <Header
        wallet={wallet}
        onConnect={handleConnectWallet}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Stellar RiseIn Monthly Builder • Soroban Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-sans leading-tight">
            Send Money to the <br className="hidden sm:inline" />
            <span className="gradient-text-ph">Philippines</span> in Seconds.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-2xl mx-auto">
            Slash remittance fees from 8% down to <strong className="text-cyan-300">&lt; $0.001</strong>. Senders lock cryptographic vouchers on Soroban; unbanked recipients cash out instantly to <strong className="text-white">GCash, Maya, and Banks</strong>.
          </p>

          {/* Quick Feature Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>&lt; 5s Settlement</span>
            </span>
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>SHA-256 Preimage Escrow</span>
            </span>
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800">
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Time-Locked Refund</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg">
            
            <button
              onClick={() => setActiveTab('send')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'send'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Send Remittance</span>
            </button>

            <button
              onClick={() => setActiveTab('claim')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'claim'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Claim Voucher</span>
            </button>

            <button
              onClick={() => setActiveTab('refund')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'refund'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md shadow-amber-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refund Escrow</span>
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'telemetry'
                  ? 'bg-slate-800 text-cyan-300 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Telemetry</span>
            </button>

          </div>
        </div>

        {/* Tab Content Display */}
        <div className="max-w-2xl mx-auto">
          {activeTab === 'send' && (
            <SendRemittance
              wallet={wallet}
              onSuccess={(voucher) => {
                refreshData();
                setActiveVoucher(voucher);
              }}
            />
          )}

          {activeTab === 'claim' && (
            <ClaimRemittance onClaimSuccess={refreshData} />
          )}

          {activeTab === 'refund' && (
            <RefundRemittance onRefundSuccess={refreshData} />
          )}

          {activeTab === 'telemetry' && (
            <div className="max-w-4xl -mx-4 sm:mx-0">
              <LiveTelemetry remittances={remittances} />
            </div>
          )}
        </div>

        {/* Bottom Banner for RiseIn Roadmap */}
        <div className="mt-16 max-w-4xl mx-auto p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Stellar RiseIn Submission</span>
            <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Levels 1, 2, 3, 4 & 5 Fully Implemented
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Includes Horizon Payment Automation, Soroban Rust Contract, Cargo Tests, Web3 PWA, and QR Voucher system.
            </p>
          </div>

          <button
            onClick={() => setIsRoadmapOpen(true)}
            className="flex-shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <span>View Belt Progression</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* Modals */}
      <VoucherModal
        voucher={activeVoucher}
        onClose={() => setActiveVoucher(null)}
      />

      <RoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-8 bg-slate-950 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 PadalaX Protocol • Built on Stellar & Soroban for Overseas Filipino Workers.</p>
          <div className="flex items-center space-x-4">
            <a
              href="https://stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Stellar.org
            </a>
            <a
              href="https://soroban.stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Soroban Docs
            </a>
            <a
              href="https://github.com/MarkAngelGuevarra/padalax"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub Repo
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};
export default App;
