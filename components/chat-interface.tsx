"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MediBot } from "@/components/medi-bot"
import { MediLogo } from "@/components/medi-logo"
import { Send, LogOut, Home, Activity, Clock, Plus } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "symptom-check" | "advice"
  symptoms?: string[]
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "안녕하세요? 불편한 증상을 말씀해주세요. 😊",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
    {
      id: "2",
      content: "최근에 기침이 잦아졌어요.",
      sender: "user",
      timestamp: new Date(),
      type: "text",
    },
    // {
    //   id: "3",
    //   content:
    //     "Coughing can have many causes, such as a cold, flu, or allergies. Are you experiencing any of the following symptoms",
    //   sender: "bot",
    //   timestamp: new Date(),
    //   type: "symptom-check",
    //   symptoms: ["Sore throat", "Fever", "Shortness of breath"],
    // },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState("Home")

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your concern. Let me help you with that.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSymptomClick = (symptom: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: symptom,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
  }

  const handleLogout = () => {
    window.location.href = "/"
  }

  return (
    <div className="flex w-full h-screen">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 text-white">
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
              { name: "증상 문의", icon: Activity },
              { name: "과거 내역", icon: Clock },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.name ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 text-blue-600">
                  <MediBot />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full">김환자</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-md ${message.sender === "user" ? "" : "w-full max-w-2xl"}`}>
                  {message.sender === "bot" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-5 h-5 text-blue-600">
                          <MediBot />
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl ${
                      message.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-white text-gray-800 shadow-sm"
                    }`}
                  >
                    <p className="leading-relaxed">{message.content}</p>

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
                </div>
              </div>
            ))}

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

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 text-blue-600">
                      <MediLogo />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"
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
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl"
                disabled={isTyping}
              />
              <Button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6"
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
