"use client"

import React, { useState, useEffect, useRef, Suspense, lazy, useMemo } from "react";

// 상단 import 추가
import { useRouter } from "next/navigation";

import { useUserInfo } from "@/lib/store";

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MediLogo } from "@/components/img/medi-logo"
import { ProfileForm } from "@/components/profile-form"

import { IconMenu } from "@/components/icon/icon-menu"
import { IconSettings } from "@/components/icon/icon-settings"
import { LogOut, Hospital, Search } from "lucide-react"

// 컴포넌트 스플리팅
const ChatInterface      = lazy(() => import("@/components/chat-interface").then(m => ({ default: m.ChatInterface })));

type PageKey = "chat" | "search";

type ChildPageProps = {
  navigate: (page: PageKey) => void;
  currentPage: PageKey;
  sendParams: any;
};

export function HomeInterface() {
  // 기본은 Chat 화면
  const [currentPage, setCurrentPage] = useState<PageKey>("chat");
  
  const router = useRouter();
  
  // 사용자정보
  const [age] = useState(useUserInfo((s) => s.age));
  const [gender] = useState(useUserInfo((s) => s.gender));
  const [nickname] = useState(useUserInfo((s) => s.nickname));

  // 동작 관리
  const [isClosed, setIsClosed] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [showProfileForm, setShowProfileForm] = useState(false);

  const [sendParams, setSendParams] = useState({});

  // 사이드메뉴
  const sideMenu = [
    { page: "1", name: "가야할 병원 문의하기", icon: Hospital, className: 'chat' },
    { page: "2", name: "병원 장비현황 보기", icon: Search, className: 'search' },
  ];

  const pages = useMemo<
    Record<PageKey, React.LazyExoticComponent<React.ComponentType<ChildPageProps>>>
  >(() => ({
    chat:   lazy(() => import("@/components/chat-interface").then(m => ({ default: m.ChatInterface }))),
    search: lazy(() => import("@/components/search-hospitals-interface").then(m => ({ default: m.SearchHospitalsInterface }))),
  }), []);

  // 페이지 컴포넌트
  const PageComponent = pages[currentPage] ?? ChatInterface;

  // 창크기 확인
  const handleInnerSize = () => window.innerWidth <= 768;

  // 로그아웃 버튼 클릭
  const handleLogout = async() => {
    const getAuthResponse = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const { message } = await getAuthResponse.json();

    console.log('[home-interface] Logout Message :: ', message);

    router.replace('/');
  };

  // 사이드메뉴 열기/닫기 상태설정
  const handleSideMenuToggle = () => {
    setIsClosed(!isClosed);
  };
  
  // 사이드메뉴 클릭
  const clickSideMenu = async(pageKey: PageKey) => {
    console.log('[home-interface] activeTab : ', pageKey);
    
    // URL 이동 대신 내부 상태만 변경
    setCurrentPage(pageKey);
    // 모바일일 때 메뉴 자동 닫기 등 UX 보완
    if (handleInnerSize()) setIsClosed(true);
  };

  // navigate 콜백 (메뉴 상태도 함께 정리하면 UX↑)
  const navigate = (page: PageKey) => {
    setCurrentPage(page);
    setActiveTab(page === "search" ? "2" : "1");
    if (handleInnerSize()) {
      setIsClosed(true);
    }
  };
 
  // 로그인 chatrooms 조회 & 생성
  useEffect(() => {
    // 화면크기 감지 후 반응
    if (window.matchMedia('(min-width: 768px)').matches) {
      setTimeout(() => {
        setIsClosed(false);
      });
    }
  }, []);

  return (
    <div className="flex w-full h-dvh flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center cursor-pointer"
              onClick={() => handleSideMenuToggle()}
            >
              <IconMenu />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Popover
              open={showProfileForm}
              onOpenChange={setShowProfileForm}
            >
              <PopoverTrigger asChild>
                <div
                  onClick={() => setShowProfileForm(true)}
                  className="cursor-pointer"
                >
                  <IconSettings />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-96 p-0 max-h-96 overflow-y-auto"
                align="center"
                side="top"
                sideOffset={15}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <ProfileForm onClose={() => setShowProfileForm(false)} />
              </PopoverContent>
            </Popover>

            <span className="flex items-center gap-2 mt-1 text-sm bg-green-100 text-gray-700 px-3 py-1 rounded-full">
              <div>{nickname}</div>
              <div>{age}세</div>
              <div className="flex items-center gap-2">
                <div>{gender === "Male" ? "남성" : "여성"}</div>
                <div className={`w-2 h-2 rounded-full ${gender === "Male" ? "bg-blue-500" : "bg-red-500"}`} />
              </div>
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="cursor-pointer flex items-center gap-2 bg-transparent hover:bg-teal-500 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 relative">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-gray-200 overflow-hidden
                      transition-[width] duration-500 ease-in-out
                      ${isClosed
                        ? `w-0 opacity-0`
                        : `w-80 opacity-100${
                            handleInnerSize()
                              ? ' h-full absolute left-0 top-0 z-40 shadow-lg'
                              : ''
                          }`
                      }`}
          aria-hidden={isClosed}
        >
          {/* Sidebar Header + Nav */}
          <div className={`h-full transition-opacity duration-500 ${isClosed ? 'opacity-0' : 'opacity-100'}`}>
            {/* Logo */}
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <div className="w-10 h-9 text-white">
                    <MediLogo />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">MeDeviSe</h1>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                {sideMenu.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => {
                      setActiveTab(item.page);
                      clickSideMenu(item.className as PageKey);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                      activeTab === item.page ? "bg-green-50 text-teal-900 font-medium" : "text-gray-700 hover:bg-gray-50"
                    } ${item.className}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main (page-container) */}
        <main className="page-container flex-1 flex flex-col min-h-0 overflow-hidden">
          <Suspense>
            <PageComponent
              key={currentPage}
              navigate={navigate}
              currentPage={currentPage}
              sendParams={sendParams}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
