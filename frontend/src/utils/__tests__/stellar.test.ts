import { describe, it, expect } from 'vitest';
import { generateClaimCode, sha256, EXCHANGE_RATES, getSavedRemittances } from '../stellar';

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
    const estimatedPhp = xlmAmount * EXCHANGE_RATES.XLM_PHP;
    expect(estimatedPhp).toBe(250 * 7.25);

    const traditionalFee = estimatedPhp * EXCHANGE_RATES.PHP_FEE_TRADITIONAL;
    expect(traditionalFee).toBeGreaterThan(0);
    expect(EXCHANGE_RATES.PADALAX_FEE).toBeLessThan(0.001);
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
