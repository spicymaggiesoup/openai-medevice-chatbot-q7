"use client"

import type React from "react"
import { Fragment, useState, useEffect, useRef, useCallback } from "react"

import { useChatToken } from "@/lib/store";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" 
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IconTrash2 } from "@/components/icon/icon-trash"
import { MediBot } from "@/components/img/medi-bot"

import { ChatRoomInterface } from "@/components/chat-room-interface"
import { chatInterfaceTemplate } from "@/lib/template"
import { Send } from "lucide-react"

const INTERFACE_TEMPLATE: any /*{
  welcome: WelcomTemlate = () => { id: string; content: string[]; message_type: string; timestamp: Date; type: string; }[];
  evaluating: EvaluatingTemplate = () => { id: string; content: string[]; message_type: string; timestamp: Date; type: string; nextConnect: boolean;}[];
  score_high: ScoreHighTemplate = () => { id: string; content: string[]; senmessage_typeder: string; timestamp: Date; type: string; }[];
  score_low: ScoreLowTemplate = () => { id: string; content: string[]; message_type: string; timestamp: Date; type: string; }[];
  recommend: RecommendTemplate = () => { id: string; content: string[]; message_type: string; timestamp: Date; type: string; buttons: 
  hospitals: HospitalsTemplate = () => { id: string; content: string[]; message_type: string; timestamp: Date; type: string; location: string[]; }[];
  adios: AdiosTemplate = () => { id: string; content: string[]; message_type: string; timestamp: Date; type: string; }[];
}*/ = chatInterfaceTemplate;

export function ChatInterface() {
  // 토큰
  const token = useChatToken((s) => s.chatToken);

  const inputRef = useRef<HTMLInputElement>(null);

  const [welcomeMessage] = useState<any[]>([
    Object.assign(
      ((_welcomes) => _welcomes[Math.floor(Math.random() * (_welcomes.length))])(INTERFACE_TEMPLATE.welcome()),
      { timestamp: new Date() },
    ),
  ]);

  const [messages, setMessages] = useState<any[]>(welcomeMessage);

  const [messageStep, setMessageStep] = useState(0);

  const [chatHistory, setChatHistory] = useState([]);

  const [hasStartedConversation, setHasStartedConversation] = useState(false);

  const [openDeleteId, setOpenDeleteId] = useState<string | number | null>(null);
  const [targetChat, setTargetChat] = useState<any | null>(null);

  const [isTyping, setIsTyping] = useState(false);
  const [roomId, setRoomId] = useState(0);

  const getPastUserChatRooms = async() => {
    const getUserChatRooms = await fetch("/api/chat/rooms", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const uesrChatRooms = await getUserChatRooms.json();

    setChatHistory(uesrChatRooms);

    console.log('[chat-interface] Load init chat rooms : ', uesrChatRooms);

    return uesrChatRooms;
  }

  const deleteChatRoom = async() => {
    try {
      const deleteUserSelectedChatRoom = await fetch(`/api/chat/rooms/${openDeleteId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const deleteChatRoom = await deleteUserSelectedChatRoom.json();

      console.log("[chat-interface] deleteChatRoom : ", deleteChatRoom);

      // 성공적
      if (deleteChatRoom.message) {
        const chatRooms = await getPastUserChatRooms();

        console.log('[chat-interface] Reload chat rooms : ', chatRooms);
      }

    } catch(e) {
      console.error(e);
    }
  };

  const createNewChatRoom = async(title: string) => {
    try {
      const postNewChatRoom = await fetch(`/api/chat/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      if (!postNewChatRoom.ok) {
        const text = await postNewChatRoom.text();
        console.error("[chat-interface] create room failed:", postNewChatRoom.status, text);
        throw new Error(text || `HTTP ${postNewChatRoom.status}`);
      }

      const newChatRoom = await postNewChatRoom.json();

      console.log("[chat-interface] createNewChatRoom : ", newChatRoom);

      return newChatRoom;

    } catch(e) {
      console.error(e);
    }
  };

  const sendChatText = async(id: number, content: any) => {
    if (id) {
      try {
        // 메시지 전송
        const sendChatMessage = await fetch(`/api/chat/rooms/${id}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        });

        const chatRooms = await sendChatMessage.json();

        const { bot_response, message} = chatRooms;

        console.log("[chat-interface] Send message :bot_message: ", bot_response);
        console.log("[chat-interface] Send message :user_message: ", message);

        return bot_response;
      } catch(e) {
        console.error(e);
      }
    }
  }

  // chatbox 메시지 전송
  const handleSendMessage = async () => {
    const messageContent = inputRef.current?.value ?? "";
    if (!messageContent.trim()) return;

    console.log('[chart-interface] handleSendMessage :messageContent: ', messageContent);

    const {id} = await createNewChatRoom(messageContent);
    setRoomId(id);

    console.log("[chat-interface] handleSendMessage :message_type: ", `USER_${messageStep}`);
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: [messageContent],
      message_type: `USER`,
    }]);

    const { content } = await sendChatText(id, `${messageStep}_USER_${messageContent}`);

    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: [content],
      message_type: `BOT`,
    }]);
    console.log("[chat-interface] handleSendMessage :message_type: ", `USER_${messageStep}`);

    const nextStep = messageStep + 1;
    setMessageStep(nextStep);
    setIsTyping(true);
    setHasStartedConversation(true);

    // 입력창 비우기
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDeleteChatRoom = async(_chat: any) => {
    setTargetChat(_chat);
    setOpenDeleteId(_chat.id);
  };

  const handleShowPastChat = async(_chat: any) => {
    const getPastChatMessages = await fetch(`/api/chat/rooms/${_chat.id}/messages`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const pastChatMessages = await getPastChatMessages.json();

    console.log('[chart-interface] Get past chatroom messages :: ', pastChatMessages);

    setMessages((prev) => [...prev, pastChatMessages]);

    /*
    전달해야하는 속성
      id={roomId}
      step={messageStep}
      message={messages}
      showTyping={isTyping}
      status={setHasStartedConversation}
      onSendChatText={sendChatText}
    */
    setRoomId(_chat.id);

    setHasStartedConversation(true);
  };

  // 과거 문의목록 조회
  useEffect(() => {
    getPastUserChatRooms();

    setMessages(welcomeMessage);
    setMessageStep(0);
    setIsTyping(false);
    setRoomId(0);
  }, []);

  return (
    <Fragment>
    {!hasStartedConversation
      ? (<div className="h-dvh min-h-screen bg-emerald-50 dark:bg-gray-900 text-gray-900 dark:text-white">
          {/* Main Content */}
          <div className="max-w-4xl mx-auto pt-8 pr-6 pb-8 pl-6">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-3 flex-col">
                {welcomeMessage.map((message) => (
                  <div
                    key={message.id}
                    className={`text-l w-full`}>
                    {message.content.map((_message: string, order: any) => (
                      <p className="leading-relaxed" key={`${order}_${new Date().getMilliseconds()}`}>{_message}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* New Chat Button */}
            <div
              className="w-full pt-2 pb-8 transition-colors flex items-center text-left"
              >
              <div
                // onSubmit={handleSendMessage}
                className="flex gap-3 w-full"
                >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <MediBot />
                </div>
                <div className="w-full">
                  <Input
                    ref={inputRef}
                    name="message-input" 
                    placeholder="MeDeviSe에게 문의하세요."
                    className="flex-1 border-gray-200 focus:border-teal-400 focus:ring-emerald-400 rounded-xl bg-white bg-opacity-50"
                  />
                </div>
                <Button
                  // type="submit"
                  onClick={handleSendMessage}
                  className="cursor-pointer bg-teal-500 hover:bg-emerald-600 text-white rounded-xl px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="ml-auto flex items-center space-x-2">
              </div>
            </div>

            {/* Chat History */}
            <div className="chat-history space-y-3 overflow-auto max-h-[61vh] supports-[height:100dvh]:max-h-[61dvh]">
              {chatHistory.map((chat: any) => (
                // <Link key={chat.id} href="/chat">
                  <div
                    key={chat.id}
                    className="p-4 border-gray-200 border bg-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                    >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3
                          onClick={() => {
                            handleShowPastChat(chat);
                          }}
                          className="w-fit cursor-pointer font-medium text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-500"
                        >
                          {chat.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{((_toDate) => 
                          `${_toDate.getFullYear()}/${_toDate.getMonth()}/${_toDate.getDate()}`
                        )(new Date(chat.created_at))}</p>
                      </div>
                      <Popover
                        open={openDeleteId === chat.id}
                        onOpenChange={(open) => {
                          // 이 행의 Popover가 열릴/닫힐 때만 상태 변경
                          if (open) {
                            setTargetChat(chat);
                            setOpenDeleteId(chat.id);
                          } else if (openDeleteId === chat.id) {
                            setOpenDeleteId(null);
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChatRoom(chat);
                            }}
                            className="cursor-pointer text-xs text-gray-500 ml-4 flex-shrink-0"
                            aria-haspopup="dialog"
                            aria-expanded={openDeleteId === chat.id}
                          >
                            <IconTrash2 />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent
                          className="w-auto p-4 space-y-3"
                          align="center"
                          side="left"
                          sideOffset={12}
                          onOpenAutoFocus={(e) => e.preventDefault()}
                          onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                          <div className="text-sm flex justify-center">정말 삭제하시겠습니까?</div>
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              className="cursor-pointer px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                              onClick={async () => {
                                if (!targetChat) return;

                                await deleteChatRoom();
                                
                                setOpenDeleteId(null);
                              }}
                            >
                              삭제
                            </button>
                            <button
                              type="button"
                              className="cursor-pointer px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50"
                              onClick={() => setOpenDeleteId(null)}
                            >
                              취소
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                // </Link>
              ))}
            </div>
          </div>
        </div>)
      : (<ChatRoomInterface
          key={roomId}  // roomId가 바뀔 때만 remount
          id={roomId}
          step={messageStep}
          message={messages}
          showTyping={isTyping}
          // status={setHasStartedConversation}
          // onSendChatText={sendChatText}
        />)
    }
    </Fragment>
  )
}
