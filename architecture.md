# Stellar Merchant POS Architecture

## Overview
Stellar Merchant POS is a blockchain-based point-of-sale system that enables merchants to accept XLM payments in real-time using the Stellar Network.

---

## System Architecture

Frontend (Next.js)
   ↓
Stellar SDK
   ↓
Horizon API
   ↓
Stellar Blockchain

---

## Components

### 1. Frontend (Next.js)
- Handles UI and user interaction
- Generates payment requests
- Displays transaction status and history

### 2. Stellar SDK
- Connects frontend to Stellar network
- Helps in transaction creation and validation

### 3. Horizon API
- Fetches blockchain transaction data
- Monitors incoming payments

### 4. Blockchain (Stellar Testnet)
- Processes transactions
- Ensures transparency and immutability

---

## Payment Flow

1. Merchant enters payment amount
2. System generates payment request
3. Customer sends XLM via wallet
4. Horizon API detects transaction
5. UI updates with success confirmation

---

## Design Decisions

- Used Stellar Testnet for safe experimentation
- Real-time polling for simplicity
- No backend to keep MVP lightweight

---

## Limitations

- Uses polling instead of real-time streaming
- No persistent database
- Single merchant support

---

## Future Improvements

- Add WebSocket streaming for real-time updates
- Integrate backend (Node.js / Supabase)
- Add multi-merchant support
- Store transaction history in database