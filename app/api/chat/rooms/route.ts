import { CHATROOM_LIST, CHATROOM_NEW } from "@/lib/proxy/chat/chat";

export async function GET(req: Request) {
  return CHATROOM_LIST(req);
}

export async function POST(req: Request) {
  return CHATROOM_NEW(req);
}