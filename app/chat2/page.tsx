export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { ChatInterface2 } from "@/components/chat-interface-2"

export default async function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ChatInterface2 />
    </div>
  )
}
