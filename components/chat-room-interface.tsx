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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IconBackward } from "@/components/icon/icon-backward"
import { IconHome } from "@/components/icon/icon-home"
import { IconTrash2 } from "@/components/icon/icon-trash"
import { MediBot } from "@/components/img/medi-bot"

import { MapLayout } from "@/components/map-layout"
import { chatInterfaceTemplate } from "@/lib/template"
import { Send, LogOut, Home, Activity, Clock, Plus, Navigation, Phone } from "lucide-react"

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

export function ChatRoomInterface({ id, step, message, showTyping, onSendChatText}: any) {
  // 토큰
  const token = useChatToken((s) => s.chatToken);

  const [messages, setMessages] = useState<any[]>([]);

  const [messageStep, setMessageStep] = useState(step);

  const [inputMessage, setInputMessage] = useState("");

  const [isChatMainPage, setIsChatMainPage] = useState(true);

  const [targetChat, setTargetChat] = useState<any | null>(null);

  const [goToChatMain, setGoToChatMain] = useState(false);

  const [isTypingEffect, setIsTypingEffect] = useState(showTyping);
  const [userInputDisabled, setUserInputDisabled] = useState(false);
  const [diseaseName, setDiseaseName] = useState("");
  const [roomId, setRoomId] = useState(id);

  const router = useRouter();

  // messages on template 가져오기
  const getMessage = (_step: any, symptom?: string, list?:string[]) => 
    ((_templates) => _templates[Math.floor(Math.random() * (_templates.length))])(INTERFACE_TEMPLATE[_step](symptom, list));


  const sendChatText = async(content: any) => onSendChatText(roomId, content);

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

  const createNewChatRoom = async() => {

  };

  // chatbox 메시지 전송
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const messageContent = formData.get("send-message-input") as string;

    // 입력여부 확인
    if (!messageContent || !messageContent.trim()) return;

    console.log('[chart-interface] inputMessage :: ', messageContent);

    const nextStep = messageStep + 1;
    setMessageStep(nextStep);

    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: [messageContent],
      message_type: "USER",
    }]);

    setIsTypingEffect(true);

    const { content } = await sendChatText(messageContent);

    console.log('[chat-room-interface] content :: ', content);

    // setTimeout(() => {
    //   const nextStep = messageStep + 1;
    //   setMessageStep(nextStep);

    //   const userMessage: any = {
    //     id: Date.now().toString(),
    //     timestamp: new Date(),
    //     content: [message],
    //     sender: "USER",
    //   };

    //   setHasStartedConversation(true);

    //   setMessages((prev) => [...prev, {
    //     id: Date.now().toString(),
    //     timestamp: new Date(),
    //     content: [message],
    //     sender: "USER",
    //   }]);

    //   setIsTyping(true);

    //   setTimeout(() => {
    //     setIsTyping(false);

    //     const _messages = getMessage(MESSAGE_SCENARIO[nextStep]);

    //     console.log(_messages);

    //     setMessages((prev) => [...prev, _messages]);
    //   }, 1000);

    // }, 1000);

    // const userMessage: any = {
    //   id: Date.now().toString(),
    //   timestamp: new Date(),
    //   content: [],
    //   sender: "USER",
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
  };

  // chatbox 메시지 전송 - chatbox 버튼 클릭
  const handleButtonClick = async(_message: string) => {
    // setHasStartedConversation(true);
    // 사용자 답변 (클릭한 버튼 내용)
    // setMessages((prev) => [...prev, {
    //   id: Date.now().toString(),
    //   content: [_message],
    //   sender: "USER",
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

  const flattenMessages = (input: any[]): any[] => {
    const resultMessages: any[] = [];

    function flattern(item: any) {
      if (Array.isArray(item)) {
        item.forEach(flattern);
      } else if (item && typeof item === "object") {
        resultMessages.push(item);
      }
    }

    flattern(input);
    return resultMessages;
  };

  useEffect(() => {
    console.log('[chat-room-interface] Message step: ', step);
    console.log('[chat-room-interface] Message message: ', message);
    console.log('[chat-room-interface] Message showTyping: ', showTyping);

    const _messages = flattenMessages(message);

    // 메시지 셋
    setMessages(_messages);

    // 타이핑 효과 숨김
    setIsTypingEffect(false);
    setUserInputDisabled(true);
  }, []);

  return (
    <div className="chat-interface flex flex-col flex-1 min-h-0 bg-emerald-50 overflow-hidden">
      <Popover
        open={goToChatMain}
      >
        <PopoverTrigger asChild>
          <div
            onClick={() => setGoToChatMain(true)}
            className="cursor-pointer p-2 position-fixed right text-teal"
            >
            <IconHome />
          </div>
        </PopoverTrigger>
         <PopoverContent
          className="w-auto p-4 space-y-3"
          align="center"
          side="right"
          sideOffset={0}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="text-sm flex justify-center">채팅방을 나가시겠습니까?</div>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              className="cursor-pointer px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              onClick={async () => {
                //setGoToChatMain(true);
                router.replace('/chat');
              }}
            >
              나가기
            </button>
            <button
              type="button"
              className="cursor-pointer px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50"
              onClick={() => setGoToChatMain(false)}
            >
              취소
            </button>
          </div>
        </PopoverContent>
      </Popover>
      {/* 스크롤 영역 */}
      <div
        // ref={chatRef}
        className="flex-1 min-h-0 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.message_type === "USER" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-md ${message.message_type === "USER" ? "" : "w-full max-w-2xl"}`}>
                {message.message_type === "BOT" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 text-white-600">
                        <MediBot />
                      </div>
                    </div>
                  </div>
                )}

                <div className={`p-4 rounded-2xl ${message.message_type === "USER" ? "bg-teal-600 text-white ml-auto" : "bg-white text-gray-800 shadow-sm"}`}>
                  {((message.content) instanceof Array ? message.content : [message.content]).map((_message: string, order: any) => (
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

          {isTypingEffect && (
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
              name="send-message-input"
              placeholder="MeDeviSe에게 문의하세요."
              className="flex-1 border-gray-200 focus:border-teal-400 focus:ring-emerald-400 rounded-xl"
              disabled={userInputDisabled}
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isTypingEffect}
              className="bg-teal-500 hover:bg-emerald-600 text-white rounded-xl px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
