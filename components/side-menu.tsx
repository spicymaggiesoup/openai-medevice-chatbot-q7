"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MediBot } from "@/components/medi-bot"
import { MediLogo } from "@/components/medi-logo"
import { IconMenu } from "@/components/icon-menu"
import { Send, LogOut, Home, Activity, Clock, Plus } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "symptom-check" | "advice"
  symptoms?: string[]
}

export function SideMenu() {
  const [isClosed, setIsClosed] = useState(false)
  const [activeTab, setActiveTab] = useState("Home")

  return (
    <div className="flex w-full h-screen">
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${!isClosed ? "-translate-x-full" : "translate-x-0"}`}
        >
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
    </div>
  )
}
