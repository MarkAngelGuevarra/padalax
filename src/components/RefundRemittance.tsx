import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, CheckCircle2, ShieldCheck, Search } from 'lucide-react';
import { getSavedRemittances, updateRemittanceStatus, RemittanceRecord } from '../utils/stellar';

interface RefundRemittanceProps {
  onRefundSuccess: () => void;
}

export const RefundRemittance: React.FC<RefundRemittanceProps> = ({ onRefundSuccess }) => {
  const [remittanceId, setRemittanceId] = useState<string>('');
  const [foundRecord, setFoundRecord] = useState<RemittanceRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [refundSuccess, setRefundSuccess] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setRefundSuccess(false);

    const cleanId = remittanceId.trim();
    if (!cleanId) return;

    const remittances = getSavedRemittances();
    const target = remittances.find((r) => r.id === cleanId || `#${r.id}` === cleanId);

    if (!target) {
      setFoundRecord(null);
      setStatusMessage('No remittance found with this ID.');
      return;
    }

    setFoundRecord(target);
  };

  const handleRefund = async () => {
    if (!foundRecord) return;
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      if (foundRecord.status === 'Claimed') {
        throw new Error('This remittance has already been claimed by the recipient.');
      }
      if (foundRecord.status === 'Refunded') {
        throw new Error('This remittance has already been refunded.');
      }

      // Time lock check
      const now = Date.now();
      const isExpired = now > foundRecord.expiryTimestamp;

      // Note: for demo, if not expired, explain time lock enforcement
      if (!isExpired) {
        throw new Error(
          `Time-lock active: This escrow expires on ${new Date(
            foundRecord.expiryTimestamp
          ).toLocaleString()}. Soroban will only allow refunding after expiration.`
        );
      }

      updateRemittanceStatus(foundRecord.id, 'Refunded');
      setRefundSuccess(true);
      setFoundRecord({ ...foundRecord, status: 'Refunded' });
      onRefundSuccess();
    } catch (err: any) {
      setStatusMessage(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl text-slate-100">
      
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center space-x-2">
          <span>Sender Escrow Refund</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
            Time-Locked Safety
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Unclaimed remittances can be 100% refunded back to the sender after the expiration period ends.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            value={remittanceId}
            onChange={(e) => setRemittanceId(e.target.value)}
            placeholder="Enter Remittance ID (e.g. 88001)"
            className="w-full rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center space-x-1.5"
        >
          <Search className="w-4 h-4" />
          <span>Lookup</span>
        </button>
      </form>

      {/* Status Message */}
      {statusMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-800 text-amber-300 text-xs flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Found Remittance Card */}
      {foundRecord && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400 font-medium">Remittance #{foundRecord.id}</span>
              <h4 className="font-bold text-white text-base">{foundRecord.recipientName}</h4>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                foundRecord.status === 'Claimed'
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                  : foundRecord.status === 'Refunded'
                  ? 'bg-purple-950/80 text-purple-400 border-purple-800'
                  : 'bg-amber-950/80 text-amber-400 border-amber-800'
              }`}
            >
              {foundRecord.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Locked Amount:</span>
              <p className="font-bold text-white">{foundRecord.amount} {foundRecord.currency}</p>
            </div>
            <div>
              <span className="text-slate-400">Time-Lock Expiry:</span>
              <p className="font-semibold text-slate-300">
                {new Date(foundRecord.expiryTimestamp).toLocaleDateString()}
              </p>
            </div>
          </div>

          {refundSuccess ? (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Refund executed! Funds unlocked back to sender account.</span>
            </div>
          ) : (
            <button
              onClick={handleRefund}
              disabled={isProcessing || foundRecord.status !== 'Pending'}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                foundRecord.status === 'Pending'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isProcessing ? 'Processing Refund...' : 'Claim 100% Refund'}</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};
