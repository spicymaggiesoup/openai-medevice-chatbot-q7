"use client"

import type React from "react"
import { useState } from "react"

import { useDisclosure } from "@chakra-ui/react";

import DaumPostcode, { type Address } from "react-daum-postcode";

import { User, Mail, Phone, Calendar, MapPin, Search } from "lucide-react"

import { useUserInfo, useUserLocationNew } from "@/lib/store";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
//import { Modal } from "@/components/ui/modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type PostcodeLayoutProps = {
  onCompletePost?: (data: Address) => void;
  onClose: () => void;
};

export function PostcodeLayout({ onClose }: PostcodeLayoutProps) {
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

  const onCompletePost = (data: Address) => {
    console.log('[postcode-layout] New roadAddress ::: ', data.roadAddress);
    useUserLocationNew.getState().setAddress(data.roadAddress);
    useUserInfo.getState().setAddress(data.roadAddress);
    setAddress(data.roadAddress);       
    
    // 도로명/지번 등 라이브러리가 가공한 최종 주소
    //setShowDetailAddressInput(true); // 상세주소 입력칸 표시
    //onSearchAddressClose();          // 💡여기 '()' 꼭 필요!
  }; 

  return (
    <Card className="w-full h-[50vh] max-h-[50vh] bg-white border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-full flex items-center content-center gap-2">
            주소검색
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="cursor-pointer"
          >
            X
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[70vh] max-h-[80vh]">
        <DaumPostcode
          className="h-[70vh] max-h-[80vh]"
          style={{height:'100%'}}
          autoClose={false}
          onComplete={onCompletePost}
        />
      </CardContent>
    </Card>
  )
}
