import { LOCATION } from "@/lib/proxy";

export async function PUT(req: Request) {
  return LOCATION(req);
}
