import { DELETE_MESSAGE } from "@/lib/proxy/chat/chat";

export async function DELETE(
    req: Request,
    ctx: { params: Promise<{ roomId: number }> }
) {
  const { roomId } = await ctx.params;
  return DELETE_MESSAGE(req, roomId);
}