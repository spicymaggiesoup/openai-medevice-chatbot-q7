import { CHAT } from "@/lib/proxy";

export async function GET(req: Request) {
  return CHAT(req);
}