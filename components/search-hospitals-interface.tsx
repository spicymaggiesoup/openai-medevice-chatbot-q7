"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { DepartmentTags } from "@/components/department-tags"

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
  hospital_type_name: string
  created_at: string
  latitude: number
  longitude: number
}

export function SearchHospitalsInterface() {
  const [searchedList, setSearchedList] = useState<Hospital[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`)
  };

  // 선택값이 바뀔 때마다 호출될 fetch
  // const fetchHospitals = useCallback(async (tags: number[]) => {
  //   console.log('[search-hospitals-interface] fetchHospitals :: ', tags);
  //   // const params = new URLSearchParams();
  //   // if (tags.length) params.set("departments", tags.join(",")); // ← 파라미터 적용

  //   // const res = await fetch(`/api/hospitals?${params.toString()}`, { cache: "no-store" });
  //   // const data = await res.json();
  //   // setFilteredHospitals(data);
  // }, []);

  useEffect(() => {
    setFilteredHospitals(searchedList);
  }, [searchedList]);

  return (
    <div className="min-h-0 bg-emerald-50 p-6">
      {/* Department Section */}
      <div className="mb-6">
        <DepartmentTags
          // value={searchedList}
          // onChange={setSelectedTags}
          onChange={setSearchedList}
          isCompact
        />
      </div>

      {/* Hospital Table */}
      <div className="hospital-table bg-white rounded-lg shadow-sm border border-gray-200">
        {/* <-- 가로 스크롤 래퍼 */}
        <div className="overflow-x-auto">
          {/* 핵심: w-full 대신 min-w-XXXX 로 최소 가로폭 보장 */}
          <table className="min-w-[1100px] table-auto">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 whitespace-nowrap">병원 이름</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[320px]">주소</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 whitespace-nowrap">전화번호</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 whitespace-nowrap">기기현황</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 whitespace-nowrap">종합 병원정보</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHospitals.map((hospital) => (
                <tr key={hospital.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{hospital.name}</div>
                  </td>

                  {/* 주소는 어느 정도 넓이 확보 (줄바꿈 허용) */}
                  <td className="py-4 px-6 min-w-[320px]">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPinIcon />
                      <span className="text-sm">{hospital.address}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    <button
                      onClick={() => handleCall(hospital.phone)}
                      className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      <PhoneIcon />
                      <span className="text-sm">{hospital.phone}</span>
                    </button>
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    {/* ... */}
                    기기현황
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    {/* ... */}
                    종합 병원정보
                  </td>
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
