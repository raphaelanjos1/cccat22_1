import WalletDAO from "./WalletDAO";
import Wallet from "./interfaces/Wallet";
import { WalletValidations } from "./utils/WalletUtils";

export default class WalletService {
  constructor(readonly walletDAO: WalletDAO) { }

  async withdraw(wallet: Wallet) {
    await WalletValidations(wallet)
    await this.walletDAO.withdraw(wallet)
  }

  async deposit(wallet: Wallet) {
    await WalletValidations(wallet)
    await this.walletDAO.deposit(wallet)
  }

    async getQuantity(wallet: Wallet) {
    await WalletValidations(wallet)
    await this.walletDAO.getQuantity(wallet)
  }
}