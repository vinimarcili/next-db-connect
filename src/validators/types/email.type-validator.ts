export function validateEmail(email: string): string | null {
  const emailRegex = /^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,})$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }
  return null;
}
