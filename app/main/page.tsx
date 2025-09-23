"use client"

import { useState } from "react"
import Link from "next/link"
import MedicalTagButtons from "@/components/medical-tag-buttons"

export default function MainPage() {
  const [message, setMessage] = useState("")

  const handleTagClick = (condition: { id: number; name: string; description: string }) => {
    setMessage(`${condition.name}에 대해 알려주세요`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium">MediBot AI</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31 2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          {/* Central Message */}
          <div className="text-center mb-12">
            <h1 className="text-2xl font-normal text-gray-200 mb-8">How can I help you with your health today?</h1>
          </div>

          {/* Input Area */}
          <div className="relative mb-8">
            <div className="bg-gray-800 rounded-full border border-gray-700 flex items-center px-4 py-3 shadow-lg">
              {/* Plus Icon */}
              <button className="p-2 hover:bg-gray-700 rounded-full transition-colors mr-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>

              {/* Input Field */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message MediBot AI"
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-base"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    window.location.href = "/chat"
                  }
                }}
              />

              {/* Right Icons */}
              <div className="flex items-center space-x-2 ml-2">
                {/* Microphone Icon */}
                <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>

                {/* Send Icon */}
                <Link href="/chat">
                  <button
                    className={`p-2 rounded-full transition-colors ${
                      message.trim() ? "bg-white text-gray-900 hover:bg-gray-200" : "bg-gray-700 text-gray-400"
                    }`}
                    disabled={!message.trim()}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full max-w-2xl mx-auto">
            <MedicalTagButtons onTagClick={handleTagClick} variant="compact" className="mb-8" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm p-4">
        <p>MediBot AI can make mistakes. Check important info.</p>
      </footer>
    </div>
  )
}
