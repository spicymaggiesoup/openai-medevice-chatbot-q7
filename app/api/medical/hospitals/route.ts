import { SEARCH_HOSPITALS } from "@/lib/proxy/medical/medical";

export async function GET(req: Request) {
  return SEARCH_HOSPITALS(req);
}
