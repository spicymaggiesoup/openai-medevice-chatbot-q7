"use client"

import type React from "react"
import type { MouseEvent } from "react"
import { useState, useEffect, useRef } from "react"

import { redirect } from "next/navigation";
import { useChatToken } from "@/lib/store";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MediBot } from "@/components/medi-bot"
import { MediLogo } from "@/components/medi-logo"
import { IconMenu } from "@/components/icon-menu"
import { IconSettings } from "@/components/icon-settings"
import { MapLayout } from "@/components/map-layout"
import { messageScenario } from "@/lib/template"
import { Send, LogOut, Home, Activity, Clock, Plus } from "lucide-react"

interface Message {
  id: string
  content: string[]
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "button-check" | "map"
  buttons?: string[]
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: ["안녕하세요? 불편한 증상을 말씀해주세요. 😊"],
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeTyping, setActiveTyping] = useState(false)
  const [isClosed, setIsClosed] = useState(true)
  const [activeTab, setActiveTab] = useState("증상 문의")
  const [showMap, setShowMap] = useState(false)

  const [age, setAge] = useState("73")
  const [sex, setSex] = useState("남성")
  const [patName, setPatName] = useState("김환자")

  const [symptomsQ, setSymptomsQ] = useState(0)
  const [symptomsA, setSymptomsA] = useState(0)
  const [searchQ, setSearchQ] = useState(0)
  const [searchA, setSearchA] = useState(0)
  const [rooms, setRooms] = useState<any>(null);
  const typingRef = useRef(null);

  const token = useChatToken((s) => s.chatToken);

  const handleInnerSize = () => window.innerWidth <= 768;

  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      setTimeout(() => {
        setIsClosed(false);
      });
    }

    let cancelled = false;
    if (!token) {
      redirect("/");
    }

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
          console.log("[chat-interface] chatroom status", chatRooms);
          setRooms(chatRooms);
        }
    
      } catch (err) {
        console.error("로그인불가");
        redirect("/");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: [inputMessage],
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)
    setActiveTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botMessage: any = Object.assign(messageScenario.bot.symptoms.A[symptomsA], {
        id: Date.now().toString()
      });

      setSymptomsA(symptomsA + 1);
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
      setActiveTyping(false)
    }, 1500)
  }

  const handleButtonClick = (_message: string) => {
    const userMessage: Message = {
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
          setActiveTyping(false);
          return messageScenario.bot.search.Q[searchQ];
        }

        if (_message.includes('아니요')) {
          setActiveTyping(false);
          return messageScenario.bot.search.A[searchA];
        }

        return Object.assign(userMessage, {
          content: ['버튼을 선택해주세요! 🙌']
        });
      };

      // Simulate bot response
      setTimeout(() => {
        const botMessage: any = Object.assign(getReplyMessage(), {
            id: Date.now().toString()
        });

        setIsTyping(false)
        setSymptomsA(searchQ + 1);
        setMessages((prev) => [...prev, botMessage])
    }, 1500);
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  const handleSideMenuBackground = (e: MouseEvent<HTMLDivElement>) => {
    if (e?.currentTarget.className.indexOf('chat-container') > -1) {
      setIsClosed(true);
    }
  }

  const handleSideMenu = () => {
    setIsClosed(!isClosed);
  }

  const handleLocationRequest = () => {
    setShowMap(true)
    const locationMessage: Message = {
      id: Date.now().toString(),
      content:
        ["I've found some nearby healthcare facilities for you. You can view them on the map below and get directions to any of them."],
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    }
    setMessages((prev) => [...prev, locationMessage])
  }

  const handleManageInfo = () => {

  }

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
              <h1 className="text-2xl font-bold text-gray-900">MediBot</h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {[
                //{ name: "Chat", icon: Home },
                { name: "증상 문의", icon: Activity, className: '' },
                { name: "과거 내역", icon: Clock, className: '' },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  //w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors bg-teal-50 text-teal-700 font-medium
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.name ? "bg-green-50 text-teal-900 font-medium" : "text-gray-700 hover:bg-gray-50"
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
                onClick={() => handleSideMenu()}
              >
                <IconMenu />
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* <span className="flex items-center gap-2 mt-1 text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full"> */}
              <span
                 onClick={handleManageInfo}
                className="cursor-pointer flex items-center gap-2 mt-1 text-sm bg-green-100 text-gray-700 px-3 py-1 rounded-full"
              >
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full bg-${sex === "여성" ? "red" : "blue"}-500`}></div>
                  <div>{sex} </div>
                </div>
                <div>{age}세 </div>
                <div>{patName}</div>
                {/*<div
                  onClick={handleManageInfo}
                  className="cursor-pointer"
                >
                   <IconSettings /> 
                </div>*/}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-transparent hover:bg-teal-500 hover:text-white"
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
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-md ${message.sender === "user" ? "" : "w-full max-w-2xl"}`}>
                  {/* bot answer */}
                  {
                    message.sender === "bot" && (
                      <div className="flex items-center gap-2 mb-2">
                        {/* <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center"> */}
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          {/* <div className="w-5 h-5 text-blue-600"> */}
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
                    {message.content.map((_message, order) => (
                      <p className="leading-relaxed" key={`${order}_${new Date().getMilliseconds()}`}>{_message}</p>
                    ))}

                    {message.type === "button-check" && message.buttons && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {message.buttons.map((_button) => (
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
            ))}
            
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
                placeholder="MediBot에게 물어보세요!"
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
