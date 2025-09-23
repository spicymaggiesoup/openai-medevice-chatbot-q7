"use client"

import { useState, useEffect, Fragment } from "react"
import { DepartmentTags } from "@/components/department-tags"
import { MapPinIcon } from "@/components/icon/icon-map-pin"
import { PhoneIcon } from "@/components/icon/icon-phone"

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

interface Equipment {
  hospital_id: number;
  category_id: number;
  category_name: string;
  category_code: string;
  quantity: number;
}

type EquipmentsById = Record<string, Equipment[]>;
type FlagsById = Record<string, boolean>;

export function SearchHospitalsInterface() {
  const [searchedList, setSearchedList] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [equipmentById, setEquipmentById] = useState<EquipmentsById>({});
  const [fetchedById, setFetchedById] = useState<FlagsById>({});
  const [expandedById, setExpandedById] = useState<FlagsById>({});

  const handleCall = (phone: string) => window.open(`tel:${phone}`);

  const toggleRow = async (id: string) => {
    const nextOpen = !expandedById[id];

    // 닫는 경우는 그냥 닫기만
    if (!nextOpen) {
      setExpandedById(prev => ({ ...prev, [id]: false }));
      return;
    }

    setExpandedById(prev => ({ ...prev, [id]: true }));

    if (fetchedById[id]) return;

    try {
      const res = await fetch(`/api/medical/hospitals/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();

      // 기존 상태 유지 누적
      setEquipmentById(prev => ({ ...prev, [id]: json.equipment as Equipment[] }));
      setFetchedById(prev => ({ ...prev, [id]: true }));
    } catch (err) {
      console.error("장비 정보 가져오기 실패", err);
    }
  };

  useEffect(() => {
    setFilteredHospitals(searchedList);
  }, [searchedList]);

  return (
    <div className="search-hospitals h-dvh min-h-0 bg-emerald-50 p-6 flex flex-col">
      <div className="mb-6">
        <DepartmentTags onChange={setSearchedList} isCompact />
      </div>

      <div className="hospital-table bg-white rounded-lg shadow-sm border border-gray-200 flex-1 min-h-0 flex flex-col p-0">
        <div className="overflow-auto">
          <table className="min-w-[1100px] table-auto w-full">
            <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 whitespace-nowrap">병원 이름</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 min-w-[320px]">주소</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 whitespace-nowrap">전화번호</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 whitespace-nowrap">기기현황</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredHospitals.map((hospital) => {
                const isOpen = !!expandedById[hospital.id];
                const isFetched = !!fetchedById[hospital.id];
                const rows = equipmentById[hospital.id] ?? [];

                return (
                  <Fragment key={hospital.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{hospital.name}</div>
                      </td>

                      <td className="py-4 px-6 min-w-[320px]">
                        <div className="flex gap-2 text-gray-600 items-center">
                          <div><MapPinIcon /></div>
                          <span className="text-sm">{hospital.address}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <button
                          onClick={() => handleCall(hospital.phone)}
                          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors"
                        >
                          {hospital.phone ? (
                            <div className="flex items-center gap-2">
                              <PhoneIcon />
                              <span className="text-sm">{hospital.phone}</span>
                            </div>
                          ) : null}
                        </button>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div
                          onClick={() => toggleRow(hospital.id)}
                          className="cursor-pointer flex items-center justify-center"
                        >
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {isOpen ? "닫기" : "보기"}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr className="bg-gray-50">
                        <td colSpan={4} className="p-0">
                          <div className="pt-4 pr-8 pb-4 pl-8 border-t border-gray-200">
                            <div className="overflow-x-auto">
                              <table className="min-w-[800px] w-full table-auto text-sm">
                                <thead>
                                  <tr className="text-left text-gray-700">
                                    <th className="py-2 px-3">기기명</th>
                                    <th className="py-2 px-3">기기코드</th>
                                    <th className="py-2 px-3">수량</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y">
                                  {isFetched ? (
                                    rows.length ? (
                                      rows.map((eq) => (
                                        <tr key={eq.category_id}>
                                          <td className="py-2 px-3">{eq.category_name}</td>
                                          <td className="py-2 px-3">{eq.category_code}</td>
                                          <td className="py-2 px-3">{eq.quantity}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan={3} className="py-3 px-3 text-gray-500">
                                          장비 데이터가 없습니다.
                                        </td>
                                      </tr>
                                    )
                                  ) : (
                                    <tr>
                                      <td colSpan={3} className="py-3 px-3 text-gray-500">
                                        로딩 중…
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">필터 된 병원이 없습니다.</h3>
            <p className="text-gray-500">진료과를 클릭하여 장비현황을 알고싶은 병원을 찾아보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
