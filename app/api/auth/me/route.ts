import { ME } from "@/lib/proxy/auth/auth";

export async function GET(req: Request) {
  return ME(req);
}
