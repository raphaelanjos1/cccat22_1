import { validateEmail } from "../src/validateEmail";

describe("validateEmail", () => {
  test.each([
    "john.doe@gmail.com",
    "user+tag@mail.co.uk",
    "a@b.co",
    "nome.sobrenome@dominio.com.br"
  ])("Deve aceitar um e-mail válido: %s", (email: string) => {
    const isValid = validateEmail(email);
    expect(isValid).toBe(true);
  });

  test.each([
    "",
    "   ",
    "plainaddress",
    "@sem-local.com",
    "sem-arroba.com",
    "john.doe@dominio",
    "john..doe@gmail.com",
    ".john@gmail.com",
    "john.@gmail.com",
    "john@-gmail.com",
    "john@gmail..com",
    "john@gmail.c",
    null,
    undefined
  ])("Deve rejeitar um e-mail inválido: %s", (email: any) => {
    const isValid = validateEmail(email);
    expect(isValid).toBe(false);
  });
});
