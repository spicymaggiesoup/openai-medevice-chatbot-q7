"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MediLogo } from "@/components/medi-logo"
import { MapLayout } from "@/components/map-layout"
import { UserAccountForm } from "@/components/user-account-form"
import { io, type Socket } from "socket.io-client"

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
)

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
)

const ActivityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
)

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "symptom-check" | "advice"
  symptoms?: string[]
}

export function ChatInterface() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [hasStartedConversation, setHasStartedConversation] = useState(false)
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState("Home")
  const [isConnected, setIsConnected] = useState(false)
  const [showAccountForm, setShowAccountForm] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const socketInstance = io({
      path: "/api/socket",
    })

    socketInstance.on("connect", () => {
      console.log("[v0] Connected to server")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("[v0] Disconnected from server")
      setIsConnected(false)
    })

    socketInstance.on("receive_message", (message: Message) => {
      console.log("[v0] Message received:", message)
      setMessages((prev) => [...prev, message])
      setIsTyping(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || !socket) return

    if (!hasStartedConversation) {
      setHasStartedConversation(true)
    }

    const messageData = {
      content: inputMessage,
      sender: "user",
      type: "text",
    }

    socket.emit("send_message", messageData)
    setInputMessage("")
    setIsTyping(true)
  }

  const handleSymptomClick = (symptom: string) => {
    if (!socket) return

    const messageData = {
      content: symptom,
      sender: "user",
      type: "text",
    }

    socket.emit("send_message", messageData)
    setIsTyping(true)
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  const handleLocationRequest = () => {
    setShowMap(true)
    const locationMessage: Message = {
      id: Date.now().toString(),
      content:
        "I've found some nearby healthcare facilities for you. You can view them on the map below and get directions to any of them.",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    }
    setMessages((prev) => [...prev, locationMessage])
  }

  const handleAccountRedirect = () => {
    setShowAccountForm(true)
  }

  return (
    <div className="flex w-full h-screen">
      {hasStartedConversation && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col sidebar-animate">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                <div className="w-8 h-8 text-white">
                  <MediLogo />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">Chatbot</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-teal-500" : "bg-red-500"}`} />
                  <span className="text-xs text-gray-500">{isConnected ? "Connected" : "Disconnected"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {[
                { name: "Home", icon: HomeIcon },
                { name: "Symptoms", icon: ActivityIcon },
                { name: "History", icon: ClockIcon },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.name ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {hasStartedConversation && (
          <div className="bg-white border-b border-gray-200 p-4 header-animate">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 text-teal-600">
                    <MediLogo />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full">oretangd</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <LogOutIcon />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}

        {!hasStartedConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white px-6 centered-input-container">
            <div className="w-full max-w-2xl">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-light mb-4">오늘의 어젠다는 무엇인가요?</h1>
              </div>

              <form onSubmit={handleSendMessage} className="relative">
                <div className="relative flex items-center bg-gray-800 rounded-full border border-gray-700 focus-within:border-gray-600 transition-all duration-300">
                  <button
                    type="button"
                    className="absolute left-4 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <PlusIcon />
                  </button>
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 bg-transparent border-none text-white placeholder-gray-400 pl-16 pr-20 py-4 text-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                  />
                  <div className="absolute right-4 flex items-center gap-2">
                    <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                      </svg>
                    </button>
                    <Button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="bg-white text-gray-900 hover:bg-gray-100 rounded-full p-2 w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 chat-messages-container">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-md ${message.sender === "user" ? "" : "w-full max-w-2xl"}`}>
                      {message.sender === "bot" && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                            <div className="w-5 h-5 text-teal-600">
                              <MediLogo />
                            </div>
                          </div>
                        </div>
                      )}

                      {message.sender === "user" ? (
                        <div className="bg-teal-500 text-white p-4 rounded-2xl ml-auto">
                          <p className="leading-relaxed text-white">{message.content}</p>
                        </div>
                      ) : (
                        <div className="bg-white text-gray-800 shadow-sm p-4 rounded-2xl">
                          <p className="leading-relaxed text-gray-800">{message.content}</p>
                          {message.type === "symptom-check" && message.symptoms && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {message.symptoms.map((symptom) => (
                                <Button
                                  key={symptom}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSymptomClick(symptom)}
                                  className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                >
                                  {symptom}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {showMap && (
                  <div className="w-full">
                    <MapLayout
                      userLocation={{ lat: 40.7128, lng: -74.006 }}
                      onLocationSelect={(facility: any) => {
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
                )}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <div className="w-5 h-5 text-teal-600">
                          <MediLogo />
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-teal-300 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-teal-300 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-teal-300 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="bg-white border-t border-gray-200 p-4 chat-input-container">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border-gray-200 focus:border-teal-400 focus:ring-teal-400 rounded-xl focus-visible:outline-none focus-visible:ring-0"
                    disabled={isTyping || !isConnected}
                  />
                  <Button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping || !isConnected}
                    className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-6"
                  >
                    <SendIcon />
                  </Button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>

      {showAccountForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            {/* <UserAccountForm /> */}
            <button
              onClick={() => setShowAccountForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
