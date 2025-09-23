"use client"
import { MediBotLogo } from "@/components/medi-bot-logo"
import { Button } from "@/components/ui/button"

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

const TablesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h4m6 0h10" />
  </svg>
)

const ProjectsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    <path d="M8 1v6m8-6v6" />
  </svg>
)

interface ChatNavigationProps {
  isConnected: boolean
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function ChatNavigation({ isConnected, activeTab, setActiveTab }: ChatNavigationProps) {
  const handleLogout = () => {
    window.location.href = "/"
  }

  return (
    <>
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col sidebar-animate">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 text-white">
                <MediBotLogo />
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
              { name: "Tables", icon: TablesIcon },
              { name: "Projects", icon: ProjectsIcon },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.name === "Tables") {
                    window.location.href = "/tables"
                  } else if (item.name === "Projects") {
                    window.location.href = "/projects"
                  } else {
                    setActiveTab(item.name)
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.name ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.icon()}
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 header-animate">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 text-teal-600">
                <MediBotLogo />
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
    </>
  )
}
