"use client"

import type React from "react"
import type { MouseEvent } from "react"
import { useState, useEffect, useRef } from "react"

import { redirect, useRouter } from "next/navigation";

// import Hanspell  from "hanspell";

import { useChatToken, useUserInfo, useMedicalDepartments, useChatRoom } from "@/lib/store";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MediBot } from "@/components/medi-bot"
import { MediLogo } from "@/components/medi-logo"
import { ProfileForm } from "@/components/profile-form"

import { IconMenu } from "@/components/icon-menu"
import { IconSettings } from "@/components/icon-settings"
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
  const typingRef = useRef(null);
  const chatRef = useRef<HTMLDivElement | null>(null);   // ★ 추가

  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeTyping, setActiveTyping] = useState(false)
  const [isClosed, setIsClosed] = useState(true)
  const [activeTab, setActiveTab] = useState("1")
  const [showMap, setShowMap] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(false)

  const [age, setAge] = useState(useUserInfo((s) => s.age));
  const [gender, setGender] = useState(useUserInfo((s) => s.gender));
  const [nickName, setNickName] = useState(useUserInfo((s) => s.nickname));

  const [roomTitle, setRoomTitle] = useState<any>(null);
  const [roomId, setRoomId] = useState(null);
  const [finalDiseaseId, setfinalDiseaseIdRoomId] = useState(null);

  const [messageStep, setMessageStep] = useState(0);
  const [userStep, setUserStep] = useState(0);
  const [botStep, setBotStep] = useState(1);

  const [evaluateScore, setEvaluateScore] = useState(95);  //모델지표의 평균값
  const [incorrectMessageRate, setIncorrectMessageRate] = useState("");

  const [userMessageContent, setUserMessageContent] = useState("");

  const [diseaseName, setDiseaseName] = useState("");
  
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

  // messages on template 가져오기
  const getMessage = (_step: any, symptom?: string, list?:string[]) => 
    ((_templates) => _templates[Math.floor(Math.random() * (_templates.length))])(INTERFACE_TEMPLATE[_step](symptom, list));

  const showBotMessage = async(_userMessage: any) => {

    const botMessage: any = {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: [],
      sender: "bot",
    };

    // 오타율이 너무 높으면 다시 써달라고 하기 (low-eval)
    if (Number(incorrectMessageRate) >= 50) {
      Object.assign(botMessage, {
        id: Date.now().toString(),
        timestamp: new Date(),
        content: getMessage("low_eval"),
        sender: "bot"
      });
    }

    // 다음에 보일 메시지 체크
    let _step = MESSAGE_SCENARIO[messageStep];

    // 평가결과..
    if (_step instanceof Array) {
      _step = `score_${(evaluateScore >= 95) ? 'high' : 'low'}`
    }

    Object.assign(botMessage, getMessage(_step), {
        id: Date.now().toString(),
        timestamp: new Date(),
    });

    setMessages((prev) => [...prev, botMessage]);
    chatRef.current?.scrollIntoView({ behavior: "smooth" });

    const diagnoseSymptom = async () => {
      if (MESSAGE_SCENARIO[messageStep] === "evaluating") {
        let content: any;
        const [diseaseName, score, messageContent]: any = await sendSymptomMessage(_userMessage);

        console.log("[chat-interface] Result sysmptom :: ", messageContent);

        if (!score) {
          console.log('[chart-interface] score가 너무 낮아서, 질병판별 불가.');
          content = [messageContent];
        } else {
          console.log('[chart-interface] 질병을 판별 함.');
          content = messageContent.split('\n');
        }

        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          timestamp: new Date(),
          content, //[messageContent],
          sender: "bot",
        }]);

        if (score) {
          setTimeout(() => {
            setMessages((prev) => [...prev, Object.assign({
              id: Date.now().toString(),
              timestamp: new Date(),
              content: [],
              sender: "bot",
            }, getMessage('recommend', diseaseName))]);
          }, 1500);
        } else {
          // evaluate 다시
          setMessageStep(1);
        }
      }

      setIsTyping(false)
      setActiveTyping(false)
    };

    setTimeout(diagnoseSymptom, 1500);
   
  };

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

  // fetch message
  const sendUserMessage = async(_message: any) => {
    const _roomId = roomId;

    if (_roomId) {
      try {
        // 메시지 전송
        const sendChatMessage = await fetch(`/api/chat/rooms/${_roomId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ content: _message }),
        });

        const chatRooms = await sendChatMessage.json();

        const { bot_message, user_message} = chatRooms;

        console.log("[chat-interface] Send message :bot_message: ", bot_message);
        console.log("[chat-interface] Send message :user_message: ", user_message);

        // {id: 3, message_type: 'USER', content: '허리가 아파요.', created_at: '2025-09-11T14:24:19.250527'}
        return user_message.content;

      } catch(e) {
        console.error(e);
      }
    }
  };

  const sendSymptomMessage = async(_message: any) => {
    const _roomId = roomId;

    if (_roomId) {

      let resultDisease = "";

      try {
        // 증상 분석
        const sendSymptom = await fetch(`/api/ml/analyze-symptom`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            chat_room_id: roomId,
            text: _message,
          }),
        });

        const resultDiseases = await sendSymptom.json();
        
        // 질병예측 결과
        const {
          chat_room_id,
          processed_text,
          disease_classifications,
          top_disease,
          confidence,
          formatted_message,
        } = resultDiseases;


        console.log("[chat-interface] Send symptoms: top_disease", top_disease);
        console.log("[chat-interface] Send symptoms: confidence", confidence);
        console.log("[chat-interface] Send symptoms: formatted_message", formatted_message);

        // {id: 3, message_type: 'USER', content: 'sd', created_at: '2025-09-11T14:24:19.250527'}

        if (top_disease) {
          if (confidence >= 0.8) {
            setDiseaseName(top_disease);

            return [top_disease, confidence, formatted_message];
          }
        }
        return ['', 0, getMessage('score_low')['content'].join('')];

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

    const userMessage: any = {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: [],
      sender: "user",
    };

    // 증상설명...
    if (MESSAGE_SCENARIO[messageStep] === "evaluating") {
      const _inputMessage = await sendUserMessage(inputMessage);

      setUserMessageContent(_inputMessage);

      Object.assign(userMessage, {
        content: [_inputMessage]
      });

      console.log('[chart-interface] USER STEP1  :: ', _inputMessage);

      //메시지 보임 & input창 초기화 & 타이핑 효과 & input창 활성화
      setUserStep(userStep + 1);
      setMessageStep(messageStep + 1);
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsTyping(false);
      setActiveTyping(false);

      // Simulate bot response
      // setTimeout(() => {
      // 챗룸 연결
      

      showBotMessage(_inputMessage);
      // }, 1500);
    }

    // 오타율 검사(말이되는 말(한글)인지)
    //incorrectSpellCheck(inputMessage);
  }

  // chatbox 메시지 전송 - chatbox 버튼 클릭
  const handleButtonClick = async(_message: string) => {
    // 사용자 답변 (클릭한 버튼 내용)
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      content: [_message],
      sender: "user",
      timestamp: new Date(),
    }]);
    setInputMessage("")
    setIsTyping(true)
    setActiveTyping(true)

    const botMessage: any = {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: [],
      sender: "bot",
    };

    //
    if (_message.includes('네')) {
      const recommendedHospitals = await recommendHospitals();

      console.log('[chat-interface] 네 버튼으로 추천받은 병원리스트: ', recommendedHospitals);

      setActiveTyping(false);
      setInputMessage("");
      setIsTyping(false);
      
      Object.assign(botMessage, getMessage("hospitals", diseaseName, recommendedHospitals));
    
    // 종료
    } else if (_message.includes('아니요')) {
      setActiveTyping(false);
      
      Object.assign(botMessage, Object.assign({
        id: Date.now().toString(),
        timestamp: new Date(),
      }, getMessage("adios")));

      setIsTyping(false);
      setActiveTyping(false);

    // 다른걸 입력했다 ?
    } else {
      Object.assign(botMessage, {
        content: ['버튼을 선택해주세요! 🙌']
      });
    }

    setMessages((prev) => [...prev, botMessage]);
  }

  // chatbox Map 메시지 전송
  const handleMapMessage = async (e: any) => {
    e.preventDefault()

    const hospitalInfo = e.currentTarget.name;
    const [hospitalName, hospitalAddress, hospitalPhone] = hospitalInfo.split('^');

    console.log('hospitalName : ', hospitalName, ', hospitalAddress : ', hospitalAddress, ', hospitalPhone: ', hospitalPhone);

    const getHospitalId = await fetch(`/api/medical/hospitals?search=${encodeURIComponent(hospitalName)}&department_id=${null}&disease_id=${null}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const hospitalInfoResult = await getHospitalId.json();
    const hospitalId = hospitalInfoResult[0].id;

    console.log('hospitalId id:: ', hospitalId);

    const hospitalLocation = await fetch(`/api/medical/hospitals/${hospitalId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const hospitalLocationResult = await hospitalLocation.json();

    console.log('hospitalLocationResult:: ', hospitalLocationResult);

    //메시지 보임 & input창 초기화 & 타이핑 효과 & input창 활성화
    setUserStep(userStep + 1);
    setMessageStep(messageStep + 1);
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      content: [`🏣 ${hospitalName} (${hospitalPhone})`, ` ${hospitalAddress}`],
      sender: "bot",
      type: "map",
      timestamp: new Date(),
      hospitalName,
      hospitalAddress,
      hospitalPhone,
      latitude: hospitalLocationResult.latitude,
      longitude: hospitalLocationResult.longitude,
    }]);
    setInputMessage("");
    setIsTyping(false);
    setActiveTyping(false);
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
      //const roomId = "13"; //useChatRoom((s) => s.id);

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

  const handleCreateNewChatRoom = async() => {
    const rooms = `Room_${Math.floor(Math.random() * 900 + 100)}`;

    console.log("[chat-interface] createChatRoom Title: ", rooms);

    if (roomTitle) {
      return false;
    }

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

    setRoomTitle(title);
    setRoomId(id);
    setfinalDiseaseIdRoomId(final_disease_id);

    return true;
  }

  const scrollToBottom = () => {
    if (chatRef.current !== null) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    
  }, [])

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
      router.replace("/");
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

          setRoomTitle(title);
          setRoomId(id);
          setfinalDiseaseIdRoomId(final_disease_id);
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

  // 스크롤 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
              <h1 className="text-2xl font-bold text-gray-900">MeDeviSe</h1>
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
              <Popover
                open={showProfileForm}
                onOpenChange={setShowProfileForm}
              >
                <PopoverTrigger asChild>
                  <div
                      onClick={() => {
                        setShowProfileForm(true)
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
                  onOpenAutoFocus={(e) => e.preventDefault()}     // 자동 포커스 방지
                   onCloseAutoFocus={(e) => e.preventDefault()}  // 선택 (옵션) 포커스 원복도 방지
                  >
                  <ProfileForm
                    onClose={() => {
                      setShowProfileForm(false)
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
                  <div>{gender === "Male" ? "남성" : "여성"} </div>
                  <div className={`w-2 h-2 rounded-full ${gender === "Male" ? "bg-blue-500" : "bg-red-500"}`} ></div>
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
          ref={chatRef}
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
  
                      {message.type === "button-check"
                        && message.buttons
                        && (<div className="flex flex-wrap gap-2 mt-4">
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
                          {/* <MapLayout locations={message.location}/> */}
                          {message.location.map((_locationItem: any) => (
                            <div
                              key={_locationItem.id ?? `${_locationItem.name}-${_locationItem.phone ?? ''}`}
                              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                                'bg-blue-50 border-blue-200'
                              }`}
                              >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <div className={`font-medium text-gray-900${_locationItem.name.length >= 11 ? ' w-[180px] whitespace-nowrap text-ellipsis overflow-hidden' : ''}`}>{_locationItem.name}</div>
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full bg-red-100 text-red-700`}
                                      >
                                        {_locationItem.hospital_type_name}
                                      </span>
                                  </div>

                                  {_locationItem.recommended_reason && (
                                    <p className="text-xs text-gray-500 mt-1">{_locationItem.recommended_reason}</p>
                                  )}

                                  <p className="text-sm text-gray-600 mt-1">{_locationItem.address}</p>

                                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                    {_locationItem.distance && (
                                    <div className="flex items-center gap-1">
                                      <Navigation className="w-3 h-3" />
                                      {(_locationItem.distance).toFixed(2)} km
                                    </div>
                                    )}
                                    {_locationItem.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {_locationItem.phone}
                                    </div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    name={`${_locationItem.name}^${_locationItem.address}^${_locationItem.phone}`}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleMapMessage(e);
                                    }}
                                    className="ml-2 cursor-pointer flex items-center gap-2 bg-transparent hover:bg-teal-500 hover:text-white"
                                  >
                                    <Navigation className="w-3 h-3 mr-1" />
                                    Directions
                                  </Button>

                                </div>
                              </div>
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
              );
            })}

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
      </div>
    </div>
  )
}
