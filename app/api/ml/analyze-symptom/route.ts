import { ANALYZE_SYMPTOM } from "@/lib/proxy";

export async function POST(req: Request) {
  return ANALYZE_SYMPTOM(req);
}
