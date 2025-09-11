import { FULL_ANALYSIS } from "@/lib/proxy";

export async function POST(req: Request) {
  return FULL_ANALYSIS(req);
}
