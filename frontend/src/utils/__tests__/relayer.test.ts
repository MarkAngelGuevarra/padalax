import { describe, it, expect } from 'vitest';
import { sponsorClaimTransaction, generateQRPhPayload, RELAYER_PUBLIC_KEY } from '../relayer';

describe('FeeBump Relayer & QRPh Utilities', () => {
  it('sponsors claim transactions with zero gas cost for recipient', async () => {
    const result = await sponsorClaimTransaction('dummy_xdr_payload');
    expect(result.success).toBe(true);
    expect(result.sponsor).toBe(RELAYER_PUBLIC_KEY);
    expect(result.feePaidInXlm).toBe('0.0000100');
    expect(result.innerTxHash).toBeDefined();
  });

  it('generates valid EMVCo QRPh standard payload for Philippine retail off-ramps', () => {
    const payload = generateQRPhPayload({
      merchantName: 'PadalaX Hub Manila',
      city: 'Manila',
      amount: '5000',
      currency: 'PHP',
      claimPin: '772910',
    });
    expect(payload).toContain('ph.gov.qrph');
    expect(payload).toContain('772910');
    expect(payload).toContain('PadalaX Hub Manila');
  });
});
