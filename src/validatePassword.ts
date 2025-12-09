export function validatePassword(password: string): boolean {
  if (!password) return false;

  if (password.length < 8) return false;

  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);

  return hasLowercase && hasUppercase && hasDigit;
}