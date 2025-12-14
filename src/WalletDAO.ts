import pgp from "pg-promise";
import Wallet from "./interfaces/Wallet";

export default interface WalletDAO {
  deposit(wallet: Wallet): Promise<void>;
  withdraw(wallet: Wallet): Promise<void>;
  getQuantity(wallet: Wallet): Promise<void>;
}

export class WalletDAODatabase implements WalletDAO {
  async deposit(wallet: Wallet): Promise<void> {
    const connection = pgp()("postgres://postgres:123456@db:5432/app");
    await connection.query(
      `
      insert into ccca.wallet (account_id, asset_id, quantity)
      values ($1, $2, $3)
      on conflict (account_id, asset_id)
      do update set quantity = ccca.wallet.quantity + excluded.quantity
    `,
      [wallet.accountId, wallet.assetId, wallet.quantity]
    );
    await connection.$pool.end();
  }

  async getQuantity(wallet: Wallet): Promise<void> {
    const connection = pgp()("postgres://postgres:123456@db:5432/app");
    const currentQuantity = (await connection.query(
      "select quantity from ccca.wallet where account_id = $1 and asset_id = $2",
      [wallet.accountId, wallet.assetId]) || 0
    );
    await connection.$pool.end();
    return currentQuantity
  }

  async withdraw(wallet: Wallet): Promise<void> {
    const connection = pgp()("postgres://postgres:123456@db:5432/app");
    await connection.query(
      `
      update ccca.wallet
      set quantity = $3
      where account_id = $1 and asset_id = $2
    `,
      [wallet.accountId, wallet.assetId, wallet.quantity]
    );
    await connection.$pool.end();
  }
}