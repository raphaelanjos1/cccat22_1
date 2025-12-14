import Wallet from "../interfaces/Wallet";

function isValidAsset(assetId: string): boolean {
  return assetId === "BTC" || assetId === "USD";
}

function parseQuantity(quantity: any): number | null {
  const value = Number(quantity);
  if (!Number.isFinite(value)) return null;
  return value;
}

async function WalletValidations(wallet: Wallet) {
  if (!wallet.accountId || typeof wallet.accountId !== "string") {
    throw new Error("accountId is required");
  }

  if (!isValidAsset(wallet.assetId)) {
    throw new Error("invalid asset. Use BTC or USD");
  }

  const qty = parseQuantity(wallet.quantity);
  if (qty === null || qty <= 0) {
    throw new Error("Quantity should be a number greater than zero");
  }

  return
}

export { isValidAsset, parseQuantity, WalletValidations }