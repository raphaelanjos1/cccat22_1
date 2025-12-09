import express, { Request, Response } from "express";
import crypto from "crypto";
import pgp from "pg-promise";

import { validateCpf } from "./validateCpf";
import { validateEmail } from "./validateEmail";
import { validatePassword } from "./validatePassword";

const app = express();
app.use(express.json());

const connection = pgp()("postgres://postgres:123456@db:5432/app");

function isValidAsset(assetId: string): boolean {
  return assetId === "BTC" || assetId === "USD";
}

function parseQuantity(quantity: any): number | null {
  const value = Number(quantity);
  if (!Number.isFinite(value)) return null;
  return value;
}

app.post("/signup", async (req: Request, res: Response) => {
  const { name, email, document, password } = req.body;
  console.log("/signup", { name, email, document });

  const errors: string[] = [];

  if (!name || typeof name !== "string") {
    errors.push("Nome é obrigatório.");
  }

  if (!validateEmail(email)) {
    errors.push("E-mail inválido.");
  }

  if (!validateCpf(document)) {
    errors.push("CPF inválido.");
  }

  if (!validatePassword(password)) {
    errors.push(
      "Senha inválida. A senha deve ter no mínimo 8 caracteres contendo letras maiúsculas, minúsculas e números."
    );
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  const accountId = crypto.randomUUID();

  await connection.query(
    "insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)",
    [accountId, name, email, document, password]
  );

  return res.status(201).json({ accountId });
});

app.get("/accounts/:accountId", async (req: Request, res: Response) => {
  const { accountId } = req.params;
  console.log(`/accounts/${accountId}`);

  const [account] = await connection.query(
    "select * from ccca.account where account_id = $1",
    [accountId]
  );

  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }

  return res.json(account);
});

app.post("/deposit", async (req: Request, res: Response) => {
  const { accountId, assetId, quantity } = req.body;
  console.log("/deposit", { accountId, assetId, quantity });

  const errors: string[] = [];

  if (!accountId || typeof accountId !== "string") {
    errors.push("accountId é obrigatório.");
  }

  if (!isValidAsset(assetId)) {
    errors.push("assetId inválido. Use BTC ou USD.");
  }

  const qty = parseQuantity(quantity);
  if (qty === null || qty <= 0) {
    errors.push("quantity deve ser um número maior que zero.");
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  const [account] = await connection.query(
    "select 1 from ccca.account where account_id = $1",
    [accountId]
  );

  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }

  await connection.query(
    `
      insert into ccca.wallet (account_id, asset_id, quantity)
      values ($1, $2, $3)
      on conflict (account_id, asset_id)
      do update set quantity = ccca.wallet.quantity + excluded.quantity
    `,
    [accountId, assetId, qty]
  );

  return res.status(204).send();
});

app.post("/withdraw", async (req: Request, res: Response) => {
  const { accountId, assetId, quantity } = req.body;
  console.log("/withdraw", { accountId, assetId, quantity });

  const errors: string[] = [];

  if (!accountId || typeof accountId !== "string") {
    errors.push("accountId é obrigatório.");
  }

  if (!isValidAsset(assetId)) {
    errors.push("assetId inválido. Use BTC ou USD.");
  }

  const qty = parseQuantity(quantity);
  if (qty === null || qty <= 0) {
    errors.push("quantity deve ser um número maior que zero.");
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  const [account] = await connection.query(
    "select 1 from ccca.account where account_id = $1",
    [accountId]
  );

  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }

  const [wallet] = await connection.query(
    "select quantity from ccca.wallet where account_id = $1 and asset_id = $2",
    [accountId, assetId]
  );

  const currentQuantity = wallet ? Number(wallet.quantity) : 0;

  if (!qty) {
    return res.status(422).json({ error: "Quantidade nao informada" })
  }

  if (qty > currentQuantity) {
    return res.status(422).json({ error: "Saldo insuficiente." });
  }

  const newQuantity = currentQuantity - qty;

  await connection.query(
    `
      update ccca.wallet
      set quantity = $3
      where account_id = $1 and asset_id = $2
    `,
    [accountId, assetId, newQuantity]
  );

  return res.status(204).send();
});

export default app;
