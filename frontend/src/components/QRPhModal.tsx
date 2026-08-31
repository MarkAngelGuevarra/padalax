import React, { useState } from 'react';
import { generateQRPhPayload } from '../utils/relayer';

interface QRPhModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimPin: string;
  amountPhp: string;
}

export const QRPhModal: React.FC<QRPhModalProps> = ({
  isOpen,
  onClose,
  claimPin,
  amountPhp,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const payload = generateQRPhPayload({
    merchantName: 'PadalaX Remit PH',
    city: 'Manila',
    amount: amountPhp || '2500',
    currency: 'PHP',
    claimPin: claimPin || '772910',
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <span>🇵🇭</span> QRPh National QR Standard (EMVCo)
          </div>
          <h3 className="text-2xl font-bold text-white">Instant Philippine Cash Pickup</h3>
          <p className="text-xs text-slate-400 mt-1">
            Present this QR code at any accredited GCash, Maya, Cebuana, or Palawan Express partner.
          </p>
        </div>

        {/* QR Frame Container */}
        <div className="bg-white p-4 rounded-xl flex flex-col items-center justify-center shadow-inner mb-4">
          <div className="w-48 h-48 bg-slate-100 border-2 border-dashed border-slate-400 rounded-lg flex flex-col items-center justify-center text-slate-800 p-2 text-center">
            <div className="font-mono text-2xl font-bold tracking-widest text-slate-900 mb-1">
              {claimPin || '772910'}
            </div>
            <div className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider mb-2">
              PadalaX Escrow Voucher
            </div>
            <div className="bg-slate-900 text-cyan-400 text-xs font-bold px-3 py-1 rounded-md">
              PHP ₱{amountPhp || '2,500.00'}
            </div>
            <div className="text-[9px] text-slate-500 mt-2 font-mono break-all line-clamp-2 px-2">
              {payload.slice(0, 32)}...
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-2">
            Scan with GCash • Maya • BDO • BPI • UnionBank App
          </span>
        </div>

        {/* Relayer Sponsorship Callout */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-300 mb-4 flex items-center gap-2">
          <span className="text-lg">⛽</span>
          <div>
            <div className="font-semibold text-emerald-200">Zero Network Gas (Sponsored)</div>
            <div className="text-[11px] text-emerald-400">
              Transaction fees are 100% covered by the PadalaX Stellar FeeBump Relayer.
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            {copied ? '✅ Payload Copied!' : '📋 Copy EMVCo Payload'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
