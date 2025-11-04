import { getTestDB } from "./(use-cases)/get-test-db.use-case";

export async function GET() {
  return getTestDB();
}