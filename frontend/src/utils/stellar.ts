import { isConnected, getAddress, requestAccess } from '@stellar/freighter-api';

export const HORIZON_TESTNET_URL = 'https://horizon-testnet.stellar.org';
export const STELLAR_EXPERT_TESTNET = 'https://stellar.expert/explorer/testnet';
export const DEPLOYED_CONTRACT_ID = 'CATUXAJ7QPHA5AQM3F3D2HXAFN2BDEZHRTXUL2742XT6LVA2JRO7S3DM';

// Exchange rates (mock real-time reference)
export const EXCHANGE_RATES = {
  XLM_PHP: 7.25,
  USDC_PHP: 57.80,
  PHP_FEE_TRADITIONAL: 0.065, // 6.5% traditional fee
  PADALAX_FEE: 0.0001, // < $0.001
};

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: string;
  balanceXLM: string;
}

export interface RemittanceRecord {
  id: string;
  sender: string;
  recipientName: string;
  amount: number;
  currency: 'XLM' | 'USDC';
  amountPhp: number;
  claimCode: string;
  claimHash: string;
  createdAt: number;
  expiryTimestamp: number;
  status: 'Pending' | 'Claimed' | 'Refunded';
  memo: string;
  txHash: string;
}

// Generate SHA-256 hash from claim code string using Web Crypto API
export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate random secure PIN / code (e.g. "PDX-9824-7712")
export function generateClaimCode(): string {
  const randomPart1 = Math.floor(1000 + Math.random() * 9000);
  const randomPart2 = Math.floor(1000 + Math.random() * 9000);
  return `PDX-${randomPart1}-${randomPart2}`;
}

// Check Freighter Connection
export async function connectFreighter(): Promise<{ success: boolean; address: string | null; error?: string }> {
  try {
    const connected = await isConnected();
    if (!connected) {
      return { success: false, address: null, error: 'Freighter extension not found or not enabled.' };
    }
    const accessObj = await requestAccess();
    if (accessObj && accessObj.address) {
      return { success: true, address: accessObj.address };
    }
    const addrObj = await getAddress();
    if (addrObj && addrObj.address) {
      return { success: true, address: addrObj.address };
    }
    return { success: false, address: null, error: 'User declined connection request.' };
  } catch (err: any) {
    return { success: false, address: null, error: err.message || 'Failed to connect Freighter.' };
  }
}

// Fetch Account Balance from Testnet Horizon
export async function fetchAccountBalance(publicKey: string): Promise<string> {
  try {
    const res = await fetch(`${HORIZON_TESTNET_URL}/accounts/${publicKey}`);
    if (!res.ok) return '0.00';
    const data = await res.json();
    const nativeBal = data.balances.find((b: any) => b.asset_type === 'native');
    return nativeBal ? parseFloat(nativeBal.balance).toFixed(2) : '0.00';
  } catch {
    return '0.00';
  }
}

// Local Storage Helper for Demo Escrows
const STORAGE_KEY = 'padalax_remittances_v1';

export function getSavedRemittances(): RemittanceRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return getDefaultRemittances();
    return JSON.parse(saved);
  } catch {
    return getDefaultRemittances();
  }
}

export function saveRemittance(record: RemittanceRecord): void {
  const all = getSavedRemittances();
  all.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function updateRemittanceStatus(id: string, newStatus: 'Claimed' | 'Refunded'): boolean {
  const all = getSavedRemittances();
  const item = all.find(r => r.id === id);
  if (item) {
    item.status = newStatus;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return true;
  }
  return false;
}

function getDefaultRemittances(): RemittanceRecord[] {
  return [
    {
      id: '88001',
      sender: 'GCGV7KLAPAZW6X9R8234...',
      recipientName: 'Maria Santos (Manila)',
      amount: 250,
      currency: 'XLM',
      amountPhp: 1812.50,
      claimCode: 'PDX-8801-4421',
      claimHash: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
      createdAt: Date.now() - 3600000 * 4,
      expiryTimestamp: Date.now() + 3600000 * 24 * 7,
      status: 'Pending',
      memo: 'Monthly OFW Allowance',
      txHash: '0ca3a96342e58297fcacaa3abce4e02d47ad54a453b7a6cd6b516272f22d4c3d',
    },
    {
      id: '88002',
      sender: 'GDKL92MNBQW12456Y789...',
      recipientName: 'Juan Dela Cruz (Cebu)',
      amount: 100,
      currency: 'USDC',
      amountPhp: 5780.00,
      claimCode: 'PDX-3391-7210',
      claimHash: '9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba',
      createdAt: Date.now() - 3600000 * 28,
      expiryTimestamp: Date.now() + 3600000 * 24 * 5,
      status: 'Claimed',
      memo: 'Tuition Fee Payment',
      txHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    }
  ];
}
