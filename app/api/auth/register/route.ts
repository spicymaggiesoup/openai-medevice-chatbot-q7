import { REGISTER_MEMVER } from "@/lib/proxy/auth/auth";

export async function POST(req: Request) {
  return REGISTER_MEMVER(req);
}
