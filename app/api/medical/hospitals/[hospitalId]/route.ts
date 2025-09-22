import { SEARCH_HOSPITAL_LOCATION } from "@/lib/proxy/medical/medical";

export async function GET(
    req: Request,
    ctx: { params: Promise<{ hospitalId: number }> }
) {
  const { hospitalId } = await ctx.params;
  return SEARCH_HOSPITAL_LOCATION(req, hospitalId);
}