import { LOGIN } from "@/lib/proxy";

export async function POST(req: Request) {
  return LOGIN(req);
}
