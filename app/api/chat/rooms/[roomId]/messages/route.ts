import { MESSAGES, SEND_MESSAGE } from "@/lib/proxy";

export async function GET(
    req: Request,
    ctx: { params: Promise<{ roomId: number }> }
) {
  const { roomId } = await ctx.params;
  return MESSAGES(req, roomId);
}

export async function POST(
    req: Request,
    ctx: { params: Promise<{ roomId: number }> }
) {
  const { roomId } = await ctx.params;
  return SEND_MESSAGE(req, roomId);
}