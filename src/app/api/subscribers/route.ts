import { NextRequest } from "next/server";
import { postSubscriber } from "./(use-cases)/post-subscriber.use-case";
import { getSubscribersCSV } from "./(use-cases)/get-subscribers-csv.use-case";

export async function GET(req: NextRequest) {
  return getSubscribersCSV(req);
}

export async function POST(req: NextRequest) {
  return postSubscriber(req);
}
