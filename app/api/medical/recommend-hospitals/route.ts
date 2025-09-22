import { RECOMMEND_HOSPITALS_BY_ID } from "@/lib/proxy/medical/medical";

export async function POST(req: Request) {
  return RECOMMEND_HOSPITALS_BY_ID(req);
}
