"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDisclosure } from "@chakra-ui/react";
import { type Address } from "react-daum-postcode";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Popover2, PopoverContent2, PopoverTrigger2 } from "@/components/ui/popover2"
import { PostcodeLayout } from "@/components/postcode-layout"
import { User, Mail, Phone, Calendar, MapPin, Search } from "lucide-react"

interface AccountFormProps {
  onClose: () => void
}

export function AccountForm({ onClose }: AccountFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    address: "",
    password: "",
  });
  const {
    isOpen: isSearchAddressOpen,
    onOpen: onSearchAddressOpen,
    onClose: onSearchAddressClose,
  } = useDisclosure();

  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [showDetailAddressInput, setShowDetailAddressInput] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] User account data:", formData)
    // Here you would typically send the data to your backend
    alert("Account created successfully! You can now contact healthcare providers.")
    onClose()
  };

  const onCompletePost = (data: Address) => {
    setAddress(data.address);        // 도로명/지번 등 라이브러리가 가공한 최종 주소
    setShowDetailAddressInput(true); // 상세주소 입력칸 표시
    onSearchAddressClose();          // 💡여기 '()' 꼭 필요!
  };

  useEffect(() => {
    
  }, []);

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
              <Label htmlFor="fullName" className="flex items-center gap-2">성명/닉네임</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1 border border-b-teal-300 rounded-none focus:outline-none focus:ring-0 focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
            <div>
            <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
              {/* <Calendar className="w-4 h-4" /> */}
              생년월일
            </Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
              className="mt-1 border border-b-teal-300 rounded-none focus:outline-none focus:ring-0 focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
            />
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="flex items-center gap-2">
              {/* <MapPin className="w-4 h-4" /> */}
              주소
            </Label>
            <div className="flex mt-1">
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                readOnly
                className="cursor-default mt-1 border border-b-teal-300 rounded-none focus:outline-none focus:ring-0 focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
              />
              {/*<Button
                  type="button"
                  variant="ghost"
                  className="cursor-pointer px-3 bg-transparent hover:bg-teal-50"
                  onClick={onSearchAddressOpen}
                >
                <Search className="w-4 h-4" />
              </Button>*/}
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
                required
                className="mt-1 border border-b-teal-300 rounded-none focus:outline-none focus:ring-0 focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
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
                required
                className="mt-1 border border-b-teal-300 rounded-none focus:outline-none focus:ring-0 focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-teal-500 hover:bg-teal-600 cursor-pointer">
              수정
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent hover:bg-gray-200 cursor-pointer">
              취소
            </Button>
          </div>
        </form>

        {/* 모달 
        {isSearchAddressOpen && (
          <Modal
            isOpen={isSearchAddressOpen}
            onClose={onSearchAddressClose}
            onCompletePost={onCompletePost}
          />
        )}*/}
      </CardContent>
    </Card>
  )
}
