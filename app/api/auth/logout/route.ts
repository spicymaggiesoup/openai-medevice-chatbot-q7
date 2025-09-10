import { LOGOUT } from "@/lib/proxy";

export async function POST(req: Request) {
  return LOGOUT(req);
}
