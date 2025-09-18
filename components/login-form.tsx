"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { useChatToken, useUserInfo, useUserLocationNew } from "@/lib/store";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MediLogo } from "@/components/medi-logo"
import { UserAccountForm } from "@/components/user-account-form"
import { HomeInterface } from "@/components/home-interface"

export function LoginForm() {
  const [email, setEmail] = useState("test1@test.com");
  const [password, setPassword] = useState("test1234");
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    if (!email.length || !password.length!) {
      setError(`아이디나 비밀번호를 다시 확인해주세요.`);
    }

    const getAuthResponse = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    try {
      const {
        user,
        token_type,
        access_token,
      } = await getAuthResponse.json();

      console.log('[login-form] Login Info :: ', user);

      // 토큰 상태관리
      useChatToken.getState().setChatToken(`${access_token}`);

      // 사용자 정보 저장
      useUserInfo.getState().setNickname(`${user.nickname}`);
      useUserInfo.getState().setEmail(`${user.email}`);
      useUserInfo.getState().setPassword(`${password}`);
      useUserInfo.getState().setAge(`${user.age}`);
      useUserInfo.getState().setGender(`${user.gender}`);
      useUserInfo.getState().setLocation(`${user.location}`);
      useUserInfo.getState().setAddress(`${user.road_address}` || '');

      useUserInfo.getState().setLatitude(user.latitude || '');
      useUserInfo.getState().setLongitude(user.longitude || '');

      // Store login state (simple localStorage for demo)
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", user.id);

      // chat 이동
      router.push("/chat");
      //router.push("/home");

      setIsLoading(false);

    } catch(e) {
      setError(`계정정보가 잘못되었습니다. 아이디와 비밀번호를 다시 확인해주세요. ID: ${email}, Password: ${password}`)
      setIsLoading(false);

      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  };

  const handleCreateAccountPopup = async (e: React.FormEvent) => {
    setShowAccountForm(true);
  };

  const handleKakaoLogIn = async (e: React.FormEvent) => {
    
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center mb-0">
          <MediLogo />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-foreground">MeDeviSe</CardTitle>
          <CardDescription className="text-muted-foreground">
            당신의 건강 보조도우미
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">ID</Label>
            <Input
              id="email"
              type="text"
              placeholder="아이디를 입력하세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}
          <Button
            type="submit"
            className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (<span>로그인 중<span className="dots">...</span></span>) : (<span>로그인</span>)}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            계정이 없으면{" "}
            {/* <button 
              onClick={handleKakaoLogIn}
              className="cursor-pointer text-green-700 hover:font-semibold"
            >카카오톡 로그인을 진행하세요.
            </button> */}
            <button 
              onClick={handleCreateAccountPopup}
              className="cursor-pointer text-green-700 hover:font-semibold"
            >회원가입을 진행하세요.
            </button>
          </p>
        </div>
        <AnimatePresence>
          {showAccountForm && (
            <motion.div
              {...({
                className:
                  "fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-6",
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.5 },
              } as any)}
            >
              <motion.div
                {...({
                  className: "relative",
                  initial: { scale: 0.95, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  exit: { scale: 0.95, opacity: 0 },
                  transition: { duration: 0.5 },
                } as any)}
              >
                <UserAccountForm 
                  onClose={() => {
                    setShowAccountForm(false)
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
