import * as StellarSdk from "stellar-sdk";

const server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

export async function checkPayments(address) {
  const payments = await server
    .payments()
    .forAccount(address)
    .call();

  return payments.records;
}