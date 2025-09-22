import { ANALYZE_SYMPTOM } from "@/lib/proxy/ml/ml";

export async function POST(req: Request) {
  return ANALYZE_SYMPTOM(req);
}
