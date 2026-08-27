# 🇵🇭 PadalaX: Decentralized Cross-Border Remittance & Voucher Escrow Protocol

[![Stellar](https://img.shields.io/badge/Blockchain-Stellar-08B5E5?logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart%20Contracts-Soroban%20Rust-black?logo=rust)](https://soroban.stellar.org)
[![Belt](https://img.shields.io/badge/RiseIn%20Belt-Levels%201%2C%202%2C%203%20%26%20Idea-orange)](./project_proposal.md)

**PadalaX** is a decentralized, low-cost cross-border remittance and cryptographic voucher escrow protocol built on **Stellar and Soroban**. Designed for **Overseas Filipino Workers (OFWs)** and cross-border families, PadalaX slashes international remittance fees from traditional 5%–8% down to **less than \$0.001**, settles in **< 5 seconds**, and provides unbanked recipients with one-time claim codes for direct fiat settlement (GCash, Maya, local bank accounts).

---

## 🔗 Submission Navigation & Deliverables

| Level | Milestone | Status | Key Deliverables |
| :--- | :--- | :---: | :--- |
| 💭 **Idea Submission** | Problem & Architecture Proposal | ✅ Ready | [View Proposal (`project_proposal.md`)](./project_proposal.md) |
| ⚪ **Level 1: White Belt** | Stellar Account & Payment Setup | ✅ Ready | [`scripts/level1_stellar_setup.js`](./scripts/level1_stellar_setup.js) |
| 🟡 **Level 2: Yellow Belt** | Soroban Rust Smart Contract | ✅ Ready | [`contracts/padalax_remit/src/lib.rs`](./contracts/padalax_remit/src/lib.rs) |
| 🟠 **Level 3: Orange Belt** | State Modeling & Unit Tests | ✅ Ready | [`contracts/padalax_remit/src/test.rs`](./contracts/padalax_remit/src/test.rs) |

---

## ⚪ Level 1 — White Belt Deliverables (Stellar Fundamentals)

### Objective
Demonstrate programmatic keypair creation, Testnet account funding via Friendbot, account state verification, and transaction submission on the Stellar network.

### How to Run:
```bash
cd scripts
npm install
npm run level1
```

### Verified Output:
```text
====================================================
🇵🇭 PadalaX — Stellar RiseIn Level 1 (White Belt) Run
====================================================

🔑 1. Generated Stellar Accounts:
   [Sender (OFW)]    Public: GCGV...7KLA
   [Recipient (MNL)] Public: GDKL...92MN

⏳ Funding Sender and Recipient via Friendbot...
✅ Accounts successfully funded with 10,000 Testnet XLM!

💰 2. Account Balances on Testnet:
   Sender Initial Balance:    10000.0000000 XLM
   Recipient Initial Balance: 10000.0000000 XLM

📦 3. Building Stellar Remittance Transaction...
🚀 4. Submitting Transaction to Stellar Testnet...

🎉 ====================================================
✅ Level 1 Remittance Payment Confirmed on Stellar!
   Transaction Hash: a918f4d8...b2c34
   Ledger Number:    482910
   Explorer Link:    https://stellar.expert/explorer/testnet/tx/a918f4d8...
====================================================
```

---

## 🟡 Level 2 — Yellow Belt Deliverables (Soroban Foundation)

### Objective
Set up Soroban smart contract development environment, scaffold Rust smart contract (`PadalaXRemitContract`), and compile `.wasm` binary.

### Smart Contract Structure:
* **Contract Crate:** `contracts/padalax_remit`
* **Entry Point:** [`contracts/padalax_remit/src/lib.rs`](./contracts/padalax_remit/src/lib.rs)
* **SDK Version:** `soroban-sdk = "21.0.0"`

---

## 🟠 Level 3 — Orange Belt Deliverables (State Modeling & Logic)

### Objective
Implement stateful data modeling, cryptographic hash-preimage authorization, time-locked expiration, refund security, and automated unit testing.

### Key Soroban Contract Functions:
1. `create_remittance(sender, id, claim_hash, amount, expiry, memo)`:
   * Requires `sender.require_auth()`.
   * Locks funds into escrow identified by a unique `u32` ID.
   * Tracks global protocol volume (`DataKey::TotalVolume`).
2. `claim_remittance(recipient, id, claim_preimage)`:
   * Requires `recipient.require_auth()`.
   * Verifies SHA-256 hash match: `env.crypto().sha256(&claim_preimage) == remittance.claim_hash`.
   * Ensures `current_time <= expiry_timestamp`.
   * Transfers voucher status to `RemittanceStatus::Claimed`.
3. `refund_remittance(sender, id)`:
   * Requires `sender.require_auth()`.
   * Only permits refund if `current_time > expiry_timestamp` and status is `Pending`.
   * Transfers status to `RemittanceStatus::Refunded`.
4. `get_remittance(id)`: Read-only simulation for live UI tracking.
5. `get_total_volume()`: Read-only protocol metric query.

### How to Run Automated Unit Tests:
```bash
cargo test
```

### Test Suite Coverage:
* `test_create_and_claim_remittance_success`: Full lifecycle test from deposit to valid preimage redemption.
* `test_claim_with_wrong_preimage_panics`: Verifies rejection of incorrect secret codes.
* `test_refund_after_expiration_success`: Confirms sender refund after time lock expires.
* `test_refund_before_expiration_fails`: Prevents premature sender withdrawals.

---

## 📂 Project Directory Structure

```
padalax/
├── contracts/
│   └── padalax_remit/
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs              # Soroban Smart Contract (Level 2 & 3)
│           └── test.rs             # Automated Unit Tests (100% Pass)
├── scripts/
│   ├── package.json
│   └── level1_stellar_setup.js     # Level 1 Wallet & Payment Script
├── Cargo.toml                      # Root Cargo Workspace
├── project_proposal.md             # RiseIn Idea Submission Document
└── README.md                       # Main Documentation & Submission Guide
```

---

## 🚀 Next Milestones (Levels 4–7)
* **Level 4 (Green Belt):** React + Vite Web3 PWA with Freighter integration.
* **Level 5 (Blue Belt):** Dynamic QR voucher generator, real-time PHP/USD calculator, and live telemetry.
* **Level 6 (Black Belt):** Public Stellar Mainnet deployment, gasless relayer, and security audit report.
* **Level 7 (Master Track):** Live SEP-24 fiat off-ramp integration for GCash and Maya.
