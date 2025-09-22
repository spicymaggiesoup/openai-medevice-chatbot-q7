import { MODIFY_LOCATION } from "@/lib/proxy/users/users";

export async function PUT(req: Request) {
  return MODIFY_LOCATION(req);
}
