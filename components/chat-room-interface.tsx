"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react"

import { useRouter, usePathname } from "next/navigation";

import { useChatToken } from "@/lib/store";

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
import { Send, LogOut, Home, Activity, Clock, Plus, Pin, Navigation, Phone, Star, Plug, MapPin } from "lucide-react"

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

export function ChatRoomInterface({ id, step, message, showTyping, historyChat, moveToSearch}: any) {
  // 토큰
  const token = useChatToken((s) => s.chatToken);

  const bootstrappedRef = useRef(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // 맨 위 hooks 근처에 추가
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastAppendedIdRef = useRef<string | null>(null);

  const [messages, setMessages] = useState<any[]>([]);

  const [messageStep, setMessageStep] = useState(step);

  const [reEvaluating, setReEevaluating] = useState(false);

  const [inputMessage, setInputMessage] = useState("");

  const [goToChatMain, setGoToChatMain] = useState(false);
  
  const [botMessageFromPOST] = useState([
    "메시지를 받았습니다. 증상 분석을 위해 잠시만 기다려주세요.",
  ]);
  const [moveToSearchPageButton] = useState([
    "병원 및 장비현황 조회 페이지로 이동",
  ]);

  const [roomId] = useState(id);
  const [evaluateScore] = useState(95); 

  const router = useRouter();
  const pathname = usePathname();

  const chatRef = useRef<HTMLDivElement | null>(null);
  const [isTypingEffect, setIsTypingEffect] = useState(showTyping);
  const [userInputDisabled, setUserInputDisabled] = useState(false);
  const [userButtonDisabled, setUserButtonDisabled] = useState(false);
  const [diseaseName, setDiseaseName] = useState("");
  const [diseaseInferenceId, setDiseaseInferenceId] = useState("");

  const [chatStartDate, setChatStartDate] = useState(new Date().toLocaleString('ko-KR'));
  const [showChatStartDate, setShowChatStartDate] = useState(false);

  // messages on template 가져오기
  const getMessage = (_step: any, symptom?: string, list?:string[]) => 
    ((_templates) => _templates[Math.floor(Math.random() * (_templates.length))])(INTERFACE_TEMPLATE[_step](symptom, list));

  // 컴포넌트 내부 어딘가에 추가
  const appendMessage = useCallback((msg: any) => {
    const id = msg?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const withId = { id, timestamp: new Date(), ...msg };
    lastAppendedIdRef.current = id;          // 방금 추가한 메시지 기억
    setMessages(prev => [...prev, withId]);  // 실제 추가
  }, []);
  
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

        return message.content;
      } catch(e) {
        console.error(e);
      }
    }
  }

  // 위치기반 병원추천
  const recommendHospitals = async() => {
    try {
      // 메시지 전송
      const recommendHospitalsByDisease = await fetch(`/api/medical/recommend-hospitals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          "max_distance": 5,
          "limit": 10,
          "inference_result_id": diseaseInferenceId,
          "chat_room_id": roomId,
        }),
      });

      const recommendResult = await recommendHospitalsByDisease.json();

      console.log("[chat-interface] recommendHospitals : ", recommendResult);

      return recommendResult.recommendations;

    } catch(e) {
      console.error(e);
    }
  };

  const scrollToBottom = (stopScrollDown?: number) => {
    if (chatRef.current !== null) {
      const _scrollHeight = chatRef.current.scrollHeight;
      chatRef.current.scrollTop = stopScrollDown ? (_scrollHeight * stopScrollDown) : _scrollHeight;
    }
  };

  // 변경: 현재 스텝을 명시적으로 전달
  const showBotMessage = useCallback(async (currentStep: number, _userMessage: string) => {
    if (MESSAGE_SCENARIO[currentStep] === "evaluating") {
      const [diseaseName, score, messageContent]: any = await sendSymptomMessage(_userMessage);

      const contentArr = score ? messageContent.split('\n') : [messageContent];

      appendMessage({
        id: Date.now().toString(),
        timestamp: new Date(),
        content: contentArr,
        message_type: "BOT",
      });

      if (score) {
        const nextStep = currentStep + 1;
        setMessageStep(nextStep);

        appendMessage(Object.assign({
          id: Date.now().toString(),
          timestamp: new Date(),
          content: [],
          message_type: "BOT",
        }, getMessage('recommend', diseaseName)));

      } else {
        setMessageStep(0);
        setReEevaluating(true);
      }
    }

    setIsTypingEffect(false);
    setUserInputDisabled(false);
  }, [evaluateScore, sendChatText]);
    
  const sendSymptomMessage = async(_message: any) => {
    const _roomId = roomId;

    if (_roomId) {
      try {
        /*{
          "chat_room_id": 265,
          "confidence_threshold": 0.9,
          "confidence_threshold_met": true,
          "disease_classifications": [
            { 21개 질병 분류 객체들 }
          ],
          "inference_result_id": 16,
          "original_text": "0_USER_요즘 들어 오른쪽 윗배가 묵직하고 열이 미약하게 계속 나요, 피부가 점점 누렇게 보여요. 메시지를 받았습니다. 증상 분석을 위해 잠시만 기다려주세요.",
          "processed_text": "요즘 듣 오른쪽 윗배 열 나 피부 누렇 보이 메시지 받 증상 분석 위하 잠시 기다리 주",
          "top_disease": {
            "label": "간염",
            "score": 0.9992129802703857
          },
          "user_id": "5364e68a-72ae-45f7-b63b-0acd524ff168"
        }*/
       
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
          disease_classifications,
          inference_result_id,
          top_disease,
        } = resultDiseases;

        console.log("[chat-interface] Send symptoms: top_disease", top_disease);

        if (top_disease) {
          if (top_disease.score >= 0.9) {
            setDiseaseName(top_disease.label);
            setDiseaseInferenceId(inference_result_id);

            return [top_disease.label, top_disease.score, `**${top_disease.label}** 증상일 확률이 ${(Number(top_disease.score) * 100).toFixed(2)}%로 가장 높아요. 😥`];
          }
        }
        return ['', 0, getMessage('score_low')['content'].join('')];

      } catch(e) {
        console.error(e);
      }
    }
  };

  const recommendHospitalsByInferenceId = async(type: 'distance' | 'equipment' | 'department') => {
    try {
      // 메시지 전송
      const recommendHospitalsByDisease = await fetch(`/api/medical/recommendations/inference/${diseaseInferenceId}?sort_by=${type}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const recommendResultByInfer = await recommendHospitalsByDisease.json();

      console.log("[chat-interface] recommendHospitals : ", recommendResultByInfer);

      return recommendResultByInfer;

    } catch(e) {
      console.error(e);
    }
  };

  // chatbox 메시지 전송
  const handleSendMessage = async () => {
    const messageContent = inputRef.current?.value ?? "";
    if (!messageContent.trim()) return;

    console.log('[chart-interface] inputMessage :: ', messageContent);

    if (historyChat) {
      setChatStartDate(new Date().toLocaleString('ko-KR'));
      setShowChatStartDate(true);
      setMessageStep(1);
    }

    appendMessage({
      id: Date.now().toString(),
      timestamp: new Date(),
      content: [messageContent],
      message_type: "USER"
    });

    const nextStep = messageStep + 1;
    setMessageStep(nextStep);

    setIsTypingEffect(true);

    setUserInputDisabled(true);

    appendMessage(getMessage(MESSAGE_SCENARIO[nextStep]));

    await showBotMessage((historyChat || reEvaluating) ? nextStep : messageStep, messageContent);

    setReEevaluating(false);
  };

  // chatbox 메시지 전송 - chatbox 버튼 클릭
  const handleButtonClick = async(_message: string) => {

    if (_message.includes(moveToSearchPageButton.join(''))) {
      // diseaseName
      // const diseaseId = await searchDiseaseId();
      
      moveToSearch();
    }

    // 사용자 답변 (클릭한 버튼 내용)
    appendMessage({
      id: Date.now().toString(),
      content: [_message],
      message_type: "USER",
      timestamp: new Date(),
    });
    setInputMessage("");
    setIsTypingEffect(true);
    setUserInputDisabled(true);

    const botMessage: any = {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: [],
      message_type: "BOT",
    };

    if (_message.includes('네')) {
      const recommendedHospitals = await recommendHospitals();

      console.log('[chat-interface] 네 버튼으로 추천받은 병원리스트: ', recommendedHospitals);

      setIsTypingEffect(false);
      setInputMessage("");
      setIsTypingEffect(false);
      
      Object.assign(botMessage, getMessage("hospitals", diseaseName, recommendedHospitals));
    
    // 종료
    } else if (_message.includes('아니요')) {
      Object.assign(botMessage, Object.assign({
        id: Date.now().toString(),
        timestamp: new Date(),
      }, getMessage("adios")));

      setIsTypingEffect(false);
      setUserInputDisabled(true);

    // 다른걸 입력했다 ?
    } else {
      Object.assign(botMessage, {
        content: ['버튼을 선택해주세요! 🙌']
      });
    }

    setUserButtonDisabled(true);
    appendMessage(botMessage);
  };

  // 병원 목록 재정렬
  const handleSortButtonClick = async(_message: any, _type: 'distance' | 'equipment' | 'department') => {
    console.log('[chat-room-interface] _message: ', _message, ', _type: ', _type);
    console.log('[chat-room-interface] messages: ', messages);

    const listOfSortedHospitals = await recommendHospitalsByInferenceId(_type);

    console.log('[chat-room-interface] listOfSortedHospitals: ', listOfSortedHospitals);

    const botMessage: any = {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: [],
      message_type: "BOT",
      clickedType: _type,
    };

    Object.assign(botMessage, getMessage("hospitals", diseaseName, listOfSortedHospitals));

    appendMessage(botMessage);
  };

  // chatbox Map 메시지 전송
  const handleMapMessage = async ({
    name, address, phone, id
  }: any) => {
    const hospitalName = name;
    const hospitalAddress = address;
    const hospitalPhone = phone;
    const hospitalId = id;

    console.log('hospitalName : ', hospitalName, ', hospitalAddress : ', hospitalAddress, ', hospitalPhone: ', hospitalPhone);
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
    //setMessageStep(messageStep + 1);
    appendMessage({
      id: Date.now().toString(),
      content: [`🏣 ${hospitalName} (${hospitalPhone})`, ` ${hospitalAddress}`],
      message_type: "BOT",
      type: "map",
      timestamp: new Date(),
      hospitalName,
      hospitalAddress,
      hospitalPhone,
      latitude: hospitalLocationResult.latitude,
      longitude: hospitalLocationResult.longitude,
    });
    setInputMessage("");
    setIsTypingEffect(false);
    setUserInputDisabled(true);
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
    console.log('[chat-room-interface] After load Chat Room Interface');
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;

    const [_step, _messages] = flattenMessages(message);

    // 히스토리 챗 열람
    if (historyChat) {
      _messages.push({
        id: _messages[_messages.length - 1]['id'] + 1,
        content: '의료진과 상담이 가능한 병원 목록을 조회해드릴게요.' ,
        message_type: "BOT",
        timestamp: new Date(),
          type: "button-check",
          buttons: moveToSearchPageButton,
          buttonsCallback: [
              () => ``,
              () => ``,
          ],
          diseaseName: ((_content: string) => {
            const _diseaseName = _content.match(/\*\*(.*?)\*\*/);
            return _diseaseName ? _diseaseName[1] : null;
          })(_messages[_messages.length - 1]['content']),
      });

      //appendMessage(_messages);
      setMessages(_messages);
      //setUserInputDisabled(true);
    
    } else {

      setMessages(_messages);
      //appendMessage(_messages);

      setIsTypingEffect(showTyping);
      setUserInputDisabled(showTyping);

      const currentStep = _step ?? step;
      setMessageStep(currentStep);

      if (MESSAGE_SCENARIO[currentStep] === "evaluating" && _messages.length) {
        const last = _messages[_messages.length - 1];
        const content = Array.isArray(last.content) ? last.content.join("\n") : last.content;

        if (content) {
          (async () => {
            await showBotMessage(currentStep, content);
          })();
        }
      }
    }
  }, []);

  // 스크롤 이동
  useEffect(() => {
    const targetId = lastAppendedIdRef.current;
    if (!targetId) return;

    const el = messageRefs.current[targetId];
    if (el) {
      // 스크롤 컨테이너 기준으로 자연스럽게 이동
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    lastAppendedIdRef.current = null; // 한번 쓰고 비움
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
          {historyChat && showChatStartDate && (
            <div className="my-6 flex items-center text-[11px] text-gray-500">
              <div className="flex-1 border-t border-gray-300" />
              <div className="px-3 bg-emerald-50 whitespace-nowrap">
                {chatStartDate}
              </div>
              <div className="flex-1 border-t border-gray-300" />
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              ref={(el) => { messageRefs.current[message.id] = el; }}
              className={`flex ${message.message_type === "USER" ? "justify-end" : "justify-start"}`}
            >
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
                          disabled={userButtonDisabled}
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
                      {/* <div className="flex justify-center align-middle">
                        <Filter className="w-4 h-4" />
                        목록 정렬하기
                      </div> */}
                      <Button
                        size="sm"
                        variant="outline"
                        name='total'
                        className={`ml-2 cursor-pointer flex items-center gap-2 ${
                          (message.clickedType !== 'distance'
                            && message.clickedType !== 'equipment'
                            && message.clickedType !== 'department')
                            ? "bg-teal-500 text-white"
                            : "bg-transparent hover:bg-teal-500 hover:text-white"
                        }`}
                      >
                        <Star className="w-4 h-4" />
                        추천순 (거리, 장비, 진료과 종합점수)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        name='distance'
                        onClick={() => handleSortButtonClick(message, 'distance')}
                        className={`ml-2 cursor-pointer flex items-center gap-2 ${
                          message.clickedType === 'distance'
                            ? "bg-teal-500 text-white"
                            : "bg-transparent hover:bg-teal-500 hover:text-white"
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                        거리가 가까운 순
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        name='equipment'
                        onClick={() => handleSortButtonClick(message, 'equipment')}
                        className={`ml-2 cursor-pointer flex items-center gap-2 ${
                          message.clickedType === 'equipment'
                            ? "bg-teal-500 text-white"
                            : "bg-transparent hover:bg-teal-500 hover:text-white"
                        }`}
                      >
                        <Plug className="w-4 h-4" />
                        장비 매칭이 높은 순
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        name='department'
                        onClick={() => handleSortButtonClick(message, 'department')}
                        className={`ml-2 cursor-pointer flex items-center gap-2 ${
                          message.clickedType === 'department'
                            ? "bg-teal-500 text-white"
                            : "bg-transparent hover:bg-teal-500 hover:text-white"
                        }`}
                      >
                        <Activity className="w-4 h-4" />
                        진료과 매칭률이 높은 순
                      </Button>

                      {message.location.map((_locationItem: any) => (
                        <div
                          key={_locationItem.id ?? `${_locationItem.name}-${_locationItem.phone ?? ''}`}
                          className={`w-full p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                            'bg-blue-50 border-blue-200'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMapMessage(_locationItem);
                          }}
                          >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 w-full">
                              <div className="flex items-center gap-2">
                                <div className={`font-medium text-gray-900${_locationItem.name.length >= 11 ? ' flex-1 min-w-0 whitespace-nowrap text-ellipsis overflow-hidden' : ''}`}>{_locationItem.name}</div>
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
              placeholder={historyChat ? "MeDeviSe에게 새로운 증상을 문의해보세요." : "MeDeviSe에게 문의하세요."}
              className="flex-1 border-gray-200 focus:border-teal-400 focus:ring-emerald-400 rounded-xl"
              disabled={userInputDisabled}
              readOnly={userInputDisabled}
            />
            <Button
              onClick={handleSendMessage}
              disabled={userInputDisabled}
              className="cursor-pointer bg-teal-500 hover:bg-emerald-600 text-white rounded-xl px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
