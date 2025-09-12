import { RECOMMEND_HOSPITALS_BY_DISEASE } from "@/lib/proxy";

export async function POST(req: Request) {
  return RECOMMEND_HOSPITALS_BY_DISEASE(req);
}
