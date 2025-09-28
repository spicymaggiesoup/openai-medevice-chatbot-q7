"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";

import { useDisclosure } from "@chakra-ui/react";

import { type Address } from "react-daum-postcode";

import { User, Mail, Phone, Calendar, MapPin, Search } from "lucide-react"

import { useChatToken, useUserInfo, useUserLocationNew } from "@/lib/store";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select"
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

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showAddressPopover, setShowAddressPopover] = useState(false);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('콘솔 회원가입 :: ', formData);

    setIsLoading(true);

    try {
      // 회원가입
      const setAuthRegister = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          nickname: formData.nickName,
          age: Number(formData.age),
          gender: formData.gender,
          password: formData.password,
          road_address: formData.road_address,
          latitude: 0,
          longitude: 0,
        }),
      })
      const { detail } = await setAuthRegister.json();
      console.log('[user-account-form] User Location :: ', detail);

      if (detail && detail[0]['loc']) {
        
      }
    
      setIsLoading(false);

      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch(e) {
      console.error(e);
      setError(`회원가입 정보를 다시 확인해주세요.`);
    }
    
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
                <span className="text-red-500">*</span>
                아이디
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                <span className="text-red-500">*</span>
                비밀번호
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="nickName" className="flex items-center gap-2">
                <span className="text-red-500">*</span>
                성명/닉네임
              </Label>
              <Input
                id="nickName"
                name="nickName"
                value={formData.nickName}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
            <Label htmlFor="age" className="flex items-center gap-2">
              <span className="text-red-500">*</span>
              나이
            </Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full"
              required
            />
            </div>
            <div>
              <Label htmlFor="age" className="flex items-center gap-2">
                <span className="text-red-500">*</span>
                성별
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => {
                  console.log(value);

                  setFormData(prev => ({
                    ...prev,
                    gender: value,
                  }));
                }}
              >
                <SelectTrigger id="gender" variant="ghost">
                <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                <SelectGroup>
                    <SelectItem value="Male">남성</SelectItem>
                    <SelectItem value="Female">여성</SelectItem>
                </SelectGroup>
                </SelectContent>
            </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="road_address" className="flex items-center gap-2">
              <span className="text-red-500">*</span>
              주소
            </Label>
            <div className="flex mt-1">
              <Input
                id="road_address"
                name="road_address"
                value={formData.road_address}
                onChange={handleInputChange}
                className="w-full"
                required
              />
               <Popover open={showAddressPopover} onOpenChange={setShowAddressPopover}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="cursor-pointer px-3 bg-transparent hover:bg-teal-50"
                    onClick={() => setShowAddressPopover(true)}
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
                        setShowAddressPopover(false)
                    }}
                    onCompletePost={(data) => {
                      setFormData(prev => ({
                        ...prev,
                        road_address: data.roadAddress,
                      }));
                  
                      setShowAddressPopover(false);
                    }}
                  />
                </PopoverContent>
              </Popover> 
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}
            <Button
                type="submit"
                className="flex-1 bg-teal-500 hover:bg-teal-600 cursor-pointer"
                disabled={isLoading}
            >
                {isLoading ? (<span>가입 중...<span className="dots">...</span></span>) : (<span>가입하기</span>)}
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
