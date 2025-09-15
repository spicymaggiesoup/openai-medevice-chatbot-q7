"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { useDisclosure } from "@chakra-ui/react";

import { type Address } from "react-daum-postcode";

import { User, Mail, Phone, Calendar, MapPin, Search } from "lucide-react"

import { useChatToken, useUserInfo, useUserLocationNew } from "@/lib/store";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { PostcodeLayout } from "@/components/postcode-layout"

interface UserAccountFormProps {
  onClose: () => void
}

export function UserAccountForm({ onClose }: UserAccountFormProps) {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    gender: '',
    age: '',
    nickName: '',
    road_address: '',
    latitude: 0,
    longitude: 0,
  });

  const [showDetailAddressInput, setShowDetailAddressInput] = useState(false);

  const {
    isOpen: isSearchAddressOpen,
    onOpen: onSearchAddressOpen,
    onClose: onSearchAddressClose,
  } = useDisclosure();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 회원가입
    const r = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        nickname: formData.nickName,
        age: formData.age,
        gender: formData.gender,
        password: formData.password,
        road_address: formData.road_address,
        latitude: 0,
        longitude: 0,
      }),
    })
    const userLocation = await r.json()
    console.log('[user-account-form] User Location :: ', userLocation);

    useUserInfo.getState().setLatitude(userLocation.latitude || '');
    useUserInfo.getState().setLongitude(userLocation.longitude || '');

  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-teal-500" />
          회원 가입
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                아이디
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                비밀번호
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nickName" className="flex items-center gap-2">성명/닉네임</Label>
              <Input
                id="nickName"
                name="nickName"
                value={formData.nickName}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
            <Label htmlFor="age" className="flex items-center gap-2">
              나이
            </Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full"
            />
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="flex items-center gap-2">
              주소
            </Label>
            <div className="flex mt-1">
              <Input
                id="address"
                name="address"
                onChange={handleInputChange}
                className="w-full"
              />
               <Popover open={showDetailAddressInput} onOpenChange={setShowDetailAddressInput}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="cursor-pointer px-3 bg-transparent hover:bg-teal-50"
                    onClick={onSearchAddressOpen}
                  >
                  <Search className="w-4 h-4" />
                </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full overflow-y-auto rounded-none border-gray-100"
                  align="end"
                  side="top"
                  sideOffset={0}
                  >
                  <PostcodeLayout
                    onClose={() => {
                      setShowDetailAddressInput(false)
                    }}
                  />
                </PopoverContent>
              </Popover> 
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 cursor-pointer w-full bg-emerald-600 hover:bg-emerald/90 text-primary-foreground"
            >
              가입하기
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent hover:bg-gray-200 cursor-pointer"
              onClick={onClose}
            >
              돌아가기
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
