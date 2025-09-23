"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

interface UserAccountFormProps {
  onClose: () => void
}

export function UserAccountForm({ onClose }: UserAccountFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
  })

  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] User account data:", formData)
    // Here you would typically send the data to your backend
    alert("Account created successfully! You can now contact healthcare providers.")
    onClose()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  return (
    <Card
      ref={cardRef}
      className="w-full max-w-md fixed z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: position.x === 0 && position.y === 0 ? "translate(-50%, -50%)" : "none",
        left: position.x === 0 ? "50%" : position.x,
        top: position.y === 0 ? "50%" : position.y,
      }}
    >
      <CardHeader className="cursor-grab active:cursor-grabbing select-none" onMouseDown={handleMouseDown}>
        <CardTitle className="flex items-center gap-2">
          <UserIcon />
          Create User Account
        </CardTitle>
        <CardDescription>Create an account to connect with healthcare providers</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="mt-1 focus:outline-none focus:ring-0 focus:border-input focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="mt-1 focus:outline-none focus:ring-0 focus:border-input focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <MailIcon />
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 focus:outline-none focus:ring-0 focus:border-input focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center gap-2">
              <PhoneIcon />
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="mt-1 focus:outline-none focus:ring-0 focus:border-input focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
              <CalendarIcon />
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
              className="mt-1 focus:outline-none focus:ring-0 focus:border-input focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPinIcon />
              Address
            </Label>
            <div className="flex mt-1">
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address..."
                required
                className="rounded-r-none focus:outline-none focus:ring-0 focus:border-input focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-l-none border-l-0 px-3 hover:bg-gray-50 bg-transparent"
                onClick={() => {
                  console.log("[v0] Address search clicked:", formData.address)
                  // Here you would implement address search/autocomplete functionality
                }}
              >
                <SearchIcon />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
            <Input
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              required
              className="mt-1 focus:outline-none focus:ring-0 focus:border-input focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
            <Input
              id="emergencyPhone"
              name="emergencyPhone"
              type="tel"
              value={formData.emergencyPhone}
              onChange={handleInputChange}
              required
              className="mt-1 focus:outline-none focus:ring-0 focus:border-input focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Create Account
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
