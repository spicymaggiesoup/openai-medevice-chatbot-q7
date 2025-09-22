import { DEPARTMENTS_BY_NAME } from "@/lib/proxy/medical/medical";

export async function GET(req: Request) {
  return DEPARTMENTS_BY_NAME(req);
}