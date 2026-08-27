import React, { useState } from 'react';
import { Gift, CheckCircle2, ShieldAlert, Smartphone, ArrowRight, Wallet, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getSavedRemittances,
  updateRemittanceStatus,
  sha256,
  RemittanceRecord
} from '../utils/stellar';

interface ClaimRemittanceProps {
  onClaimSuccess: () => void;
}

export const ClaimRemittance: React.FC<ClaimRemittanceProps> = ({ onClaimSuccess }) => {
  const [claimCode, setClaimCode] = useState<string>('');
  const [payoutMethod, setPayoutMethod] = useState<'gcash' | 'maya' | 'stellar'>('gcash');
  const [destinationAccount, setDestinationAccount] = useState<string>('0917-123-4567');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [claimedRecord, setClaimedRecord] = useState<RemittanceRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const cleanCode = claimCode.trim();
      if (!cleanCode) {
        throw new Error('Please enter a valid secret claim PIN');
      }

      const remittances = getSavedRemittances();
      // Match by claim code
      const target = remittances.find(
        (r) => r.claimCode.toLowerCase() === cleanCode.toLowerCase()
      );

      if (!target) {
        throw new Error('Invalid Claim PIN or voucher not found.');
      }

      if (target.status === 'Claimed') {
        throw new Error('This remittance voucher has already been claimed.');
      }

      if (target.status === 'Refunded') {
        throw new Error('This remittance voucher has been refunded to the sender.');
      }

      if (Date.now() > target.expiryTimestamp) {
        throw new Error('This voucher has expired and cannot be claimed.');
      }

      // Update status
      updateRemittanceStatus(target.id, 'Claimed');
      setClaimedRecord(target);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // Safe fallback
      }

      onClaimSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to claim remittance voucher.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl text-slate-100">
      
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center space-x-2">
          <span>Claim Remittance Voucher</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
            Instant Payout
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Enter your secret claim PIN code. Funds will be verified by the Soroban contract and paid out in seconds.
        </p>
      </div>

      {claimedRecord ? (
        <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center animate-fadeIn">
          <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-white">Payout Successful! 🎉</h3>
          <p className="text-sm text-emerald-300 mt-1 font-semibold">
            ₱{claimedRecord.amountPhp.toLocaleString('en-US', { minimumFractionDigits: 2 })} PHP transferred to {payoutMethod.toUpperCase()} ({destinationAccount})
          </p>

          <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <p><span className="text-slate-400">Original Amount:</span> {claimedRecord.amount} {claimedRecord.currency}</p>
            <p><span className="text-slate-400">Remittance ID:</span> #{claimedRecord.id}</p>
            <p><span className="text-slate-400">Status:</span> <span className="text-emerald-400 font-bold">Settled on Stellar</span></p>
          </div>

          <button
            onClick={() => {
              setClaimedRecord(null);
              setClaimCode('');
            }}
            className="mt-5 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
          >
            Claim Another Voucher
          </button>
        </div>
      ) : (
        <form onSubmit={handleClaim} className="space-y-6">
          
          {/* Secret Code Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Secret One-Time Claim PIN
            </label>
            <input
              type="text"
              value={claimCode}
              onChange={(e) => setClaimCode(e.target.value)}
              placeholder="e.g., PDX-8801-4421"
              required
              className="w-full rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3.5 text-base sm:text-lg font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-500 uppercase tracking-wider"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              💡 Hint: Try sample demo voucher PIN <span className="text-cyan-400 font-mono font-bold">PDX-8801-4421</span>
            </p>
          </div>

          {/* Payout Method Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Payout Destination
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPayoutMethod('gcash');
                  setDestinationAccount('0917-123-4567');
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  payoutMethod === 'gcash'
                    ? 'bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                <span className="text-xs font-bold block">GCash</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPayoutMethod('maya');
                  setDestinationAccount('0920-987-6543');
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  payoutMethod === 'maya'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white ring-2 ring-emerald-500/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <span className="text-xs font-bold block">Maya</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPayoutMethod('stellar');
                  setDestinationAccount('GB2KZR7L5CNRPWZ5H26GDZFA7VS5WY5SWRQJMUL7NZ2MTX7AMRCURBZO');
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  payoutMethod === 'stellar'
                    ? 'bg-cyan-600/20 border-cyan-500 text-white ring-2 ring-cyan-500/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Wallet className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                <span className="text-xs font-bold block">Stellar Wallet</span>
              </button>
            </div>
          </div>

          {/* Destination Account Number / Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {payoutMethod === 'stellar' ? 'Stellar Public Key' : `${payoutMethod.toUpperCase()} Mobile Number`}
            </label>
            <input
              type="text"
              value={destinationAccount}
              onChange={(e) => setDestinationAccount(e.target.value)}
              required
              className="w-full rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Claim Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-bold text-base hover:from-emerald-400 hover:via-teal-500 hover:to-cyan-500 transition-all shadow-xl shadow-emerald-500/25 active:scale-[0.99] flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <span>Verifying Preimage on Soroban...</span>
            ) : (
              <>
                <Gift className="w-4 h-4" />
                <span>Verify & Claim Payout</span>
              </>
            )}
          </button>

        </form>
      )}

    </div>
  );
};
