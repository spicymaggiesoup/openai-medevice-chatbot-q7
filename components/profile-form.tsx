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
import { Modal } from "@/components/ui/modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { PostcodeLayout } from "@/components/postcode-layout"

interface ProfileFormProps {
  onClose: () => void
}

export function ProfileForm({ onClose }: ProfileFormProps) {
  //const handleUserAddress = () => useUserLocationNew((s) => s.address);
  
  const nickname = useUserInfo((s) => s.nickname)
  const email = useUserInfo((s) => s.email)
  const gender = useUserInfo((s) => s.gender)
  const age = useUserInfo((s) => s.age)
  const password = useUserInfo((s) => s.password)

  const address = useUserInfo((s) => s.address)
  const setAddress = useUserLocationNew((s) => s.setAddress)

  const {
    isOpen: isSearchAddressOpen,
    onOpen: onSearchAddressOpen,
    onClose: onSearchAddressClose,
  } = useDisclosure();

  const [formData, setFormData] = useState({
    nickName: nickname ?? '',
    email: email ?? '',
    gender: gender ?? '',
    age: age ?? '',
    address: address ?? '',
    password: password ?? '',
  });

  const [showDetailAddressInput, setShowDetailAddressInput] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // 토큰
  const token = useChatToken((s) => s.chatToken);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);

    e.preventDefault()

    const newAddress = formData.address;

    // 주소변경
    const modifyLocation = await fetch('/api/users/location', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ road_address: newAddress }),
    })
    const userLocation = await modifyLocation.json()
    console.log('[profile-form] User Location :: ', userLocation);

    useUserInfo.getState().setLatitude(userLocation.latitude || '');
    useUserInfo.getState().setLongitude(userLocation.longitude || '');

    setIsLoading(false);

    onClose();
  };

  const handleCompletePost = (data: Address) => {
    console.log('[postcode-layout] New roadAddress ::: ', data.roadAddress);
    
    useUserLocationNew.getState().setAddress(data.roadAddress);
    useUserInfo.getState().setAddress(data.roadAddress);

    setAddress(data.roadAddress);       
    
    // 도로명/지번 등 라이브러리가 가공한 최종 주소
    //setShowDetailAddressInput(true); // 상세주소 입력칸 표시
    //onSearchAddressClose();          // 💡여기 '()' 꼭 필요!
  }; 

  // const handleSubmit = async(e: React.FormEvent) => {
  //   e.preventDefault()

  //   const newAddress = handleUserAddress();
  //   console.log('콘솔 formData.address::', newAddress);

  //   const getUsersLocation = await fetch("/api/users/location", {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ road_address: newAddress }),
  //   });

  //   const userLocation = await getUsersLocation.json();

  //   console.log('[account-form] User Location :: ', userLocation);

  //   onClose()
  // };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, address: address ?? '' }))
  }, [address])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-teal-500" />
          프로필 수정
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nickName" className="flex items-center gap-2">성명/닉네임</Label>
              <Input
                id="nickName"
                name="nickName"
                value={formData.nickName}
                onChange={handleInputChange}
                readOnly
                className="select-none cursor-default mt-1 border border-b-teal-300 rounded-none
             focus:outline-none focus:ring-0 focus:border-t-0 focus:border-l-0
             focus:border-r-0 focus:shadow-none focus-visible:outline-none
             focus-visible:ring-0"
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
              readOnly
              className="cursor-default mt-1 border border-b-teal-300 rounded-none focus:outline-none focus:ring-0 focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
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
                value={address}
                onChange={handleInputChange}
                readOnly
                className="cursor-default mt-1 border border-b-teal-300 rounded-none focus:outline-none focus:ring-0 focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
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
                    onCompletePost={handleCompletePost}
                  />
                </PopoverContent>
              </Popover> 
            </div>
          </div>

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
                readOnly
                className="cursor-default mt-1 border border-b-teal-300 rounded-none focus:outline-none focus:ring-0 focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
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
                readOnly
                className="cursor-default mt-1 border border-b-teal-300 rounded-none focus:outline-none focus:ring-0 focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-teal-500 hover:bg-teal-600 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (<span>적용 중...<span className="dots">...</span></span>) : (<span>적용</span>)}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent hover:bg-gray-200 cursor-pointer"
            >
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
