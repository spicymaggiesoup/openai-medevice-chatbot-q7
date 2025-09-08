import { ME } from "@/lib/proxy";

export async function GET(req: Request) {
  return ME(req);
}
