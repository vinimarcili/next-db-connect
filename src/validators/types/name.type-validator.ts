export function validateName(name: string): string | null {
  if (!/^[\w\sÀ-ÿ'-]+$/.test(name)) {
    return "Name contains invalid characters.";
  }
  return null;
}
