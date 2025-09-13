import { SEARCH_HOSPITALS } from "@/lib/proxy";

export async function GET(req: Request) {
  return SEARCH_HOSPITALS(req);
}
