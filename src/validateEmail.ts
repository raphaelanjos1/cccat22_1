const EMAIL_MAX_LENGTH = 254;
const LOCAL_MAX_LENGTH = 64;

export function validateEmail(email: string): boolean {
  if (!email) return false;

  email = email.trim();

  // Tamanho geral
  if (email.length === 0 || email.length > EMAIL_MAX_LENGTH) return false;

  // algo@algo.algo
  const basicPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicPattern.test(email)) return false;

  const [local, domain] = email.split("@");

  // Parte local (antes do @)
  if (!local || local.length > LOCAL_MAX_LENGTH) return false;
  if (local.startsWith(".") || local.endsWith(".")) return false;
  if (local.includes("..")) return false;

  // Parte de domínio (depois do @)
  if (!domain) return false;
  if (domain.startsWith("-") || domain.endsWith("-")) return false;
  if (domain.startsWith(".") || domain.endsWith(".")) return false;
  if (domain.includes("..")) return false;

  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;

  const tld = domainParts[domainParts.length - 1];
  if (tld && tld.length < 2) return false;

  return true;
}
