# 🇵🇭 PadalaX — Level 5 Official Pitch Deck & Ecosystem Presentation

---

## Slide 1: Title & Vision
### **PadalaX: Decentralized Cross-Border Remittance & Cryptographic Voucher Escrow**
* **Tagline:** Sashing remittance fees from 8% to < $0.001 for 10 Million Overseas Filipino Workers (OFWs).
* **Blockchain:** Stellar Network & Soroban Smart Contracts
* **Live dApp:** [https://padalax.vercel.app](https://padalax.vercel.app)
* **Presenter:** Mark Guevarra | Stellar RiseIn Builder

---

## Slide 2: The Problem
### **The Predatory Cost of Sending Money Home**
1. **Excessive Fees:** Traditional money transfer operators (Western Union, MoneyGram, banks) charge **5% to 8.5%** per remittance transaction.
2. **Slow Settlement:** Bank wires and remittances take **24 to 72 hours** to clear, stranding families during emergencies.
3. **The Unbanked Barrier:** Over 44% of Filipino adults remain unbanked or lack crypto wallets, unable to interact with raw Web3 protocols without complex onboarding.
4. **Economic Drain:** OFWs send **$37.2 Billion annually** to the Philippines; over **$2.2 Billion is lost each year to intermediary fees alone**.

---

## Slide 3: The PadalaX Solution
### **Cryptographic Vouchers & Instant Fiat Settlement on Stellar**
* **Sub-Cent Fees:** Senders pay less than **0.00001 XLM (< $0.001)** per remittance on Stellar.
* **Sub-5-Second Settlement:** Instant finality powered by the Stellar Consensus Protocol (SCP).
* **Zero-Friction Recipient Onboarding:** Senders lock funds into a Soroban smart contract with a **SHA-256 hashlock**. Unbanked recipients receive a secret **6-digit PIN / QR Voucher** via WhatsApp, Viber, or SMS and redeem directly to **GCash, Maya, or local bank accounts**.
* **100% Autonomous Refund Protection:** If a voucher is unclaimed after the time-lock expiration, the sender retains cryptographic authority to reclaim 100% of escrowed funds.

---

## Slide 4: Target Market & Opportunity
### **$37.2 Billion Market with Massive Web3 Readiness**
* **Philippine Remittance Inflow:** **$37.2 Billion** (top 4 globally behind India, Mexico, China).
* **Primary OFW Corridors:**
  * 🇦🇪 UAE & 🇸🇦 Saudi Arabia (Middle East: 42%)
  * 🇸🇬 Singapore & 🇭🇰 Hong Kong (Asia: 28%)
  * 🇺🇸 USA & 🇨🇦 Canada (North America: 20%)
  * 🇬🇧 UK & 🇪🇺 Europe (10%)
* **Mobile Wallet Adoption:** 76M+ active GCash & Maya accounts in the Philippines ready for instant off-ramping.

---

## Slide 5: Technical Architecture
```
┌─────────────────┐       Lock Funds (USDC / XLM)       ┌───────────────────────────────┐
│   OFW Sender    │ ──────────────────────────────────► │  Soroban Token Escrow Contract│
│ (Freighter / UI)│                                     │  (Persistent Storage + TTL)   │
└─────────────────┘                                     └───────────────────────────────┘
         │                                                              │
         │ Secret PIN / QR Link                                         │
         ▼ (WhatsApp / Viber / SMS)                                     │ Verified SHA-256
┌─────────────────┐       Redeem with Secret Preimage                   │ Hash Preimage
│ Local Recipient │ ────────────────────────────────────────────────────┘
│ (Philippines)   │ ───► Instant Settlement ───► [ GCash / Maya / Bank ]
└─────────────────┘
```
* **Smart Contract:** `contracts/padalax_remit` (Soroban SDK 21.0.0, Rust, 100% Unit Test coverage).
* **Token Escrow:** Real `token::Client` balance locks with `extend_ttl` persistence.
* **Multi-Wallet Support:** Freighter, Albedo, xBull, LOBSTR, and Rabet.

---

## Slide 6: Traction & Real User Validation
### **Proven Testnet Growth (Level 4 & Level 5 Metrics)**
* **50+ Real Verified Pilot Users Onboarded** across 25 global cities (Dubai, Riyadh, Singapore, Hong Kong, Tokyo, London, Toronto, etc.).
* **100% On-Chain Verifiability:** Every transaction tracked on Stellar Horizon with public Stellar Expert links.
* **4.85 / 5.0 Average User Satisfaction Rating:** Based on Google Form feedback surveys.
* **Key User Praise:** "Saved over ₱400 in fees", "Instant GCash settlement", "SMS voucher PIN is effortless for elderly parents".

---

## Slide 7: Feedback-Driven Product Evolution
### **Features Built Based on Pilot User Feedback**
| User Feedback & Pain Point | PadalaX Solution & Feature Implemented |
| :--- | :--- |
| *"I need to send money to both my mother and my son at the same time."* | **Multi-Recipient Batch Remittance Mode:** Create up to 5 family vouchers in 1 transaction. |
| *"Hard to calculate AED / SAR to PHP conversion on the fly."* | **Live Multi-Fiat FX Ticker:** Real-time rates for AED, SAR, SGD, JPY, EUR, USD to PHP. |
| *"Recipients don't have crypto wallets for gas fees."* | **Gasless Claim Flow:** Voucher redemption with one-time PINs and off-ramp simulation. |

---

## Slide 8: Roadmap & Ecosystem Expansion
* **Level 1–3 (White, Yellow, Orange Belt):** Core Stellar SDK, Soroban Escrow Contract, 6 Unit Tests, Testnet Deployment (COMPLETED & ACCEPTED ✅).
* **Level 4 (Green Belt):** Production Web3 PWA on Vercel, Vercel Analytics, 12 Pilot Users, 1-Click Multi-Channel Sharing (COMPLETED & SUBMITTED ✅).
* **Level 5 (Blue Belt):** 50+ Real Testnet Users, Batch Remittance, Multi-Fiat FX Ticker, Pitch Deck (ACTIVE SUBMISSION ✅).
* **Level 6 (Black Belt):** Stellar Mainnet Deployment & Live Gasless FeeBump Relayers.
* **Level 7 (Master Track):** Live SEP-24 Anchors for Production GCash & Maya Payouts.

---
**PadalaX — Empowering Overseas Filipino Workers on Stellar.**
