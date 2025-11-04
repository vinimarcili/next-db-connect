export function validateRequired(value: unknown, field: string | { label?: string; name?: string }): string | null {
  const label = typeof field === "string" ? field : field.label || field.name || "Field";
  if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
    return `${label} is required.`;
  }
  return null;
}
