export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { ChatHistoryInterface } from "@/components/chat-history-interface"

export default async function ChatHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ChatHistoryInterface />
    </div>
  )
}
