// src/utils/freighter.js
// ─────────────────────────────────────────────────────────────
// Freighter wallet integration for Stellar payments
// Install: npm install @stellar/freighter-api @stellar/stellar-sdk
// ─────────────────────────────────────────────────────────────

import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";

import {
  Networks,
  Horizon,
  TransactionBuilder,
  Operation,
  Asset,
  BASE_FEE,
} from "@stellar/stellar-sdk";

// Network config map
const NETWORK_CONFIG = {
  testnet: {
    passphrase: Networks.TESTNET,
    horizon: "https://horizon-testnet.stellar.org",
  },
  mainnet: {
    passphrase: Networks.PUBLIC,
    horizon: "https://horizon.stellar.org",
  },
  futurenet: {
    passphrase: Networks.FUTURENET,
    horizon: "https://horizon-futurenet.stellar.org",
  },
};

// ── Connect Wallet ────────────────────────────────────────────
export async function connectWallet() {
  // 1. Check extension exists
  const connected = await isConnected();
  if (!connected?.isConnected) {
    throw new Error(
      "Freighter wallet not found. Install it from freighter.app"
    );
  }

  // 2. Request access (shows popup if not already allowed)
  const accessResult = await requestAccess();
  if (accessResult?.error) {
    throw new Error("Wallet access denied: " + accessResult.error);
  }

  // 3. Get the public key
  const addressResult = await getAddress();
  if (addressResult?.error) {
    throw new Error("Could not get address: " + addressResult.error);
  }

  const address = addressResult?.address;
  if (!address) throw new Error("No wallet address returned from Freighter");

  return address;
}

// ── Send Payment ──────────────────────────────────────────────
export async function sendPayment({ source, destination, amount, network }) {
  const config = NETWORK_CONFIG[network] || NETWORK_CONFIG.testnet;
  const { passphrase, horizon } = config;

  // 1. Load source account from Horizon
  const server = new Horizon.Server(horizon);

  let account;
  try {
    account = await server.loadAccount(source);
  } catch (err) {
    throw new Error(
      `Source account not found on ${network}. ` +
        `Fund it at: https://friendbot.stellar.org/?addr=${source}`
    );
  }

  // 2. Check destination exists
  try {
    await server.loadAccount(destination);
  } catch (err) {
    throw new Error(
      `Destination account not found on ${network}. ` +
        `Fund it at: https://friendbot.stellar.org/?addr=${destination}`
    );
  }

  // 3. Build transaction
  // Amount must be a string with max 7 decimal places
  const amountStr = parseFloat(amount).toFixed(7);

 const tx = new TransactionBuilder(account, {
  fee: BASE_FEE,
  networkPassphrase: passphrase,
})
  .addOperation(
    Operation.payment({
      destination,
      asset: Asset.native(),
      amount: amountStr,
    })
  )
  .setTimeout(0) // 🔥 FINAL FIX
  .build();

  // 4. Sign with Freighter
  let signResult;
  try {
    signResult = await signTransaction(tx.toXDR(), {
      networkPassphrase: passphrase,
     network:
  network === "mainnet"
    ? "PUBLIC"
    : network === "futurenet"
    ? "FUTURENET"
    : "TESTNET",
    });
  } catch (err) {
    throw new Error("User rejected transaction or signing failed: " + err.message);
  }

  if (signResult?.error) {
    throw new Error("Signing error: " + signResult.error);
  }

  // Handle both old and new Freighter API response shapes
  const signedXdr =
    typeof signResult === "string"
      ? signResult
      : signResult?.signedTxXdr || signResult?.xdr;

  if (!signedXdr) {
    throw new Error("No signed transaction returned from Freighter");
  }

  // 5. Submit to Horizon
  const signedTx = TransactionBuilder.fromXDR(signedXdr, passphrase);

  let result;
  try {
    result = await server.submitTransaction(signedTx);
  } catch (err) {
    // Horizon returns detailed errors in err.response.data.extras
    const extras = err?.response?.data?.extras?.result_codes;
    if (extras) {
      const codes = JSON.stringify(extras);
      if (codes.includes("op_no_destination"))
        throw new Error("Destination account does not exist on " + network);
      if (codes.includes("op_underfunded"))
        throw new Error("Insufficient balance in your wallet");
      if (codes.includes("op_low_reserve"))
        throw new Error("Account below minimum reserve");
      throw new Error("Transaction failed: " + codes);
    }
    throw new Error("Submission failed: " + err.message);
  }

  return result; // result.hash = transaction hash
}