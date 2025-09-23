"use client"

import { useState } from "react"
import Link from "next/link"

export default function ProjectsPage() {
  const [chatHistory] = useState([
    {
      id: 1,
      title: "테스트 타이틀1",
      preview: "어... 물... 맞아야 아직 시도 전이에요",
      date: "Sep 22",
    },
    {
      id: 2,
      title: "테스트 타이틀2",
      preview: "주류물터를 잡암 안을어주니까 온신저에 쏙 숨어서 정대 나오질 않다. 컬터를 틀어서 주류가 생기나가 올...",
      date: "Sep 5",
    },
  ])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium">ChatGPT</span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Project Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 1v6m8-6H4m8 0H4" />
              </svg>
            </div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">압시수시</h1>
          </div>
          <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Add files
          </button>
        </div>

        {/* New Chat Button */}
        <Link href="/chat">
          <button className="w-full mb-6 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-3 text-left">
            <div className="w-6 h-6 border border-gray-400 dark:border-gray-500 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4m8 0H4" />
              </svg>
            </div>
            <span className="text-gray-600 dark:text-gray-400">New chat in 압시수시</span>
            <div className="ml-auto flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </button>
            </div>
          </button>
        </Link>

        {/* Chat History */}
        <div className="space-y-3">
          {chatHistory.map((chat) => (
            <Link key={chat.id} href="/chat">
              <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-500">
                      {chat.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{chat.preview}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500 ml-4 flex-shrink-0">{chat.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
