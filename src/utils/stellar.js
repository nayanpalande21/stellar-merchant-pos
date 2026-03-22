import * as StellarSdk from "stellar-sdk";

export function getServer(network) {
  return new StellarSdk.Horizon.Server(
    network === "mainnet"
      ? "https://horizon.stellar.org"
      : "https://horizon-testnet.stellar.org"
  );
}

export async function accountExists(address, network) {
  const server = getServer(network);

  try {
    await server.loadAccount(address);
    return true;
  } catch (e) {
    return false;
  }
}