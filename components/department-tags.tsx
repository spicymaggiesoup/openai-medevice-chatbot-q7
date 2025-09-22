"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface Departments {
  id: number
  name: string
  //description: string
  created_at: string
}

interface DepartmentsTagsButtonProps {
  onTagClick?: (condition: Departments) => void
  className?: string
  variant?: "default" | "compact"
}

const medicalConditions: Departments[] = [];

export function DepartmentTags({ onTagClick, className = "", variant = "default" }: DepartmentsTagsButtonProps) {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [departmentList, setDepartmentList] = useState<Departments[]>([]);

  const handleTagClick = (condition: Departments) => {
    setSelectedTags((prev) =>
      prev.includes(condition.id) ? prev.filter((id) => id !== condition.id) : [...prev, condition.id],
    )
    onTagClick?.(condition)
  }

  const isCompact = variant === "compact";

  const ChevronLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );

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

  useEffect(() => {
    console.log('[department-interface] useEffect departmentList :: ', departmentList);
    
    medicalConditions.concat(departmentList);
  }, [departmentList]);

  return (
    <div className={`department-tags bg-emerald-50`}>
      {!isCompact && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">진료과로 병원기기 찾기</h3>
          <p className="text-sm text-black-400">서초구에 위치한 병원의 기기현황을 진료과로 필터하여 찾아보세요.</p>
        </div>
      )}

      <div>
        {/* Left scroll button 
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollLeft}
          className={`top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 text-gray-200 rounded-full w-8 h-8 p-0 transition-opacity ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeftIcon />
        </Button>*/}

        <div
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
          className="h-[80px] pb-2 overflow-y-auto scrollbar-hide"
          // style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          // className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
          >
          {departmentList.map((condition) => (
            <Button
              key={condition.id}
              variant={selectedTags.includes(condition.id) ? "default" : "outline"}
              size={isCompact ? "sm" : "default"}
              onClick={() => handleTagClick(condition)}
              className={`
                transition-all duration-200 hover:scale-105
                cusrsor-pointer
                ${
                  'bg-teal-500 hover:bg-teal-600 text-white'
                }
                ${isCompact ? "text-xs px-2 py-1" : "text-sm px-3 py-2"}
              `}
            >
              {condition.name}
            </Button>
          ))}
        </div>

        {/* Right scroll button 
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollRight}
          className={`right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 text-gray-200 rounded-full w-8 h-8 p-0 transition-opacity ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRightIcon />
        </Button>*/} 
      </div>

      {selectedTags.length > 0 && !isCompact && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-300">
            검색 진료과: <span className="text-teal-400 font-medium">{selectedTags}</span>
          </div>
          <div className="text-sm text-gray-300">
            검색 병원 수: <span className="text-teal-400 font-medium">{selectedTags.length}개</span>
          </div>
        </div>
      )}
    </div>
  )
}
