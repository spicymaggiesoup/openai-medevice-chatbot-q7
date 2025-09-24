import { MESSAGES, SEND_MESSAGE, DELETE_MESSAGE } from "@/lib/proxy/chat/chat";

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

export async function DELETE(
    req: Request,
    ctx: { params: Promise<{ roomId: number }> }
) {
  const { roomId } = await ctx.params;
  return DELETE_MESSAGE(req, roomId);
}