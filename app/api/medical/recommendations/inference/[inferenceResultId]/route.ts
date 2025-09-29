import { RECOMMEND_HOSPITALS_BY_INFERENCE } from "@/lib/proxy/medical/medical";

export async function GET(
    req: Request,
    ctx: { params: Promise<{ inferenceResultId: number }> }
) {
  const { inferenceResultId } = await ctx.params;
  return RECOMMEND_HOSPITALS_BY_INFERENCE(req, inferenceResultId);
}