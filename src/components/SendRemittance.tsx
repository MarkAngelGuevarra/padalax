import React, { useState } from 'react';
import { Send, Sparkles, Shield, Clock, HelpCircle, ArrowRight, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  WalletState,
  RemittanceRecord,
  EXCHANGE_RATES,
  generateClaimCode,
  sha256,
  saveRemittance
} from '../utils/stellar';

interface SendRemittanceProps {
  wallet: WalletState;
  onSuccess: (voucher: RemittanceRecord) => void;
}

export const SendRemittance: React.FC<SendRemittanceProps> = ({ wallet, onSuccess }) => {
  const [amount, setAmount] = useState<string>('250');
  const [currency, setCurrency] = useState<'XLM' | 'USDC'>('XLM');
  const [recipientName, setRecipientName] = useState<string>('');
  const [memo, setMemo] = useState<string>('Monthly OFW Family Allowance');
  const [expiryDays, setExpiryDays] = useState<number>(7);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [customClaimCode, setCustomClaimCode] = useState<string>(generateClaimCode());

  // Currency calculations
  const numAmount = parseFloat(amount) || 0;
  const rate = currency === 'XLM' ? EXCHANGE_RATES.XLM_PHP : EXCHANGE_RATES.USDC_PHP;
  const estimatedPhp = numAmount * rate;
  const traditionalFeePhp = estimatedPhp * EXCHANGE_RATES.PHP_FEE_TRADITIONAL;
  const padalaxFeeUsd = EXCHANGE_RATES.PADALAX_FEE;

  const handleRegenerateCode = () => {
    setCustomClaimCode(generateClaimCode());
  };

  const handleCreateRemittance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;

    setIsSubmitting(true);

    try {
      // 1. Calculate SHA-256 Hash of the secret preimage
      const claimHash = await sha256(customClaimCode);
      const remittanceId = Math.floor(88000 + Math.random() * 9999).toString();
      const expiryTimestamp = Date.now() + expiryDays * 24 * 60 * 60 * 1000;

      // Mock random Testnet tx hash for demo
      const randomTx = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const record: RemittanceRecord = {
        id: remittanceId,
        sender: wallet.address || 'GCGV7KLAPAZW6X9R8234...',
        recipientName: recipientName || 'Family in Philippines',
        amount: numAmount,
        currency,
        amountPhp: estimatedPhp,
        claimCode: customClaimCode,
        claimHash,
        createdAt: Date.now(),
        expiryTimestamp,
        status: 'Pending',
        memo,
        txHash: randomTx,
      };

      // Save locally
      saveRemittance(record);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }

      onSuccess(record);

      // Reset form
      setCustomClaimCode(generateClaimCode());
      setRecipientName('');
    } catch (err: any) {
      alert('Error creating remittance: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl text-slate-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center space-x-2">
            <span>Send Cross-Border Remittance</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Zero Off-Ramp Friction
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deposit funds into Soroban Escrow. Your recipient gets a one-time code to withdraw directly into GCash, Maya, or Bank.
          </p>
        </div>
      </div>

      <form onSubmit={handleCreateRemittance} className="space-y-6">
        
        {/* Amount & Currency */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Remittance Amount
          </label>
          <div className="relative flex rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-cyan-500 transition-colors overflow-hidden">
            <input
              type="number"
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full bg-transparent px-4 py-3.5 text-xl sm:text-2xl font-bold text-white focus:outline-none"
            />
            
            <div className="flex items-center border-l border-slate-800 bg-slate-950/50 px-3">
              <button
                type="button"
                onClick={() => setCurrency('XLM')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currency === 'XLM'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                XLM
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USDC')}
                className={`ml-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currency === 'USDC'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                USDC
              </button>
            </div>
          </div>
        </div>

        {/* Live PHP Conversion & Traditional Fee Comparison */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-400 font-medium">Estimated Recipient Payout:</span>
            <span className="font-extrabold text-emerald-400 text-base">
              ₱{estimatedPhp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PHP
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center space-x-1">
              <span>Traditional Money Transfer Fee (5–8%):</span>
            </span>
            <span className="text-rose-400 line-through font-semibold">
              -₱{traditionalFeePhp.toFixed(2)} PHP
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="text-cyan-400 font-semibold flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>PadalaX Stellar Fee:</span>
            </span>
            <span className="text-cyan-300 font-bold">
              &lt; $0.001 (₱0.05 PHP)
            </span>
          </div>
        </div>

        {/* Recipient Details & Expiry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Recipient Name / Note (Optional)
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g., Nanay Maria (Manila)"
              className="w-full rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Time-Lock Expiry</span>
              <span className="text-[10px] text-slate-400 font-normal">Sender Refundable</span>
            </label>
            <select
              value={expiryDays}
              onChange={(e) => setExpiryDays(Number(e.target.value))}
              className="w-full rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value={1}>1 Day (24 Hours)</option>
              <option value={3}>3 Days</option>
              <option value={7}>7 Days (Recommended)</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
            </select>
          </div>
        </div>

        {/* Preimage / Claim Code Preview */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-900/40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-cyan-300 flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Generated Cryptographic Claim Code</span>
            </span>
            <button
              type="button"
              onClick={handleRegenerateCode}
              className="text-[11px] text-slate-400 hover:text-cyan-300 underline transition-colors"
            >
              Regenerate PIN
            </button>
          </div>
          <p className="font-mono text-base font-bold text-white">
            {customClaimCode}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Locked on Soroban with SHA-256 hash. The contract will only release funds when this exact preimage is supplied.
          </p>
        </div>

        {/* Submit Escrow Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-base hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-cyan-500/25 active:scale-[0.99] flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <span>Locking Escrow on Stellar Testnet...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Lock & Generate Remittance Voucher</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};
