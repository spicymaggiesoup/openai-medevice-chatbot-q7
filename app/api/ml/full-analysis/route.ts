import { FULL_ANALYSIS } from "@/lib/proxy/ml/ml";

export async function POST(req: Request) {
  return FULL_ANALYSIS(req);
}
