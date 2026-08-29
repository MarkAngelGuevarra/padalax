# 🇵🇭 PadalaX: Decentralized Cross-Border Remittance & Voucher Escrow Protocol

[![Stellar](https://img.shields.io/badge/Blockchain-Stellar-08B5E5?logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart%20Contracts-Soroban%20Rust-black?logo=rust)](https://soroban.stellar.org)
[![CI/CD Pipeline](https://github.com/MarkAngelGuevarra/padalax/actions/workflows/ci.yml/badge.svg)](https://github.com/MarkAngelGuevarra/padalax/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20dApp-Vercel-black?logo=vercel)](https://padalax.vercel.app)
[![Belt](https://img.shields.io/badge/RiseIn%20Belt-Orange%20Belt%20(Level%203%20%2B%201%2C%202)-orange)](./project_proposal.md)

**PadalaX** is a decentralized, low-cost cross-border remittance and cryptographic voucher escrow protocol built on **Stellar and Soroban**. Designed for **Overseas Filipino Workers (OFWs)** and cross-border families, PadalaX slashes international remittance fees from traditional 5%–8% down to **less than \$0.001**, settles in **< 5 seconds**, and provides unbanked recipients with one-time claim codes for direct fiat settlement (GCash, Maya, local bank accounts).

---

## 🖼️ Live Web3 dApp Preview (Desktop & Mobile Responsive)

<p align="center">
  <img src="./assets/screenshots/desktop_ui.png" alt="PadalaX Desktop Web3 dApp" width="800" style="border-radius: 12px; margin-bottom: 16px;" />
</p>

<p align="center">
  <img src="./assets/screenshots/mobile_ui.png" alt="PadalaX Mobile Responsive UI" width="320" style="border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);" />
  <br />
  <em>📱 Mobile Responsive UI tested and running live at <a href="https://padalax.vercel.app">padalax.vercel.app</a></em>
</p>

---

## 🔗 Level 3 (Orange Belt) Submission Verification Hub

| Submission Requirement | Status | Live Link / Identifier |
| :--- | :---: | :--- |
| 🌐 **Live Web3 dApp (Vercel)** | ✅ Ready | [padalax.vercel.app](https://padalax.vercel.app) |
| 📜 **Deployed Soroban Contract** | ✅ Verified | [`CATUXAJ7QPHA5AQM3F3D2HXAFN2BDEZHRTXUL2742XT6LVA2JRO7S3DM`](https://stellar.expert/explorer/testnet/contract/CATUXAJ7QPHA5AQM3F3D2HXAFN2BDEZHRTXUL2742XT6LVA2JRO7S3DM) |
| ⚡ **Contract Interaction Tx Hash** | ✅ Verified | [`4d266d77030d59f9afd3de0f8a2f123612f3db1e5e3e823acb4091b11bc24883`](https://stellar.expert/explorer/testnet/tx/4d266d77030d59f9afd3de0f8a2f123612f3db1e5e3e823acb4091b11bc24883) |
| 📦 **Contract Deployment Tx Hash** | ✅ Verified | [`6eecd976d300415abb1bc348ac6eb3dc68aa9b5593f88ca49672a30adccbb04c`](https://stellar.expert/explorer/testnet/tx/6eecd976d300415abb1bc348ac6eb3dc68aa9b5593f88ca49672a30adccbb04c) |
| ⚙️ **CI/CD Pipeline Workflow** | ✅ Running | [GitHub Actions `.github/workflows/ci.yml`](https://github.com/MarkAngelGuevarra/padalax/actions) |
| 🧪 **Contract Unit Tests (6/6 Pass)** | ✅ 100% | [`contracts/padalax_remit/src/test.rs`](./contracts/padalax_remit/src/test.rs) |
| 🧪 **Frontend Unit Tests (4/4 Pass)** | ✅ 100% | [`frontend/src/utils/__tests__/stellar.test.ts`](./frontend/src/utils/__tests__/stellar.test.ts) |

---

## ⚪ Level 1 — White Belt Deliverables (Stellar Fundamentals)

### Objective
Demonstrate programmatic keypair creation, Testnet account funding via Friendbot, account state verification, and transaction submission on the Stellar network.

### How to Run:
```bash
npm run level1 --prefix scripts
```

### Verified Horizon Payment Output:
* **Transaction Hash:** `7f82b338a582f367c13bb066f17493ff5b2520e32cc35e2daf66812ddea46eda`
* **Ledger Number:** `4402986`
* **Explorer Link:** [https://stellar.expert/explorer/testnet/tx/7f82b338a582f367c13bb066f17493ff5b2520e32cc35e2daf66812ddea46eda](https://stellar.expert/explorer/testnet/tx/7f82b338a582f367c13bb066f17493ff5b2520e32cc35e2daf66812ddea46eda)

---

## 🟡 Level 2 — Yellow Belt Deliverables (Soroban Foundation & Multi-Wallet)

### Objective
Set up Soroban smart contract development environment, scaffold Rust smart contract (`PadalaXRemitContract`), implement Multi-Wallet selector, and compile `.wasm` binary.

* **Contract Crate:** `contracts/padalax_remit`
* **Entry Point:** [`contracts/padalax_remit/src/lib.rs`](./contracts/padalax_remit/src/lib.rs)
* **SDK Version:** `soroban-sdk = "21.0.0"`
* **Compiled WASM Hash:** `b7ba4c0d018e17786bd784946fded417505545e2830997f5ef60351a5aa249b1`
* **Multi-Wallet Providers:** Freighter, Albedo, xBull, LOBSTR, and Rabet with explicit error handling (`WALLET_NOT_FOUND`, `TRANSACTION_REJECTED`, `INSUFFICIENT_BALANCE`).

---

## 🟠 Level 3 — Orange Belt Deliverables (Production Smart Contract & Testing)

### Advanced Smart Contract Architecture
1. **Real Token Escrow (`token::Client`):** Executes on-chain token transfers between sender, contract escrow address (`env.current_contract_address()`), and recipient upon claim/refund.
2. **Persistent State & TTL Management:** Escrows are isolated under `DataKey::Remittance(u32)` with automated `extend_ttl` bumps to prevent state archival on Testnet.
3. **Cryptographic SHA-256 HashLock Preimage:** Claimers must supply the exact plaintext secret code whose SHA-256 hash matches the escrow parameter:
   $$\text{SHA-256}(\text{claim\_preimage}) == \text{remittance.claim\_hash}$$
4. **Time-Locked Autonomous Refunds:** Senders retain 100% refund authority strictly after expiration timestamp (`current_time > expiry_timestamp`).
5. **Access Control (`require_auth`):** Enforced on senders during creation/refund and on claimers during payout.
6. **Real-Time Event Streaming:** Publishes structured event telemetry under `TOPIC_REMIT` (`created`, `claimed`, `refunded`).

### How to Run Smart Contract Unit Tests:
```bash
cargo test
```

### Verified Test Suite (6/6 Passing):
```text
running 6 tests
test test::test_refund_after_expiration_success ... ok
test test::test_create_and_claim_remittance_success ... ok
test test::test_refund_before_expiration_fails - should panic ... ok
test test::test_cannot_claim_expired_remittance - should panic ... ok
test test::test_unauthorized_sender_cannot_refund - should panic ... ok
test test::test_claim_with_wrong_preimage_panics - should panic ... ok

test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.26s
```

---

## 📱 Mobile Responsive Web3 PWA & Frontend Testing

### Features
* **Multi-Wallet Support:** Freighter, Albedo, xBull, LOBSTR, and Rabet connection on Stellar Testnet.
* **OFW Remittance Flow:** Live PHP currency calculator and traditional fee savings breakdown.
* **Dynamic QR Code Voucher Modal:** Interactive voucher generation with 1-click sharing to Viber, WhatsApp, and SMS.
* **Instant Cashout Simulation:** Direct off-ramping simulation to GCash, Maya, and local bank accounts.
* **Protocol Telemetry Stream:** Live transaction tracking and Stellar Expert Explorer links.

### How to Run Frontend Tests & Build:
```bash
cd frontend
npm install
npm test       # Runs Vitest unit tests (4/4 Pass)
npm run build  # Compiles production bundle for Vercel
```

---

## 📂 Project Directory Structure

```
padalax/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI/CD Pipeline (Rust + Vitest + Build)
├── assets/
│   └── screenshots/
│       ├── desktop_ui.png          # Desktop Web3 dApp Screenshot
│       └── mobile_ui.png           # Mobile Responsive UI Screenshot
├── contracts/
│   └── padalax_remit/
│       ├── Cargo.toml              # Soroban SDK 21.0.0 Configuration
│       └── src/
│           ├── lib.rs              # Soroban Token Escrow Contract (Levels 2 & 3)
│           └── test.rs             # 6 Automated Unit Tests with Token Balances (100% Pass)
├── frontend/                       # Web3 PWA (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/             # Header, Vouchers, Telemetry, Roadmap, WalletModal
│   │   ├── utils/                  # Stellar SDK & Cryptographic Utilities
│   │   │   └── __tests__/          # Vitest Frontend Tests (4/4 Pass)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json                 # Vercel Deployment Configuration
├── scripts/
│   ├── level1_stellar_setup.js     # Level 1 Wallet & Payment Script
│   ├── deploy_and_interact.js      # Level 3 Testnet Deployment Verifier
│   └── package.json
├── Cargo.toml                      # Root Cargo Workspace
├── package.json                    # Root Workspace Script Runner
├── project_proposal.md             # RiseIn Idea Submission Document
└── README.md                       # Master Documentation
```

---

## 🚀 RiseIn Belt Roadmap Status

* ⚪ **Level 1 (White Belt) — ✅ SUBMITTED FOR EVALUATION:** Stellar network fundamentals, Friendbot funding, account state verification, and payment memos ([Payment Tx `7f82b338...`](https://stellar.expert/explorer/testnet/tx/7f82b338a582f367c13bb066f17493ff5b2520e32cc35e2daf66812ddea46eda)).
* 🟡 **Level 2 (Yellow Belt) — ✅ SUBMITTED FOR EVALUATION:** Soroban Rust contract scaffolding, types, Multi-Wallet error handling, and WASM compilation (`b7ba4c0d...`).
* 🟠 **Level 3 (Orange Belt) — ✅ SUBMITTED FOR EVALUATION:** Real token escrow (`token::Client`), persistent state TTL, SHA-256 hashlocks, time-locked refunds, 6 unit tests (100% pass), and live Testnet deployment ([Contract `CATUXAJ7Q...`](https://stellar.expert/explorer/testnet/contract/CATUXAJ7QPHA5AQM3F3D2HXAFN2BDEZHRTXUL2742XT6LVA2JRO7S3DM)).
* 🟢 **Level 4 (Green Belt) — ⏳ UPCOMING (Next Phase):** Web3 React + Vite PWA with Freighter wallet integration on Vercel (pending Level 1–3 evaluation).
* 🔵 **Level 5 (Blue Belt) — ⏳ UPCOMING (Next Phase):** Dynamic QR vouchers, real-time PHP conversion, and live telemetry stream.
* ⚫ **Level 6 (Black Belt) — ⏳ UPCOMING (Next Phase):** Stellar Mainnet deployment and gasless fee-bump relayers.
* 🏆 **Level 7 (Master Track) — ⏳ UPCOMING (Next Phase):** Live SEP-24 fiat off-ramps connecting to GCash and Maya.
