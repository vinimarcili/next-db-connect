import { Gender } from "@/interfaces/gender";

export function validateGender(gender: Gender | null): string | null {
  if (gender === null || !["male", "female", "other"].includes(gender)) {
    return "Gender must be one of: male, female, other.";
  }
  return null;
}
