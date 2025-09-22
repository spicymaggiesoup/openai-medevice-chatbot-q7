import { LOGOUT } from "@/lib/proxy/auth/auth";

export async function POST(req: Request) {
  return LOGOUT(req);
}
