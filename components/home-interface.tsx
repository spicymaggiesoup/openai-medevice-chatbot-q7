"use client"

import React, { useState, useEffect, useRef, Suspense, lazy, useMemo, useCallback } from "react";

import { useRouter } from "next/navigation";

import { useChatToken, useUserInfo, useChatRoom } from "@/lib/store";

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MediLogo } from "@/components/img/medi-logo"
import { ProfileForm } from "@/components/profile-form"

import { IconMenu } from "@/components/icon/icon-menu"
import { IconSettings } from "@/components/icon/icon-settings"
import { chatInterfaceTemplate } from "@/lib/template"
import { LogOut, Activity, Clock, Hospital, Search } from "lucide-react"

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

export function HomeInterface() {
  // 기본은 Chat 화면
  type PageKey = "chat" | "history" | "hospital-list" | "search";
  const [currentPage, setCurrentPage] = useState<PageKey>("chat");
  
  // 컴포넌트 스플리팅
  const ChatInterface      = lazy(() => import("@/components/chat-interface").then(m => ({ default: m.ChatInterface })));
  const HistoryInterface   = lazy(() => import("@/components/chat-history-interface").then(m => ({ default: m.ChatHistoryInterface })));
  const HospitalList       = lazy(() => import("@/components/hospital-list-interface").then(m => ({ default: m.HospitalListInterface })));
  const SearchHospitals    = lazy(() => import("@/components/search-hospitals-interface").then(m => ({ default: m.SearchHospitalsInterface })));

  // 사용자정보
  const [age, setAge] = useState(useUserInfo((s) => s.age));
  const [gender, setGender] = useState(useUserInfo((s) => s.gender));
  const [nickname, setNickname] = useState(useUserInfo((s) => s.nickname));

  // 동작 관리
  const router = useRouter();
  const [isClosed, setIsClosed] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [showProfileForm, setShowProfileForm] = useState(false);

  // 사이드메뉴
  const sideMenu = [
    { page: "1", name: "가야할 병원 문의하기", icon: Hospital, className: 'chat' },
    // { page: "2", name: "과거 문의내역 보기", icon: Clock, className: 'history' },
    { page: "2", name: "병원 장비현황 보기", icon: Search, className: 'search' },
    //{ page: "4", name: "병원 기기찾기", icon: Search, className: 'search' },
  ];

  // 컴포넌트 매핑
  const pages = useMemo<Record<PageKey, React.ComponentType>>(
    () => ({
      "chat": ChatInterface,
      "history": HistoryInterface,
      "hospital-list": HospitalList,
      "search": SearchHospitals,
    }),
    []
  );

  // 페이지 컴포넌트
  const PageComponent = pages[currentPage] ?? ChatInterface;

  // 창크기 확인
  const handleInnerSize = () => window.innerWidth <= 768;

  // 토큰
  // const token = useChatToken((s) => s.chatToken);

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
            <Popover open={showProfileForm} onOpenChange={setShowProfileForm}>
              <PopoverTrigger asChild>
                <div onClick={() => setShowProfileForm(true)} className="cursor-pointer">
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

      <div className="flex flex-1 min-h-0 relative">{/* relative: 모바일 absolute 사이드바 기준점 */}
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-gray-200 overflow-hidden
                      transition-[width] duration-500 ease-in-out
                      ${isClosed ? `w-0 opacity-0` : `w-80 opacity-100${handleInnerSize() ? ' h-full absolute left-0 top-0' : ''}`}`}
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
        {/* <main className="page-container flex-1 flex flex-col min-h-0 h-dvh"> */}
        <main className="page-container flex-1 flex flex-col min-h-0 overflow-hidden">
          <Suspense fallback={<div className="p-6 text-gray-500">로딩 중…</div>}>
            <PageComponent />
          </Suspense>
        </main>
      </div>
    </div>
  );


  // return (
  //   <div className="flex w-full h-dvh">
  //     <div
  //         className={`bg-white border-r border-gray-200 overflow-hidden
  //                   transition-[width] duration-500 ease-in-out
  //                   ${isClosed ? `w-0 opacity-0` : `w-80 opacity-100${handleInnerSize() ? ' h-full absolute' : ''}`}`}
  //         aria-hidden={isClosed}
  //       >
        
  //       {/* HEADER */}
  //       <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-20">
  //         <div className="flex items-center justify-between">
  //           <div className="flex items-center gap-3">
  //             <div
  //               className="w-10 h-10 flex items-center justify-center cursor-pointer"
  //               onClick={() => handleSideMenuToggle()}
  //             >
  //               <IconMenu />
  //             </div>
  //           </div>

  //           <div className="flex items-center gap-4">
  //             <Popover open={showProfileForm} onOpenChange={setShowProfileForm}>
  //               <PopoverTrigger asChild>
  //                 <div onClick={() => setShowProfileForm(true)} className="cursor-pointer">
  //                   <IconSettings />
  //                 </div>
  //               </PopoverTrigger>
  //               <PopoverContent
  //                 className="w-96 p-0 max-h-96 overflow-y-auto"
  //                 align="center"
  //                 side="top"
  //                 sideOffset={15}
  //                 onOpenAutoFocus={(e) => e.preventDefault()}
  //                 onCloseAutoFocus={(e) => e.preventDefault()}
  //               >
  //                 <ProfileForm onClose={() => setShowProfileForm(false)} />
  //               </PopoverContent>
  //             </Popover>

  //             <span className="flex items-center gap-2 mt-1 text-sm bg-green-100 text-gray-700 px-3 py-1 rounded-full">
  //               <div>{nickname}</div>
  //               <div>{age}세</div>
  //               <div className="flex items-center gap-2">
  //                 <div>{gender === "Male" ? "남성" : "여성"}</div>
  //                 <div className={`w-2 h-2 rounded-full ${gender === "Male" ? "bg-blue-500" : "bg-red-500"}`} />
  //               </div>
  //             </span>

  //             <Button
  //               variant="outline"
  //               size="sm"
  //               onClick={handleLogout}
  //               className="cursor-pointer flex items-center gap-2 bg-transparent hover:bg-teal-500 hover:text-white"
  //             >
  //               <LogOut className="w-4 h-4" />
  //               Logout
  //             </Button>
  //           </div>
  //         </div>
  //       </header>

  //       {/* 🔹 Body Row: Sidebar + Main */}
  //   <div className="flex flex-1 min-h-0 relative">{/* relative: 모바일 absolute 사이드바 기준점 */}
  //     {/* Sidebar */}
  //     <aside
  //       className={`bg-white border-r border-gray-200 overflow-hidden
  //                   transition-[width] duration-500 ease-in-out
  //                   ${isClosed ? `w-0 opacity-0` : `w-80 opacity-100${handleInnerSize() ? ' h-full absolute left-0 top-0' : ''}`}`}
  //       aria-hidden={isClosed}
  //     >
  //       {/* Sidebar Header + Nav */}
  //       <div className={`h-full transition-opacity duration-500 ${isClosed ? 'opacity-0' : 'opacity-100'}`}>
  //         {/* Sidebar Header (그대로 유지) */}
  //         <div className="p-6">
  //           <div className="flex items-center gap-3">
  //             <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
  //               <div className="w-10 h-9 text-white">
  //                 <MediLogo />
  //               </div>
  //             </div>
  //             <h1 className="text-2xl font-bold text-gray-900">MeDeviSe</h1>
  //           </div>
  //         </div>

  //         {/* Navigation */}
  //         <div className="flex-1 p-4">
  //           <nav className="space-y-2">
  //             {sideMenu.map((item) => (
  //               <button
  //                 key={item.page}
  //                 onClick={() => {
  //                   setActiveTab(item.page);
  //                   clickSideMenu(item.className as PageKey);
  //                 }}
  //                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
  //                   activeTab === item.page ? "bg-green-50 text-teal-900 font-medium" : "text-gray-700 hover:bg-gray-50"
  //                 } ${item.className}`}
  //               >
  //                 <item.icon className="w-5 h-5" />
  //                 {item.name}
  //               </button>
  //             ))}
  //           </nav>
  //         </div>
  //       </div>
  //     </aside>

  //     {/* Main (page-container) */}
  //     <main className="page-container flex-1 flex flex-col min-h-0">
  //       <Suspense fallback={<div className="p-6 text-gray-500">로딩 중…</div>}>
  //         <PageComponent />
  //       </Suspense>
  //     </main>

  //     {/* Main Chat Area
  //     <div
  //       className="page-container flex-1 flex flex-col min-h-0">
  //       <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
  //         <div className="flex items-center justify-between">
  //           <div className="flex items-center gap-3">
  //             <div
  //               className="w-10 h-10 flex items-center justify-center cursor-pointer"
  //               onClick={() => handleSideMenuToggle()}
  //             >
  //               <IconMenu />
  //             </div>
  //           </div>

  //           <div className="flex items-center gap-4">
  //             <Popover open={showProfileForm} onOpenChange={setShowProfileForm}>
  //               <PopoverTrigger asChild>
  //                 <div
  //                   onClick={() => setShowProfileForm(true)}
  //                   className="cursor-pointer"
  //                 >
  //                   <IconSettings />
  //                 </div>
  //               </PopoverTrigger>
  //               <PopoverContent
  //                 className="w-96 p-0 max-h-96 overflow-y-auto"
  //                 align="center"
  //                 side="top"
  //                 sideOffset={15}
  //                 onOpenAutoFocus={(e) => e.preventDefault()}
  //                 onCloseAutoFocus={(e) => e.preventDefault()}
  //               >
  //                 <ProfileForm onClose={() => setShowProfileForm(false)} />
  //               </PopoverContent>
  //             </Popover>

  //             <span className="flex items-center gap-2 mt-1 text-sm bg-green-100 text-gray-700 px-3 py-1 rounded-full">
  //               <div>{nickname}</div>
  //               <div>{age}세 </div>
  //               <div className="flex items-center gap-2">
  //                 <div>{gender === "Male" ? "남성" : "여성"} </div>
  //                 <div className={`w-2 h-2 rounded-full ${gender === "Male" ? "bg-blue-500" : "bg-red-500"}`} />
  //               </div>
  //             </span>

  //             <Button
  //               variant="outline"
  //               size="sm"
  //               onClick={handleLogout}
  //               className="cursor-pointer flex items-center gap-2 bg-transparent hover:bg-teal-500 hover:text-white"
  //             >
  //               <LogOut className="w-4 h-4" />
  //               Logout
  //             </Button>
  //           </div>
  //         </div>
  //       </header>
  //       <Suspense fallback={<div className="p-6 text-gray-500">로딩 중…</div>}>
  //         <PageComponent />
  //       </Suspense>
  //     </div>*/}
  //   </div>
  // );
}
