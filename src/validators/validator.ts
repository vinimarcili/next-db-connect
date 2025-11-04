import { ValidatorField } from "@/interfaces/validator.interface";
import { validateRequired } from "./types/required.type-validator";

export function validateFormData<T>(
  data: T,
  fields: Array<ValidatorField<T>>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = data[field.key];
    if (field.required) {
      const requiredError = validateRequired(value, field.label);
      if (requiredError) {
        errors[field.key as string] = requiredError;
        continue;
      }
    }
    if (field.validator) {
      const specificError = field.validator(value);
      if (specificError) {
        errors[field.key as string] = specificError;
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
