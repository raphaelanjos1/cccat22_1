import express, { Request, Response } from "express";
import { AccountDAODatabase } from "./AccountDAO";
import AccountService from "./AccountService";
import { WalletDAODatabase } from "./WalletDAO";
import WalletService from "./WalletService";

const app = express();
app.use(express.json());

const accountDAO = new AccountDAODatabase()
const accountService = new AccountService(accountDAO)

const WalletDAO = new WalletDAODatabase()
const walletService = new WalletService(WalletDAO)

app.post("/signup", async (req: Request, res: Response) => {
  const account = req.body;
  console.log("/signup", account);
  try {
    const output = await accountService.signup(account);
    res.json(output);
  } catch (e: any) {
    res.status(422).json({
      message: e.message
    });
  }
});

app.get("/accounts/:accountId", async (req: Request, res: Response) => {
  const accountId = req.params.accountId || ''
  console.log(`/accounts/${accountId}`);
  const output = await accountService.getAccount(accountId);
  res.json(output);
});

app.post("/deposit", async (req: Request, res: Response) => {
  const wallet = req.body;
  console.log("/deposit", { wallet });
  const output = await walletService.deposit(wallet)
  res.json(output)
  return res.status(204).send();

});

app.post("/withdraw", async (req: Request, res: Response) => {
  const wallet = req.body;
  const output = await walletService.withdraw(wallet)
  res.json(output)
  return res.status(204).send();
});

export default app;
