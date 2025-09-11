"use client"

import type React from "react"
import type { MouseEvent } from "react"
import { useState, useEffect, useRef } from "react"

import { redirect, useRouter } from "next/navigation";

//import Hanspell  from "hanspell";

import { useChatToken, useUserInfo, useMedicalDepartments, useChatRoom } from "@/lib/store";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MediBot } from "@/components/medi-bot"
import { MediLogo } from "@/components/medi-logo"
import { AccountForm } from "@/components/account-form"

import { IconMenu } from "@/components/icon-menu"
import { IconSettings } from "@/components/icon-settings"
import { MapLayout } from "@/components/map-layout"
import { chatInterfaceTemplate } from "@/lib/template"
import { Send, LogOut, Home, Activity, Clock, Plus } from "lucide-react"

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

const MESSAGE_SCENARIO = ["welcome", "evaluating" , ["score_high", "score_low"], "recommend", "hospitals", "adios"];

export function ChatInterface() {
  const typingRef = useRef(null);

  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeTyping, setActiveTyping] = useState(false)
  const [isClosed, setIsClosed] = useState(true)
  const [activeTab, setActiveTab] = useState("1")
  const [showMap, setShowMap] = useState(false)
  const [showAccountForm, setShowAccountForm] = useState(false)

  const [age, setAge] = useState(useUserInfo((s) => s.age));
  const [gender, setGender] = useState(useUserInfo((s) => s.gender));
  const [nickName, setNickName] = useState(useUserInfo((s) => s.nickname));

  const [roomTitle, setRoomTitle] = useState<any>(null);

  const [messageStep, setMessageStep] = useState(0);
  const [evaluateScore, setEvaluateScore] = useState(95);  //모델지표의 평균값
  const [incorrectMessageRate, setIncorrectMessageRate] = useState("");
  
  const [messages, setMessages] = useState<any[]>([
    Object.assign(
      ((_welcomes) => _welcomes[Math.floor(Math.random() * (_welcomes.length))])(INTERFACE_TEMPLATE.welcome()),
      { timestamp: new Date() },
    ),
  ]);

  const router = useRouter();

  // 토큰
  const token = useChatToken((s) => s.chatToken);

  // 창크기 확인
  const handleInnerSize = () => window.innerWidth <= 768;

  // 사이드메뉴
  const sideMenu = [
    { page: "1", name: "증상 문의", icon: Activity, className: '' },
    { page: "2", name: "과거 내역", icon: Clock, className: '' },
  ];

  // korean 스펠첵
  // 모델에 보내기 전에 프론트에서 1차 유효검사
  const incorrectSpellCheck = (text: string) => {
    // Hanspell.check(text, (err: string, result: string[]) => {
    //   if (err) return console.error(err);

    //   const totalWords = text.split(/\s+/).length;
    //   const errorWords = result.length; // hanspell이 반환하는 교정 제안 개수
    //   const errorRate = ((errorWords / totalWords) * 100).toFixed(2);

    //   console.log(`오타율: ${errorRate}%`);
    //   setIncorrectMessageRate(errorRate);
    // });
  };

  // messages on template 가져오기
  const getMessage = (_step: any) => 
    ((_templates) => _templates[Math.floor(Math.random() * (_templates.length))])(INTERFACE_TEMPLATE[_step]());

  const sendMessage = async(_message: any) => {
    const roomId = useChatRoom((s) => s.id);
    if (roomId) {
      try {
        // 메시지 전송
        const sendChatMessage = await fetch(`/api/chat/rooms/${roomId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ content: _message }),
        });

        const chatRooms = await sendChatMessage.json();

        console.log("[chat-interface] Send message :: ", chatRooms);
      } catch(e) {
        console.error(e);
      }
    }
  };

  // chatbox 메시지 전송
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    // 입력여부 확인
    if (!inputMessage.trim()) return;

    console.log('[chart-interface] inputMessage :: ', inputMessage);
    
    const _inputMessage = await sendMessage(inputMessage);    

    const userMessage: any = {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: [_inputMessage],
      sender: "user",
    };

    console.log('[chart-interface] _inputMessage :: ', _inputMessage);

    // 오타율 검사(말이되는 말(한글)인지)
    //incorrectSpellCheck(inputMessage);    
     
    //메시지 보임 & input창 초기화 & 타이핑 효과 & input창 활성화
    setMessageStep(messageStep + 1);
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setActiveTyping(true);

    // Simulate bot response
    // setTimeout(() => {      
    //   const returnMessage = {};

    //   // 오타율이 너무 높으면 다시 써달라고 하기 (low-eval)
    //   if (Number(incorrectMessageRate) >= 50) {
    //     Object.assign(returnMessage, {
    //       id: Date.now().toString(),
    //       timestamp: new Date(),
    //       content: getMessage("low_eval"),
    //       sender: "bot"
    //     });
    //   }

    //   // 다음에 보일 메시지 체크
    //   let _step = MESSAGE_SCENARIO[messageStep];

    //   // 평가결과..
    //   if (_step instanceof Array) {
    //     _step = `score_${(evaluateScore >= 95) ? 'high' : 'low'}`
    //   }

    //   Object.assign(returnMessage, getMessage(_step), {
    //       id: Date.now().toString(),
    //       timestamp: new Date(),
    //   });

    //   setMessages((prev) => [...prev, returnMessage])
    //   setIsTyping(false)
    //   setActiveTyping(false)
    // }, 1500)
  }

  // chatbox 버튼 클릭
  const handleButtonClick = (_message: string) => {
    const userMessage: any = {
      id: Date.now().toString(),
      content: [_message],
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
      setInputMessage("")
      setIsTyping(true)
      setActiveTyping(true)

      const getReplyMessage = () => {
        if (_message.includes('예측')) {
          return Object.assign(userMessage, {
            content: ['']
          });
        }

        if (_message.includes('네')) {
          setMessageStep(messageStep + 1);
          setActiveTyping(false);
          return getMessage("hospitals");
        }

        if (_message.includes('아니요')) {
          setActiveTyping(false);
          return getMessage("adios");
        }

        return Object.assign(userMessage, {
          content: ['버튼을 선택해주세요! 🙌']
        });
      };

      // Simulate bot response
      setTimeout(() => {
        const botMessage: any = Object.assign(getReplyMessage(), {
          id: Date.now().toString(),
          timestamp: new Date(),
        });

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
    }, 1500);
  }

  // 로그아웃 버튼 클릭
  const handleLogout = async() => {
    const getAuthResponse = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const { message } = await getAuthResponse.json();

    console.log('[chart-interface] Logout Message :: ', message);

    router.replace('/');
    //window.location.href = "/"
  }

  // 사이드메뉴 close on outside click 방지
  const handleSideMenuBackground = (e: MouseEvent<HTMLDivElement>) => {
    if (e?.currentTarget.className.indexOf('chat-container') > -1) {
      setIsClosed(true);
    }
  }

  // 사이드메뉴 열기/닫기 상태설정
  const handleSideMenuToggle = () => {
    setIsClosed(!isClosed);
  }

  // 사이드메뉴 클릭
  const clickSideMenu = async() => {
    if (activeTab === "2") {
      const roomId = "13"; //useChatRoom((s) => s.id);

      // 테스트 get
      // GET
      const getChatMessages = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseMessages = await getChatMessages.json();

      console.log('[chart-interface] Get Chatroom Messages :: ', responseMessages);
    }
  }

  const handleLocationRequest = () => {
    setShowMap(true)
    const locationMessage: any = {
      id: Date.now().toString(),
      content:
        [""],
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    }
    setMessages((prev) => [...prev, locationMessage])
  }

  // 로그인 chatrooms 조회 & 생성
  useEffect(() => {
    // 메시지 스텝 +1 (welcome 다음)
    setMessageStep(messageStep + 1);

    // 화면크기 감지 후 반응
    if (window.matchMedia('(min-width: 768px)').matches) {
      setTimeout(() => {
        setIsClosed(false);
      });
    }

    // 토큰 확인
    let cancelled = false;
    if (!token) {
      //router.replace("/");
    } 

    // chat rooms 조회
    (async () => {
      try {        
        const getChatRooms = await fetch("/api/chat/rooms", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        
        const chatRooms = await getChatRooms.json();
        
        if (!cancelled) {
          console.log("[chat-interface] Chatroom List ::", chatRooms);
          
          const rooms = `Room_${Math.floor(Math.random() * 900 + 100)}`;
          setRoomTitle(rooms);
          
          const createChatRooms = await fetch("/api/chat/rooms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ title: rooms }),
          });
          
          if (!createChatRooms.ok) {
            const text = await createChatRooms.text();
            console.error("[chat-interface] create room failed:", createChatRooms.status, text);
            throw new Error(text || `HTTP ${createChatRooms.status}`);
          }
          
          const {
            title,
            id,
            final_disease_id,
          } = await createChatRooms.json();

          console.log("[chat-interface] New chatroom - ", `title: ${title}, id: ${id}, final_disease_id: ${final_disease_id}`);

          // 채팅룸 정보저장
          useChatRoom.getState().setTitle(`${title}`);
          useChatRoom.getState().setId(id);
          useChatRoom.getState().setFinalDiseaseId(final_disease_id);
        }
    
      } catch (err) {
        console.error("로그인불가");
        router.replace('/');
      }

      // 임시 deptnm
      useMedicalDepartments.getState().setDepartment("내과");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex w-full h-screen">
      <div
          className={`bg-white border-r border-gray-200 overflow-hidden
                    transition-[width] duration-500 ease-in-out
                    ${isClosed ? `w-0 opacity-0` : `w-80 opacity-100${handleInnerSize() ? ' h-full absolute' : ''}`}`}
          aria-hidden={isClosed}
        >
        {/* Sidebar Header */}
        <div className={`h-full transition-opacity duration-500 ${isClosed ? 'opacity-0' : 'opacity-100'}`}>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <div className="w-10 h-9 text-white">
                  <MediLogo />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">MeDevise</h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {sideMenu.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    setActiveTab(item.page);
                    clickSideMenu();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.page ? "bg-green-50 text-teal-900 font-medium" : "text-gray-700 hover:bg-gray-50"
                  } ${item.className}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center cursor-pointer"
                onClick={() => handleSideMenuToggle()}
              >
                <IconMenu />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Popover open={showAccountForm} onOpenChange={setShowAccountForm}>
                <PopoverTrigger asChild>
                  <div
                      onClick={() => {
                        setShowAccountForm(true)
                      }}
                      className="cursor-pointer"
                    >
                    <IconSettings /> 
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-96 p-0 max-h-96 overflow-y-auto"
                  align="center"
                  side="top"
                  sideOffset={15}
                  >
                  <AccountForm
                    onClose={() => {
                      setShowAccountForm(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
              <span
                className="flex items-center gap-2 mt-1 text-sm bg-green-100 text-gray-700 px-3 py-1 rounded-full"
              >
                <div>{nickName}</div>
                <div>{age}세 </div>
                <div className="flex items-center gap-2">
                  <div>{gender} </div>
                  <div className={`w-2 h-2 rounded-full bg-${gender === "여성" ? "red" : "blue"}-500`}></div>
                </div>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="cursor-pointer flex items-center gap-2 bg-transparent hover:bg-teal-500 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div
          className="chat-container flex-1 overflow-y-auto p-6 bg-emerald-50"
          onClick={handleSideMenuBackground}
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => {
              return (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-md ${message.sender === "user" ? "" : "w-full max-w-2xl"}`}>
                    {/* bot answer */}
                    {
                      message.sender === "bot" && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 text-white-600">
                              <MediBot />
                            </div>
                          </div>
                        </div>
                      )
                    }
  
                    <div
                      className={`p-4 rounded-2xl ${
                        message.sender === "user" ? "bg-teal-600 text-white ml-auto" : "bg-white text-gray-800 shadow-sm"
                      }`}
                    >
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
                              className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-teal-500 hover:text-white"
                            >
                              {_button}
                            </Button>
                          ))}
                        </div>
                      )}
  
                      {message.type === "map" && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          <MapLayout />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* {showMap && (
              <div className="w-full">
                <MapContainer
                  userLocation={{ lat: 40.7128, lng: -74.006 }}
                  onLocationSelect={(facility) => {
                    const facilityMessage: Message = {
                      id: Date.now().toString(),
                      content: `You selected ${facility.name}. Would you like me to help you prepare for your visit or provide more information about this facility?`,
                      sender: "bot",
                      timestamp: new Date(),
                      type: "text",
                    }
                    setMessages((prev) => [...prev, facilityMessage])
                  }}
                />
              </div>
            )} */}

            {/* <div className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">
                  Try consulting a physician or a pulmonologist for further investigation.
                </p>
              </div>
            </div> */}

            {/* BRG */}
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
                      <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-red-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-green-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <Input
                ref={typingRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="MeDevise에게 문의하세요."
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
      </div>
    </div>
  )
}
