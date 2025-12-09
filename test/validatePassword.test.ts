import { validatePassword } from "../src/validatePassword";

describe("validatePassword", () => {
  test.each([
    "Abcdef12",
    "Senha123",
    "QweRty99",
    "Minh4S3nh4",
    "A1b2c3d4"
  ])("Deve aceitar uma senha válida: %s", (password: string) => {
    const isValid = validatePassword(password);
    expect(isValid).toBe(true);
  });

  test.each([
    "",
    "   ",
    "abc",
    "abcdefg",
    "ABCDEFGH",
    "12345678",
    "abcd1234",
    "ABCD1234",
    "Abcdefg",
    null,
    undefined
  ])("Deve rejeitar uma senha inválida: %s", (password: any) => {
    const isValid = validatePassword(password);
    expect(isValid).toBe(false);
  });
});
