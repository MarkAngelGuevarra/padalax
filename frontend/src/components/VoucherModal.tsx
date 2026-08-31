import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Share2, ExternalLink, Shield, Clock } from 'lucide-react';
import { RemittanceRecord, STELLAR_EXPERT_TESTNET } from '../utils/stellar';

interface VoucherModalProps {
  voucher: RemittanceRecord | null;
  onClose: () => void;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({ voucher, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!voucher) return null;

  const claimUrl = `${window.location.origin}/?claim=${encodeURIComponent(voucher.claimCode)}&id=${voucher.id}`;

  const shareText = `🇵🇭 PadalaX Remittance Voucher Received!\n` +
    `💰 Amount: ${voucher.amount} ${voucher.currency} (₱${voucher.amountPhp.toLocaleString('en-US', { minimumFractionDigits: 2 })})\n` +
    `🔑 Secret Claim PIN: ${voucher.claimCode}\n` +
    `📦 Remittance ID: #${voucher.id}\n` +
    `📲 Redeem instantly via PadalaX: ${claimUrl}\n` +
    `Direct payout to GCash, Maya, or any Stellar wallet!`;

  const copyToClipboard = async (text: string, type: 'code' | 'msg') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const formattedExpiry = new Date(voucher.expiryTimestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 text-slate-100 overflow-hidden">
        
        {/* Top Decorative Flare */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-400 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Soroban Escrow Locked</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white font-sans">
            Remittance Voucher Created! 🎉
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Share this voucher code or QR code with your recipient in the Philippines.
          </p>
        </div>

        {/* QR Code & Main Voucher Display */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center shadow-inner">
          <div className="p-3.5 bg-white rounded-2xl shadow-xl ring-4 ring-cyan-500/30 mb-4">
            <QRCodeSVG value={claimUrl} size={150} level="H" includeMargin={false} />
          </div>

          <div className="w-full text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">One-Time Secret Claim PIN</p>
            <div className="mt-1.5 flex items-center justify-center space-x-2 bg-slate-950 border border-cyan-500/40 rounded-xl px-4 py-2.5">
              <span className="font-mono text-xl sm:text-2xl font-extrabold tracking-widest text-cyan-300">
                {voucher.claimCode}
              </span>
              <button
                onClick={() => copyToClipboard(voucher.claimCode, 'code')}
                className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
                title="Copy PIN"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Voucher Metadata Details */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Remittance Amount</span>
            <span className="font-bold text-white text-sm">
              {voucher.amount} {voucher.currency}
            </span>
            <span className="text-emerald-400 font-semibold block text-[11px]">
              ≈ ₱{voucher.amountPhp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-0.5 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Expires On</span>
            </span>
            <span className="font-semibold text-slate-200 block truncate">
              {formattedExpiry}
            </span>
            <span className="text-slate-400 text-[10px]">100% Refundable if unclaimed</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => copyToClipboard(shareText, 'msg')}
              className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs sm:text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              {copiedMessage ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied Share Message!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Copy Share Text</span>
                </>
              )}
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md"
            >
              <span>WhatsApp</span>
            </a>

            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(claimUrl)}&text=${encodeURIComponent(`PadalaX Remittance Voucher (₱${voucher.amountPhp.toLocaleString()}): Claim PIN is ${voucher.claimCode}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-md"
            >
              <span>Telegram</span>
            </a>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
            <button
              onClick={() => window.print()}
              className="text-slate-400 hover:text-cyan-300 underline transition-colors"
            >
              🖨️ Print / Save Official Receipt
            </button>

            {voucher.txHash && (
              <a
                href={`${STELLAR_EXPERT_TESTNET}/tx/${voucher.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>View on Stellar Expert</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
