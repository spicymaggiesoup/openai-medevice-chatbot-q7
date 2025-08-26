"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MediBotLogo } from "@/components/medi-bot-logo"

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
    if (email === "admin" && password === "admin1234") {
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
      setError("Invalid credentials. Please use ID: admin, Password: admin1234")
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <MediBotLogo />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-foreground">Welcome to MediBot</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your trusted medical assistant. Please sign in to continue.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">User ID</Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your user ID"
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
              placeholder="Enter your password"
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
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button className="text-primary hover:underline">Contact your healthcare provider</button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
