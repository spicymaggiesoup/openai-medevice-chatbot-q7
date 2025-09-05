import { login } from "@/lib/proxy";

export async function POST(req: Request) {
  return login(req);
}
