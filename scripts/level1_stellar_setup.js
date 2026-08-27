/**
 * PadalaX — Level 1: White Belt Verification Script
 * 
 * Demonstrates:
 * 1. Keypair generation (Sender & Recipient)
 * 2. Automated Testnet account funding via Friendbot
 * 3. Account balance verification on Horizon
 * 4. Constructing, signing, and submitting a Stellar Payment with Memo
 */

import { Keypair, Horizon, Networks, TransactionBuilder, Operation, Asset, Memo } from '@stellar/stellar-sdk';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(HORIZON_URL);

async function fundAccount(publicKey, label) {
  console.log(`\n⏳ Funding ${label} (${publicKey}) via Friendbot...`);
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
    const json = await response.json();
    if (response.ok) {
      console.log(`✅ ${label} successfully funded with 10,000 Testnet XLM!`);
    } else {
      console.log(`ℹ️ Friendbot response for ${label}:`, json);
    }
  } catch (err) {
    console.error(`❌ Failed to fund ${label}:`, err.message);
  }
}

async function runLevel1() {
  console.log('====================================================');
  console.log('🇵🇭 PadalaX — Stellar RiseIn Level 1 (White Belt) Run');
  console.log('====================================================');

  // 1. Generate Keypairs for OFW Sender and Manila Recipient
  const senderKeypair = Keypair.random();
  const recipientKeypair = Keypair.random();

  console.log('\n🔑 1. Generated Stellar Accounts:');
  console.log(`   [Sender (OFW)]    Public: ${senderKeypair.publicKey()}`);
  console.log(`                     Secret: ${senderKeypair.secret()}`);
  console.log(`   [Recipient (MNL)] Public: ${recipientKeypair.publicKey()}`);
  console.log(`                     Secret: ${recipientKeypair.secret()}`);

  // 2. Fund Accounts via Friendbot
  await fundAccount(senderKeypair.publicKey(), 'Sender');
  await fundAccount(recipientKeypair.publicKey(), 'Recipient');

  // Wait 3 seconds for ledger close
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 3. Check Initial Balances
  const senderAccount = await server.loadAccount(senderKeypair.publicKey());
  const recipientAccount = await server.loadAccount(recipientKeypair.publicKey());

  console.log('\n💰 2. Account Balances on Testnet:');
  console.log(`   Sender Initial Balance:    ${senderAccount.balances[0].balance} XLM`);
  console.log(`   Recipient Initial Balance: ${recipientAccount.balances[0].balance} XLM`);

  // 4. Construct Cross-Border Remittance Payment
  console.log('\n📦 3. Building Stellar Remittance Transaction...');
  const sendAmount = '50.0000000'; // 50 XLM
  const remittanceMemo = Memo.text('PadalaX: Tuition Pmt');

  const transaction = new TransactionBuilder(senderAccount, {
    fee: '100', // Base fee (0.00001 XLM)
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: recipientKeypair.publicKey(),
        asset: Asset.native(),
        amount: sendAmount,
      })
    )
    .addMemo(remittanceMemo)
    .setTimeout(180)
    .build();

  // 5. Sign with Sender Secret Key
  transaction.sign(senderKeypair);

  // 6. Submit Transaction to Stellar Testnet Horizon
  console.log('🚀 4. Submitting Transaction to Stellar Testnet...');
  try {
    const txResponse = await server.submitTransaction(transaction);
    console.log('\n🎉 ====================================================');
    console.log('✅ Level 1 Remittance Payment Confirmed on Stellar!');
    console.log(`   Transaction Hash: ${txResponse.hash}`);
    console.log(`   Ledger Number:    ${txResponse.ledger}`);
    console.log(`   Explorer Link:    https://stellar.expert/explorer/testnet/tx/${txResponse.hash}`);
    console.log('====================================================\n');
  } catch (error) {
    console.error('❌ Transaction Submission Error:', error.response ? error.response.data : error);
  }
}

runLevel1();
