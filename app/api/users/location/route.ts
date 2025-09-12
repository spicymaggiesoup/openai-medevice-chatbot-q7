import { MODIFY_LOCATION } from "@/lib/proxy";

export async function PUT(req: Request) {
  return MODIFY_LOCATION(req);
}
