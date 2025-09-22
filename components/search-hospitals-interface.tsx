"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconSearch } from "@/components/icon/icon-search"
import { MediBot } from "@/components/img/medi-bot"
import { DepartmentTags } from "@/components/department-tags"

// const SearchIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="11" cy="11" r="8" />
//     <path d="m21 21-4.35-4.35" />
//   </svg>
// )

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

interface Hospital {
  id: string
  name: string
  address: string
  phone: string
  distance: string
  specialty: string
  rating: number
  emergencyServices: boolean
}

const hospitalData: Hospital[] = [
  // {
  //   id: "1",
  //   name: "Seoul National University Hospital",
  //   address: "101 Daehak-ro, Jongno-gu, Seoul 03080",
  //   phone: "+82-2-2072-2114",
  //   distance: "2.3 km",
  //   specialty: "General Hospital",
  //   rating: 4.8,
  //   emergencyServices: true,
  // },
  // {
  //   id: "2",
  //   name: "Samsung Medical Center",
  //   address: "81 Irwon-ro, Gangnam-gu, Seoul 06351",
  //   phone: "+82-2-3410-2114",
  //   distance: "5.7 km",
  //   specialty: "General Hospital",
  //   rating: 4.7,
  //   emergencyServices: true,
  // },
  // {
  //   id: "3",
  //   name: "Asan Medical Center",
  //   address: "88 Olympic-ro 43-gil, Songpa-gu, Seoul 05505",
  //   phone: "+82-2-3010-3114",
  //   distance: "8.1 km",
  //   specialty: "General Hospital",
  //   rating: 4.9,
  //   emergencyServices: true,
  // },
  // {
  //   id: "4",
  //   name: "Severance Hospital",
  //   address: "50-1 Yonsei-ro, Seodaemun-gu, Seoul 03722",
  //   phone: "+82-2-2228-5800",
  //   distance: "4.2 km",
  //   specialty: "General Hospital",
  //   rating: 4.6,
  //   emergencyServices: true,
  // },
  // {
  //   id: "5",
  //   name: "Gangnam Severance Hospital",
  //   address: "211 Eonju-ro, Gangnam-gu, Seoul 06273",
  //   phone: "+82-2-2019-3114",
  //   distance: "6.8 km",
  //   specialty: "General Hospital",
  //   rating: 4.5,
  //   emergencyServices: false,
  // },
  // {
  //   id: "6",
  //   name: "Seoul St. Mary's Hospital",
  //   address: "222 Banpo-daero, Seocho-gu, Seoul 06591",
  //   phone: "+82-2-2258-5800",
  //   distance: "7.3 km",
  //   specialty: "General Hospital",
  //   rating: 4.4,
  //   emergencyServices: true,
  // },
]

export function SearchHospitalsInterface() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredHospitals, setFilteredHospitals] = useState(hospitalData)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    const filtered = hospitalData.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(term) ||
        hospital.address.toLowerCase().includes(term) ||
        hospital.specialty.toLowerCase().includes(term),
    )
    setFilteredHospitals(filtered)
  }

  const handleGetDirections = (hospital: Hospital) => {
    // In a real app, this would open maps with directions
    alert(`Getting directions to ${hospital.name}`)
  }

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`)
  }

  return (
    <div className="flex-1 min-h-0 bg-emerald-50 p-6">
      {/* Department Section */}
      <div className="mb-6">
        <DepartmentTags ></DepartmentTags>
      </div>

      {/* Search Section */}
      {/* <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Input
            value={searchTerm}
            onChange={handleSearch}
            placeholder="기기 정보가 궁금한 병원을 검색해보세요!"
            className="border-gray-200 focus:border-teal-400 focus:ring-teal-400 w-[80%]"
          />
          <IconSearch />
        </div>
      </div> */}

      {/* Results Summary */}
      {/* <div className="mb-6">
        <p className="text-gray-600">
          검색결과 {filteredHospitals.length} 개의 병원이 검색되었습니다.
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div> */}

      {/* Hospital Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">병원 이름</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">주소</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">전화번호</th>
                {/* <th className="text-left py-4 px-6 font-semibold text-gray-900">거리</th> */}
                {/* <th className="text-left py-4 px-6 font-semibold text-gray-900">종합평가</th> */}
                {/* <th className="text-left py-4 px-6 font-semibold text-gray-900">기기현황 및 병원정보</th> */}
                <th className="text-left py-4 px-6 font-semibold text-gray-900">기기현황</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">종합 병원정보</th>
                {/* <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHospitals.map((hospital) => (
                <tr key={hospital.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{hospital.name}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPinIcon />
                      <span className="text-sm">{hospital.address}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleCall(hospital.phone)}
                      className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      <PhoneIcon />
                      <span className="text-sm">{hospital.phone}</span>
                    </button>
                  </td>
                  {/* <td className="py-4 px-6">
                    <span className="text-sm font-medium text-gray-900">{hospital.distance}</span>
                  </td> */}
                  {/* <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {hospital.specialty}
                    </span>
                  </td> */}
                  {/* <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-900">{hospital.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(hospital.rating) ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </td> */}
                  <td className="py-4 px-6">
                    <div>
                      M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z
                    </div>
                  </td>
                  {/* <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        hospital.emergencyServices ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {hospital.emergencyServices ? "Available" : "Not Available"}
                    </span>
                  </td> */}
                  {/* <td className="py-4 px-6">
                    <Button
                      size="sm"
                      onClick={() => handleGetDirections(hospital)}
                      className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2"
                    >
                      <NavigationIcon />  
                      Directions
                    </Button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredHospitals.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">필터 된 병원이 없습니다.</h3>
          <p className="text-gray-500">진료과를 클릭하여 장비현황을 알고싶은 병원을 찾아보세요.</p>
          {/* <p className="text-gray-500">곧 더 많은 병원을 업데이트할 예정이에요.</p> */}
        </div>
      )}
    </div>
  )
}
