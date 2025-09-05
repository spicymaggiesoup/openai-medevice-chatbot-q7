"use client"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { useChatToken } from "@/lib/store";
import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  const token = useChatToken((s) => s.chatToken);
  //console.log(token);

  if (!token) {
    redirect("/");
  }

  //chat rooms 확인 및 create
  

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ChatInterface />
    </div>
  )
}
