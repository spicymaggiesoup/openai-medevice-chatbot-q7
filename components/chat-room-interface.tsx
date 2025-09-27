"use client"

import type React from "react"
import { Fragment, useState, useEffect, useRef, useCallback, useLayoutEffect } from "react"

import Link from "next/link"

import { redirect, useRouter, usePathname } from "next/navigation";

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

// 컴포넌트 파일 맨 위(모듈 스코프)
let _bootstrappedOnce = false;

export function ChatRoomInterface({ id, step, message, showTyping}: any) {
  // 토큰
  const token = useChatToken((s) => s.chatToken);

  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<any[]>([]);

  const [messageStep, setMessageStep] = useState(step);

  const [bootstrapped, setBootstrapped] = useState(false);

  const [inputMessage, setInputMessage] = useState("");

  const [isChatMainPage, setIsChatMainPage] = useState(true);
  
  //const [searchAPI, setSearchAPI] = useState(false);

  const [targetChat, setTargetChat] = useState<any | null>(null);

  const [goToChatMain, setGoToChatMain] = useState(false);
  
  const [botMessageFromPOST] = useState([
    "증상에 대해 더 자세히 알려주시면 보다 정확한 정보를 제공해드릴 수 있습니다.",
    "분석 중입니다...",
  ]);

  const chatRef = useRef<HTMLDivElement | null>(null);
  const [isTypingEffect, setIsTypingEffect] = useState(showTyping);
  const [userInputDisabled, setUserInputDisabled] = useState(false);
  const [diseaseName, setDiseaseName] = useState("");
  const [roomId, setRoomId] = useState(id);
  const [evaluateScore] = useState(95); 

  const router = useRouter();
  const pathname = usePathname();

  // messages on template 가져오기
  const getMessage = (_step: any, symptom?: string, list?:string[]) => 
    ((_templates) => _templates[Math.floor(Math.random() * (_templates.length))])(INTERFACE_TEMPLATE[_step](symptom, list));


  //const sendChatText = async(content: any) => onSendChatText(roomId, content);
  const sendChatText = async(content: any) => {
    if (roomId) {
      try {
        // 메시지 전송
        const sendChatMessage = await fetch(`/api/chat/rooms/${roomId}/messages`, {
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

  const scrollToBottom = () => {
    if (chatRef.current !== null) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const showBotMessage = async(_userMessage: any) => {
    const botMessage: any = {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: [],
      sender: "BOT",
    };

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
    
    const { content } = await sendChatText(`${messageStep}_BOT_${botMessage.content.join('')}`);

    chatRef.current?.scrollIntoView({ behavior: "smooth" });

    if (MESSAGE_SCENARIO[messageStep] === "evaluating") {
      //if (searchAPI) return false;

      const nextStep = messageStep + 1;
      setMessageStep(nextStep);

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
        sender: "BOT",
      }]);

      if (score) {
        //setTimeout(() => {
          setMessages((prev) => [...prev, Object.assign({
            id: Date.now().toString(),
            timestamp: new Date(),
            content: [],
            sender: "BOT",
          }, getMessage('recommend', diseaseName))]);
        //}, 1500);
      } else {
        // evaluate 다시
        setMessageStep(1);
      }
    }

    setIsTypingEffect(false);
    setUserInputDisabled(false);
  };
    
  const sendSymptomMessage = async(_message: any) => {
    //setSearchAPI(true);
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

        //setSearchAPI(false);

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

  const manageSendMessage = async(_messageContent: string) => {
    const { content } = await sendChatText(_messageContent);

    console.log('[chat-room-interface] content :: ', content);
    console.log('[chat-room-interface] message :before delete: ', messages);

    if (content === botMessageFromPOST) {
      messages.map(item => {
        if (item === botMessageFromPOST) {
          delete messages[item];

          console.log('[chat-room-interface] message :after delete: ', messages);

          return messages;
        }
      })
    }
  };

  // chatbox 메시지 전송
  const handleSendMessage = async () => {
    const messageContent = inputRef.current?.value ?? "";
    if (!messageContent.trim()) return;

    console.log('[chart-interface] inputMessage :: ', messageContent);

    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: [messageContent],
      message_type: "USER",
    }]);

    const nextStep = messageStep + 1;
    setMessageStep(nextStep);

    setIsTypingEffect(true);

    setUserInputDisabled(true);

    setMessages((prev) => [...prev, getMessage(MESSAGE_SCENARIO[nextStep])]);

    const _content = await manageSendMessage(`${nextStep}_USER_${messageContent}`);
    await showBotMessage(_content);
  };

  // chatbox 메시지 전송 - chatbox 버튼 클릭
  const handleButtonClick = async(_message: string) => {
    // 사용자 답변 (클릭한 버튼 내용)
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      content: [_message],
      sender: "user",
      timestamp: new Date(),
    }]);
    setInputMessage("");
    setIsTypingEffect(true);
    setUserInputDisabled(true);

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

      setIsTypingEffect(false);
      setInputMessage("");
      setIsTypingEffect(false);
      
      Object.assign(botMessage, getMessage("hospitals", diseaseName, recommendedHospitals));
    
    // 종료
    } else if (_message.includes('아니요')) {
      setUserInputDisabled(false);
      
      Object.assign(botMessage, Object.assign({
        id: Date.now().toString(),
        timestamp: new Date(),
      }, getMessage("adios")));

      setIsTypingEffect(false);
      setUserInputDisabled(false);

    // 다른걸 입력했다 ?
    } else {
      Object.assign(botMessage, {
        content: ['버튼을 선택해주세요! 🙌']
      });
    }

    setMessages((prev) => [...prev, botMessage]);
  };

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
    setMessageStep(messageStep + 1);
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
    setIsTypingEffect(false);
    setUserInputDisabled(false);
  };

  const flattenMessages = (input: any[]): any[] => {
    const resultMessages: any[] = [];
    let step;

    function flattern(item: any) {
      if (Array.isArray(item)) {
        item.forEach(flattern);
        return;
      } else if (item && typeof item === "object") {
        if (typeof item.content === "string") {
          const prefixList = /[0-9]_(?:USER|BOT)_/g;
          let message_type: any = (item.content).match(prefixList);
          if (message_type && message_type.length) {
            message_type = message_type.join('');
            step = Number(message_type.replace(`_USER_`, '').replace('_BOT_', ''));
            message_type = message_type.replace(`${step}_USER_`, `USER`).replace(`${step}_BOT_`, 'BOT');

            const content = (item.content).replace(/\b[0-9]_(?:USER|BOT)_\b/g, "");
            Object.assign(item, { content, message_type });
          }
        }

        if (botMessageFromPOST.indexOf(item.content) > -1) {
          return;
        }

        resultMessages.push(item);
      }
    }

    flattern(input);
    return [step, resultMessages];
  };

  useEffect(() => {
    if (_bootstrappedOnce) return;
    _bootstrappedOnce = true;

    console.log('[chat-room-interface] Message step: ', step);
    console.log('[chat-room-interface] Message message: ', message);
    console.log('[chat-room-interface] Message showTyping: ', showTyping);

    // 초기 1회만 실행할 로직
    const [_step, _messages] = flattenMessages(message);
    setMessages(_messages);
    setIsTypingEffect(showTyping);
    setUserInputDisabled(showTyping);
    setMessageStep(_step || step);

    if (MESSAGE_SCENARIO[step] === "evaluating" && _messages.length) {
      const last = _messages[_messages.length - 1];
      const content = Array.isArray(last.content) ? last.content.join("\n") : last.content;
      if (content) {
        (async() => {
          await showBotMessage(content);
        })();
      }
    }
  }, []);

  // useEffect(() => {
  //   if (!bootstrapped) return;
  //   if (!messages.length) return;

  //   if (MESSAGE_SCENARIO[messageStep] === "evaluating") {
  //     const last = messages[messages.length - 1];
  //     const content = Array.isArray(last.content) ? last.content.join("\n") : last.content;
  //     if (content) {
  //       showBotMessage(content);
  //       setBootstrapped(false);
  //     }
  //   }
  // }, [bootstrapped, messageStep, messages]);

  // 스크롤 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-interface flex flex-col flex-1 min-h-0 bg-emerald-50 overflow-hidden">
      <Popover
        open={goToChatMain}
      >
        <PopoverTrigger asChild>
          <div
            onClick={() => setGoToChatMain(true)}
            className="cursor-pointer pt-4 fixed right-5 text-teal-700 text-xl"
            >
            <IconHome />
          </div>
        </PopoverTrigger>
         <PopoverContent
          className="w-auto p-4 space-y-3"
          align="center"
          side="left"
          sideOffset={0}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="text-sm flex justify-center">채팅방을 나가시겠습니까?</div>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              className="cursor-pointer px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                //router.replace(`/home?v=${roomId}`);
                // 1) 상태 초기화
                setMessageStep(0);
                setMessages([]);
                setIsTypingEffect(false);
                setGoToChatMain(false);

                _bootstrappedOnce = false;

                // 2) 같은 경로면 쿼리를 붙여 강제 내비게이션
                if (pathname === "/home") {
                  router.replace(`/home?v=${Date.now()}`); // URL이 달라져서 remount
                } else {
                  router.replace("/home");
                }
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
        ref={chatRef}
        className="flex-1 min-h-0 overflow-y-auto p-6">
        <div
          className="max-w-4xl mx-auto space-y-6"
          >
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
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              name="send-message-input"
              placeholder="MeDeviSe에게 문의하세요."
              className="flex-1 border-gray-200 focus:border-teal-400 focus:ring-emerald-400 rounded-xl"
              disabled={userInputDisabled}
            />
            <Button
              onClick={handleSendMessage}
              // disabled={!inputMessage.trim() || isTypingEffect}
              className="bg-teal-500 hover:bg-emerald-600 text-white rounded-xl px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
