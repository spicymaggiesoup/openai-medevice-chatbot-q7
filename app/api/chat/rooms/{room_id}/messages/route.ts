import { CHAT_GET, CHAT_POST } from "@/lib/proxy";

export async function GET(req: Request) {
  return CHAT_GET(req);
}

export async function POST(req: Request) {
  return CHAT_POST(req);
}