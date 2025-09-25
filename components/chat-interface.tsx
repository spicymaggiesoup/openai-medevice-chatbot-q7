"use client"

import type React from "react"
import { Fragment, useState, useEffect, useRef, useCallback } from "react"

import Link from "next/link"

import { redirect, useRouter } from "next/navigation";

// import Hanspell  from "hanspell";

import { useChatToken, useUserInfo, useMedicalDepartments, useChatRoom } from "@/lib/store";


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" 
import { Confirm } from "@/components/ui/confirm" 
import { IconBackward } from "@/components/icon/icon-backward"
import { IconTrash2 } from "@/components/icon/icon-trash"
import { MediBot } from "@/components/img/medi-bot"

import { MapLayout } from "@/components/map-layout"
import { chatInterfaceTemplate } from "@/lib/template"
import { Send, LogOut, Home, Activity, Clock, Plus, Navigation, Phone } from "lucide-react"

type WelcomTemlate = () => { id: string; content: string[]; sender: string; timestamp: Date; type: string; }[];
type EvaluatingTemplate = () => { id: string; content: string[]; sender: string; timestamp: Date; type: string; nextConnect: boolean;}[];
type ScoreHighTemplate = () => { id: string; content: string[]; sender: string; timestamp: Date; type: string; }[];
type ScoreLowTemplate = () => { id: string; content: string[]; sender: string; timestamp: Date; type: string; }[];
type RecommendTemplate = () => { id: string; content: string[]; sender: string; timestamp: Date; type: string; buttons: string[]; buttonsCallback: any[]; }[];
type HospitalsTemplate = () => { id: string; content: string[]; sender: string; timestamp: Date; type: string; location: string[]; }[];
type AdiosTemplate = () => { id: string; content: string[]; sender: string; timestamp: Date; type: string; }[];

const INTERFACE_TEMPLATE: any /*{
  welcome: WelcomTemlate;
  evaluating: EvaluatingTemplate;
  score_high: ScoreHighTemplate;
  score_low: ScoreLowTemplate;
  recommend: RecommendTemplate;
  hospitals: HospitalsTemplate;
  adios: AdiosTemplate;
}*/ = chatInterfaceTemplate;

const MESSAGE_SCENARIO = ["welcome", "evaluating" , ["score_high", "score_low"], "recommend", "searching", "hospitals", "adios"];

export function ChatInterface() {
  // 토큰
  const token = useChatToken((s) => s.chatToken);

  // messages on template 가져오기
  const getMessage = (_step: any, symptom?: string, list?:string[]) => 
    ((_templates) => _templates[Math.floor(Math.random() * (_templates.length))])(INTERFACE_TEMPLATE[_step](symptom, list));

  const [welcomeMessage] = useState<any[]>([
    Object.assign(
      ((_welcomes) => _welcomes[Math.floor(Math.random() * (_welcomes.length))])(INTERFACE_TEMPLATE.welcome()),
      { timestamp: new Date() },
    ),
  ]);
  const [messages, setMessages] = useState<any[]>(welcomeMessage);

  const [chatHistory, setChatHistory] = useState([]);

  const [inputMessage, setInputMessage] = useState("");

  const [isChatMainPage, setIsChatMainPage] = useState(true);

  const [hasStartedConversation, setHasStartedConversation] = useState(false);

  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [targetChat, setTargetChat] = useState<any | null>(null);

  const [isTyping, setIsTyping] = useState(false);
  const [activeTyping, setActiveTyping] = useState(false);
  const [diseaseName, setDiseaseName] = useState("");
  const [roomId, setRoomId] = useState(177);

    // 위치기반 병원추천
  const recommendHospitals = async() => {
    try {
      // 메시지 전송
      const recommendHospitalsByDisease = await fetch(`/api/medical/recommend-by-disease`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          "max_distance": 100,
          "limit": 10,
          "disease_name": diseaseName,
          "chat_room_id": roomId,
        }),
      });

      const recommendResult = await recommendHospitalsByDisease.json();

      console.log("[chat-interface] recommendHospitals : ", recommendResult);

      // 진료과로 병원검색
      // const searchHospitalsByDiseaseId = await fetch(`/api/medical/hospitals`, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     "disease_id": disease_id,
      //   }),
      // });

      // const searchedResult = await searchHospitalsByDiseaseId.json();

      // console.log("[chat-interface] recommendHospitals : ", searchedResult);

      //return user_message.content;

      return recommendResult.recommendations;

    } catch(e) {
      console.error(e);
    }
  };

  // chatbox 메시지 전송
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    // 입력여부 확인
    if (!inputMessage.trim()) return;

    console.log('[chart-interface] inputMessage :: ', inputMessage);



    // const userMessage: any = {
    //   id: Date.now().toString(),
    //   timestamp: new Date(),
    //   content: [],
    //   sender: "user",
    // };

    // // 증상설명...
    // if (MESSAGE_SCENARIO[messageStep] === "evaluating") {
    //   const _inputMessage = await sendUserMessage(inputMessage);

    //   setUserMessageContent(_inputMessage);

    //   Object.assign(userMessage, {
    //     content: [_inputMessage]
    //   });

    //   console.log('[chart-interface] USER STEP1  :: ', _inputMessage);

    //   //메시지 보임 & input창 초기화 & 타이핑 효과 & input창 활성화
    //   setUserStep(userStep + 1);
    //   setMessageStep(messageStep + 1);
    //   setMessages((prev) => [...prev, userMessage]);
    //   setInputMessage("");
    //   setIsTyping(false);
    //   setActiveTyping(false);

    //   // Simulate bot response
    //   // setTimeout(() => {
    //   // 챗룸 연결
      

    //   showBotMessage(_inputMessage);
    //   // }, 1500);
    //}

    // 오타율 검사(말이되는 말(한글)인지)
    //incorrectSpellCheck(inputMessage);

    setHasStartedConversation(true);
  };

  const handleDeleteChatRoom = async(_chat: any) => {
    console.log(_chat);

    setTargetChat(_chat);
    setShowDeleteMessage(true);
    /*
    const deleteUserSelectedChatRoom = await fetch(`/api/chat/rooms/${_chat.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const deleteChatRoom = await deleteUserSelectedChatRoom.json();
    */
    
  };

    // chatbox 메시지 전송 - chatbox 버튼 클릭
  const handleButtonClick = async(_message: string) => {
    // setHasStartedConversation(true);
    // 사용자 답변 (클릭한 버튼 내용)
    // setMessages((prev) => [...prev, {
    //   id: Date.now().toString(),
    //   content: [_message],
    //   sender: "user",
    //   timestamp: new Date(),
    // }]);
    // setInputMessage("")
    // setIsTyping(true)
    // setActiveTyping(true)

    // const botMessage: any = {
    //   id: Date.now().toString(),
    //   timestamp: new Date(),
    //   content: [],
    //   sender: "bot",
    // };

    // //
    // if (_message.includes('네')) {
    //   const recommendedHospitals = await recommendHospitals();

    //   console.log('[chat-interface] 네 버튼으로 추천받은 병원리스트: ', recommendedHospitals);

    //   setActiveTyping(false);
    //   setInputMessage("");
    //   setIsTyping(false);
      
    //   Object.assign(botMessage, getMessage("hospitals", diseaseName, recommendedHospitals));
    
    // // 종료
    // } else if (_message.includes('아니요')) {
    //   setActiveTyping(false);
      
    //   Object.assign(botMessage, Object.assign({
    //     id: Date.now().toString(),
    //     timestamp: new Date(),
    //   }, getMessage("adios")));

    //   setIsTyping(false);
    //   setActiveTyping(false);

    // // 다른걸 입력했다 ?
    // } else {
    //   Object.assign(botMessage, {
    //     content: ['버튼을 선택해주세요! 🙌']
    //   });
    // }

    // setMessages((prev) => [...prev, botMessage]);
  };

  useEffect(() => {
    (async() => {
      const getUserChatRooms = await fetch("/api/chat/rooms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const uesrChatRooms = await getUserChatRooms.json();

      setChatHistory(uesrChatRooms);

      console.log(uesrChatRooms);
    })();
    
  }, []);

  return (
    <Fragment>
    {!hasStartedConversation
      ? (
        <div className="h-dvh min-h-screen bg-emerald-50 dark:bg-gray-900 text-gray-900 dark:text-white">
          {/* Main Content */}
          <div className="max-w-4xl mx-auto pt-10 pr-6 pb-6 pl-6">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-3 flex-col">
                {/*<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 text-white-600">
                    <MediBot />
                  </div>
                </div>*/}
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
              className="w-full mb-6 pt-4 pl-2 pr-2 pb-4 transition-colors flex items-center space-x-3 text-left"
              >
              <div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <MediBot />
                </div>
              </div>
              <form
                onSubmit={handleSendMessage}
                className="flex gap-3 w-full"
                >
                <div className="w-full">
                  <Input
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="MeDeviSe에게 문의하세요."
                    className="flex-1 border-gray-200 focus:border-teal-400 focus:ring-emerald-400 rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  //disabled={!inputMessage.trim() || isTyping}
                  className="cursor-pointer bg-teal-500 hover:bg-emerald-600 text-white rounded-xl px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <div className="ml-auto flex items-center space-x-2">
              </div>
            </div>

            {/* Chat History
            <div className="chat-history space-y-3 overflow-auto max-h-[61vh]"> */}
            <div className="chat-history space-y-3 overflow-auto max-h-[61vh] supports-[height:100dvh]:max-h-[61dvh]">
              {chatHistory.map((chat: any) => (
                // <Link key={chat.id} href="/chat">
                  <div
                    key={chat.id}
                    className="p-4 border-gray-200 border bg-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-500">
                          {chat.title} 문의내역 보기
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{((_toDate) => 
                          `${_toDate.getFullYear()}/${_toDate.getMonth()}/${_toDate.getDate()}`
                        )(new Date(chat.created_at))}</p>
                      </div>
                      <span
                        onClick={() => handleDeleteChatRoom(chat)}
                        className="cursor-pointer text-xs text-gray-500 ml-4 flex-shrink-0">
                          <IconTrash2 />
                      </span>
                    </div>
                  </div>
                // </Link>
              ))}
            </div>
            <Confirm
              isOpen={showDeleteMessage}
              onOpenChange={setShowDeleteMessage}
              onConfirm={async () => {
                if (!targetChat) return;
                // 삭제 API 호출 예시
                // await fetch(`/api/chat/rooms/${targetChat.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` }});
                // 성공 후 목록 갱신 등
              }}
              title="채팅 삭제"
              message="정말 삭제하시겠습니까?"
              cancelLabel="취소"
              confirmLabel="삭제"
            />
          </div>
        </div>)
      : (
        <div
          className="chat-interface flex flex-col flex-1 min-h-0 bg-emerald-50 overflow-hidden"
          >
          {/* 스크롤 영역 */}
          <div
            // ref={chatRef}
            className="flex-1 min-h-0 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-md ${message.sender === "user" ? "" : "w-full max-w-2xl"}`}>
                    {message.sender === "bot" && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 text-white-600">
                            <MediBot />
                          </div>
                        </div>
                      </div>
                    )}
    
                    <div className={`p-4 rounded-2xl ${message.sender === "user" ? "bg-teal-600 text-white ml-auto" : "bg-white text-gray-800 shadow-sm"}`}>
                      {message.content.map((_message: string, order: any) => (
                        <p className="leading-relaxed" key={`${order}_${new Date().getMilliseconds()}`}>{_message}</p>
                      ))}
    
                      {message.type === "button-check" && message.buttons && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {message.buttons.map((_button: any) => (
                            <Button
                              key={_button}
                              variant="outline"
                              size="sm"
                              onClick={() => handleButtonClick(_button)}
                              className="cursor-pointer not-first:bg-gray-50 border-gray-200 text-gray-700 hover:bg-teal-500 hover:text-white"
                            >
                              {_button}
                            </Button>
                          ))}
                        </div>
                      )}
    
                      {message.type === "mapList" && (
                        <div className="flex flex-wrap gap-2 mt-4 ">
                          {message.location.map((_locationItem: any) => (
                            <div
                              key={_locationItem.id ?? `${_locationItem.name}-${_locationItem.phone ?? ''}`}
                              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${'bg-blue-50 border-blue-200'}`}
                            >
                              {/* ... mapList item ... */}
                            </div>
                          ))}
                        </div>
                      )}
    
                      {message.type === "map" && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          <MapLayout hospitalName={message.hospitalName} latitude={message.latitude} longitude={message.longitude} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
    
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 text-blue-600">
                        <MediBot />
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full animate-bounce bg-blue-300" />
                        <div className="w-2 h-2 rounded-full animate-bounce bg-red-300" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 rounded-full animate-bounce bg-green-300" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
    
          {/* 입력 영역 (Footer) */}
          <div className="shrink-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="MeDeviSe에게 문의하세요."
                  className="flex-1 border-gray-200 focus:border-teal-400 focus:ring-emerald-400 rounded-xl"
                  disabled={activeTyping}
                />
                <Button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-teal-500 hover:bg-emerald-600 text-white rounded-xl px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>)
    }
    </Fragment>
  )
}
