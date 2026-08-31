import React, { useState } from 'react';
import { X, Plus, Trash2, Users, Sparkles, CheckCircle2, Shield, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateClaimCode, sha256, RemittanceRecord, saveRemittance, EXCHANGE_RATES, WalletState } from '../utils/stellar';

interface BatchItem {
  id: string;
  recipientName: string;
  amount: string;
  currency: 'XLM' | 'USDC';
  purpose: string;
  claimCode: string;
}

interface BatchRemittanceModalProps {
  wallet: WalletState;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (vouchers: RemittanceRecord[]) => void;
}

export const BatchRemittanceModal: React.FC<BatchRemittanceModalProps> = ({
  wallet,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [items, setItems] = useState<BatchItem[]>([
    { id: '1', recipientName: 'Nanay Corazon (Mother)', amount: '150', currency: 'XLM', purpose: 'Family Groceries & Bills', claimCode: generateClaimCode() },
    { id: '2', recipientName: 'Mark Jr. (Son)', amount: '200', currency: 'XLM', purpose: 'College Tuition', claimCode: generateClaimCode() },
  ]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (items.length >= 5) return;
    setItems([
      ...items,
      {
        id: Math.random().toString(),
        recipientName: '',
        amount: '100',
        currency: 'XLM',
        purpose: 'Family Allowance',
        claimCode: generateClaimCode(),
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof BatchItem, value: any) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const totalXlm = items.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
  const totalPhp = totalXlm * EXCHANGE_RATES.XLM_PHP;
  const traditionalFeePhp = totalPhp * EXCHANGE_RATES.PHP_FEE_TRADITIONAL;

  const handleExecuteBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const generatedRecords: RemittanceRecord[] = [];

      for (const item of items) {
        const numAmount = parseFloat(item.amount) || 50;
        const claimHash = await sha256(item.claimCode);
        const recordId = Math.floor(88000 + Math.random() * 9999).toString();
        const randomTx = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

        const record: RemittanceRecord = {
          id: recordId,
          sender: wallet.address || 'GCGV7KLAPAZW6X9R8234...',
          recipientName: item.recipientName || 'Family Member',
          amount: numAmount,
          currency: item.currency,
          amountPhp: numAmount * (item.currency === 'XLM' ? EXCHANGE_RATES.XLM_PHP : EXCHANGE_RATES.USDC_PHP),
          claimCode: item.claimCode,
          claimHash,
          createdAt: Date.now(),
          expiryTimestamp: Date.now() + 7 * 24 * 60 * 60 * 1000,
          status: 'Pending',
          memo: `PadalaX Batch: ${item.purpose}`,
          txHash: randomTx,
        };

        saveRemittance(record);
        generatedRecords.push(record);
      }

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // Fallback
      }

      onSuccess(generatedRecords);
      onClose();
    } catch (err: any) {
      alert('Failed to process batch: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-400 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Multi-Recipient Escrow</span>
          </div>
          <h3 className="text-2xl font-black text-white font-sans">
            Batch Remittance Generator 🇵🇭
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Create multiple independent claim vouchers in a single transaction. Perfect for sending allowances to several family members at once.
          </p>
        </div>

        <form onSubmit={handleExecuteBatch} className="space-y-4">
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Voucher #{idx + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                      Recipient / Label
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nanay Corazon, Daughter Tuition"
                      value={item.recipientName}
                      onChange={(e) => handleUpdateItem(item.id, 'recipientName', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                      Amount (XLM)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.amount}
                      onChange={(e) => handleUpdateItem(item.id, 'amount', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                  <span>Claim PIN: <code className="text-cyan-300 font-mono font-bold">{item.claimCode}</code></span>
                  <span className="text-emerald-400 font-semibold">≈ ₱{((parseFloat(item.amount) || 0) * EXCHANGE_RATES.XLM_PHP).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {items.length < 5 && (
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500 text-slate-400 hover:text-cyan-300 text-xs font-semibold transition-all flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Recipient Voucher (Max 5)</span>
            </button>
          )}

          {/* Batch Summary */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/30 border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Total Remittance ({items.length} Recipients):</span>
              <span className="font-bold text-white text-sm">{totalXlm} XLM (₱{totalPhp.toLocaleString()})</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>Traditional Remittance Fees Saved:</span>
              <span className="font-bold">₱{traditionalFeePhp.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-cyan-400">
              <span>Stellar Network Gas Fee:</span>
              <span className="font-bold">&lt; ₱0.01 (0.0001 XLM)</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Locking Funds in Soroban Escrows...' : `Lock & Generate ${items.length} Remittance Vouchers 🚀`}
          </button>
        </form>

      </div>
    </div>
  );
};
