import { describe, it, expect } from 'vitest';
import { generateClaimCode, sha256, EXCHANGE_RATES, FIAT_RATES, convertToPhp, getSavedRemittances } from '../stellar';

describe('PadalaX Web3 Utility Suite', () => {
  it('generates a valid formatted secret claim PIN', () => {
    const code = generateClaimCode();
    expect(code).toMatch(/^PDX-\d{4}-\d{4}$/);
  });

  it('computes deterministic SHA-256 cryptographic hashes for vouchers', async () => {
    const preimage = 'SECRET_PIN_2026';
    const hash = await sha256(preimage);
    expect(hash).toHaveLength(64);
    expect(typeof hash).toBe('string');

    // Deterministic check
    const secondHash = await sha256(preimage);
    expect(hash).toBe(secondHash);
  });

  it('calculates correct PHP conversion and fee savings vs traditional remittance', () => {
    const xlmAmount = 250;
    const estimatedPhp = convertToPhp(xlmAmount, 'XLM');
    expect(estimatedPhp).toBe(250 * 7.25);

    const traditionalFee = estimatedPhp * EXCHANGE_RATES.PHP_FEE_TRADITIONAL;
    expect(traditionalFee).toBeGreaterThan(0);
    expect(EXCHANGE_RATES.PADALAX_FEE).toBeLessThan(0.001);
  });

  it('supports major OFW host country fiat exchange rates', () => {
    expect(FIAT_RATES).toHaveProperty('AED');
    expect(FIAT_RATES).toHaveProperty('SAR');
    expect(FIAT_RATES).toHaveProperty('SGD');
    expect(FIAT_RATES).toHaveProperty('JPY');
    expect(FIAT_RATES).toHaveProperty('EUR');
    expect(FIAT_RATES.AED.rateToPhp).toBeGreaterThan(10);
    expect(FIAT_RATES.SGD.rateToPhp).toBeGreaterThan(30);
  });

  it('loads default mock escrow records if storage is empty', () => {
    const records = getSavedRemittances();
    expect(Array.isArray(records)).toBe(true);
    expect(records.length).toBeGreaterThan(0);
    expect(records[0]).toHaveProperty('claimCode');
    expect(records[0]).toHaveProperty('claimHash');
    expect(records[0]).toHaveProperty('status');
  });
});
