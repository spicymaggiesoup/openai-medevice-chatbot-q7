import { LOGIN } from "@/lib/proxy/auth/auth";

export async function POST(req: Request) {
  return LOGIN(req);
}
