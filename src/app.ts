import express, { Request, Response } from "express";
import crypto from "crypto";
import pgp from "pg-promise";

import { validateCpf } from "./validateCpf";
import { validateEmail } from "./validateEmail";
import { validatePassword } from "./validatePassword";

const app = express();
app.use(express.json());

const connection = pgp()("postgres://postgres:123456@db:5432/app");

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

export default app;
