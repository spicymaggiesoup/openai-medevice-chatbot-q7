"use client"

import type React from "react"
import type { MouseEvent } from "react"
import { useState, useEffect, useRef, useCallback } from "react"

import { redirect, useRouter } from "next/navigation";

// import Hanspell  from "hanspell";

import { useChatToken, useUserInfo, useMedicalDepartments, useChatRoom } from "@/lib/store";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const typingRef = useRef(null);
  const chatRef = useRef<HTMLDivElement | null>(null);   // ★ 추가

  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeTyping, setActiveTyping] = useState(false)

  const [roomTitle, setRoomTitle] = useState<any>(null);
  const [roomId, setRoomId] = useState(177);
  const [finalDiseaseId, setfinalDiseaseIdRoomId] = useState(null);

  const [messageStep, setMessageStep] = useState(0);
  const [userStep, setUserStep] = useState(0);
  const [botStep, setBotStep] = useState(1);

  const [evaluateScore, setEvaluateScore] = useState(95);  //모델지표의 평균값
  const [incorrectMessageRate, setIncorrectMessageRate] = useState("");

  const [userMessageContent, setUserMessageContent] = useState("");

  const [diseaseName, setDiseaseName] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState(false);
  
  const [messages, setMessages] = useState<any[]>([
    Object.assign(
      ((_welcomes) => _welcomes[Math.floor(Math.random() * (_welcomes.length))])(INTERFACE_TEMPLATE.welcome()),
      { timestamp: new Date() },
    ),
  ]);

  const [showMap, setShowMap] = useState(false);

  const router = useRouter();

  // 소켓 연결
  type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  type WsMsg = | { v: 1; id: string; method: Method; route: string; headers?: any; query?: any; body?: any; data?: any; event?: any };
  const wsRef = useRef<WebSocket | null | undefined>(null);
  const pendingRef = useRef<
    Map<string, { resolve: (v: any) => void; reject: (e: any) => void; t: number }>
  >(new Map());
  const queueRef = useRef<WsMsg[]>([]);
  const listenersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());
  const reconnectDelayRef = useRef(10000);
  const stopReconnectRef = useRef(false);

  // 토큰
  const token = useChatToken((s) => s.chatToken);


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

        const { bot_response, message} = chatRooms;

        console.log("[chat-interface] Send message :bot_message: ", bot_response);
        console.log("[chat-interface] Send message :user_message: ", message);

        // {id: 3, message_type: 'USER', content: '허리가 아파요.', created_at: '2025-09-11T14:24:19.250527'}
        return message.content;

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

  // useEffect(() => {
  //   connect();

  //   return () => {
  //     wsRef.current?.close();
  //     wsRef.current = undefined;
  //   };
  // }, [connect]);

  // 로그인 chatrooms 조회 & 생성
  useEffect(() => {
     // 토큰 확인
    let cancelled = false;
    if (!token) {
      router.replace("/");
    }

    // 메시지 스텝 +1 (welcome 다음)
    setMessageStep(messageStep + 1);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="chat-interface flex flex-col flex-1 min-h-0 bg-emerald-50 overflow-hidden"
      >
      {/* 스크롤 영역 */}
      <div
        ref={chatRef}
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
  );
}
