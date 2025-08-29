"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MediLogo } from "@/components/medi-logo"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Check for admin credentials
    if ((email === "admin" && password === "admin1234") || (email === "test1@test.com" && password === "test1234")) {
      const res = await fetch("/api/users");
      const data = await res.json();
      console.log("login-form data::: ", data);
      
      // Simulate authentication delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store login state (simple localStorage for demo)
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userId", "admin")

      // Redirect to chat
      window.location.href = "/chat"
    } else {
      // Show error for invalid credentials
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setError(`계정정보가 잘못되었습니다. 아이디와 비밀번호를 다시 확인해주세요. ID: ${email}, Password: ${password}`)
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center mb-0">
          <MediLogo />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-foreground">MediBot</CardTitle>
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
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            계정이 없으면{" "}
            <button className="text-primary hover:underline">회원가입을 진행하세요.</button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
