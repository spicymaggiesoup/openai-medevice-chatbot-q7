import { REGISTER_MEMVER } from "@/lib/proxy";

export async function POST(req: Request) {
  return REGISTER_MEMVER(req);
}
