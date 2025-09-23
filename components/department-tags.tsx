"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

import { IconChevronLeft } from "@/components/icon/icon-chevron-left"
import { IconChevronRight } from "@/components/icon/icon-chevron-right"

interface Departments {
  id: number
  name: string
  //description: string
  created_at: string
}

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

interface DepartmentsTagsButtonProps {
  onTagClick?: (condition: Departments) => void
  className?: string
  variant?: "default" | "compact"
}

type Props = {
  value?: number[];                     // 선택된 태그 (부모가 소유)
  onChange: (next: Hospital[]) => void;  // 부모로 값 전달
  isCompact?: boolean;
};

export function DepartmentTags({ onChange, isCompact }: Props) {
  const [departmentList, setDepartmentList] = useState<Departments[]>([]);

  const [countHospitals, setCountHospitals] = useState(0);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleTagClick = (_department:Departments) => {
    setSelectedTags((prev) =>
      prev.includes(_department.name) ? prev.filter((_name) => _name !== _department.name) : [...prev, _department.name],
    );
    setSelectedTag(_department.name);

    (async() => {
      try {
        const params = new URLSearchParams({
          department_id: `${_department.id}`,
        });
        const getHospitalsList = await fetch(`/api/medical/hospitals?${params.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        const hospitalsList = await getHospitalsList.json();

        console.log('[department-interface] fetched hospitalsList :: ', hospitalsList);

        setCountHospitals(hospitalsList.length);
        onChange(hospitalsList);
    
      } catch (err) {
        console.error("부서 정보 가져오기 실패");
      }
    })();
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  };

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  };
  
  useEffect(() => {
    (async() => {
      try {        
        const getAllDepartments = await fetch("/api/medical/departments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        const departments = await getAllDepartments.json();

        setDepartmentList(departments);

        console.log('[department-interface] fetched departments :: ', departments);
    
      } catch (err) {
        console.error("부서 정보 가져오기 실패");
      }
    })();
  }, []);

  return (
    <div className={`department-tags bg-emerald-50`}>
      {!isCompact && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">진료과로 병원기기 찾기</h3>
          <p className="text-sm text-black-400">서초구에 위치한 병원의 기기현황을 진료과로 필터하여 찾아보세요.</p>
        </div>
      )}

      <div className="flex items-center gap-2 h-[50px]">
        {/* Left button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollLeft}
          className={`cursor-pointer bg-gray-800/80 hover:bg-gray-700 text-gray-200
                      rounded-full w-8 h-8 p-0 transition-opacity
                      ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          aria-label="왼쪽으로 스크롤"
        >
          <IconChevronLeft />
        </Button>
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
          className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar"
        >
          <div className="flex gap-2 w-max">
            {departmentList.map((condition) => (
              <Button
                key={condition.id}
                variant={selectedTags.includes(condition.name) ? "default" : "outline"}
                size={isCompact ? "sm" : "default"}
                onClick={() => handleTagClick(condition)}
                className={`transition-all duration-200 hover:scale-105
                            cursor-pointer
                            bg-teal-500 hover:bg-teal-600 text-white
                            ${isCompact ? "text-xs px-2 py-1" : "text-sm px-3 py-2"}`}
              >
                {condition.name}
              </Button>
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollRight}
          className={`cursor-pointer bg-gray-800/80 hover:bg-gray-700 text-gray-200
                      rounded-full w-8 h-8 p-0 transition-opacity
                      ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          aria-label="오른쪽으로 스크롤"
        >
          <IconChevronRight />
        </Button>
      </div>

      <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
        <div className="text-sm text-gray-300">
          검색 진료과: <span className="text-teal-400 font-medium">{selectedTag}</span>
          {/* 검색 진료과: <span className="text-teal-400 font-medium">{selectedTags.join(', ')}</span> */}
        </div>
        <div className="text-sm text-gray-300">
          검색 병원 수: <span className="text-teal-400 font-medium">{countHospitals}개</span>
        </div>
        {/* <div className="text-sm text-gray-300">
          현황 업데이트 일자 <span className="text-teal-400 font-medium">{countHospitals}</span>
        </div> */}
      </div>
    </div>
  )
}
