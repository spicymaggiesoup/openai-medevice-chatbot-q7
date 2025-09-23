"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"

interface MedicalCondition {
  id: number
  name: string
  description: string
  created_at: string
}

interface MedicalTagButtonsProps {
  onTagClick?: (condition: MedicalCondition) => void
  className?: string
  variant?: "default" | "compact"
}

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const medicalConditions: MedicalCondition[] = [
  {
    id: 1,
    name: "간염",
    description: "간염 관련 질환",
    created_at: "2025-09-12T06:33:28.250147",
  },
  {
    id: 2,
    name: "골다공증",
    description: "골다공증 관련 질환",
    created_at: "2025-09-12T06:33:28.370831",
  },
  {
    id: 3,
    name: "치매",
    description: "치매 관련 질환",
    created_at: "2025-09-12T06:33:28.538272",
  },
  {
    id: 4,
    name: "퇴행성근골격계질환",
    description: "퇴행성근골격계질환 관련 질환",
    created_at: "2025-09-12T06:33:28.663379",
  },
  {
    id: 5,
    name: "당뇨병",
    description: "당뇨병 관련 질환",
    created_at: "2025-09-12T06:33:28.822494",
  },
  {
    id: 6,
    name: "동맥경화",
    description: "동맥경화 관련 질환",
    created_at: "2025-09-12T06:33:28.990549",
  },
  {
    id: 7,
    name: "신장병",
    description: "신장병 관련 질환",
    created_at: "2025-09-12T06:33:29.431972",
  },
  {
    id: 8,
    name: "요통",
    description: "요통 관련 질환",
    created_at: "2025-09-12T06:33:29.587734",
  },
  {
    id: 9,
    name: "류마티스 관절염",
    description: "류마티스 관절염 관련 질환",
    created_at: "2025-09-12T06:33:29.737353",
  },
  {
    id: 10,
    name: "위장병",
    description: "위장병 관련 질환",
    created_at: "2025-09-12T06:33:30.154580",
  },
  {
    id: 11,
    name: "노인성빈혈",
    description: "노인성빈혈 관련 질환",
    created_at: "2025-09-12T06:33:30.287770",
  },
  {
    id: 12,
    name: "노인성우울증",
    description: "노인성우울증 관련 질환",
    created_at: "2025-09-12T06:33:30.423284",
  },
  {
    id: 13,
    name: "뇌동맥류",
    description: "뇌동맥류 관련 질환",
    created_at: "2025-09-12T06:33:30.562624",
  },
  {
    id: 14,
    name: "변비",
    description: "변비 관련 질환",
    created_at: "2025-09-12T06:33:30.717905",
  },
  {
    id: 15,
    name: "고혈압",
    description: "고혈압 관련 질환",
    created_at: "2025-09-12T06:33:30.849700",
  },
  {
    id: 16,
    name: "뇌졸중",
    description: "뇌졸중 관련 질환",
    created_at: "2025-09-12T06:33:30.981119",
  },
  {
    id: 17,
    name: "파킨슨병",
    description: "파킨슨병 관련 질환",
    created_at: "2025-09-12T06:33:31.160507",
  },
  {
    id: 18,
    name: "오십견",
    description: "오십견 관련 질환",
    created_at: "2025-09-12T06:33:31.527418",
  },
]

export default function MedicalTagButtons({ onTagClick, className = "", variant = "default" }: MedicalTagButtonsProps) {
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const handleTagClick = (condition: MedicalCondition) => {
    setSelectedTags((prev) =>
      prev.includes(condition.id) ? prev.filter((id) => id !== condition.id) : [...prev, condition.id],
    )
    onTagClick?.(condition)
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const isCompact = variant === "compact"

  return (
    <div className={`w-full ${className}`}>
      {!isCompact && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">의료 상담 주제</h3>
          <p className="text-sm text-gray-400">관심 있는 의료 주제를 선택해주세요</p>
        </div>
      )}

      <div className="relative">
        {/* Left scroll button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 text-gray-200 rounded-full w-8 h-8 p-0 transition-opacity ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeftIcon />
        </Button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {medicalConditions.map((condition) => (
            <Button
              key={condition.id}
              variant={selectedTags.includes(condition.id) ? "default" : "outline"}
              size={isCompact ? "sm" : "default"}
              onClick={() => handleTagClick(condition)}
              className={`
                flex-shrink-0 transition-all duration-200 hover:scale-105
                ${
                  selectedTags.includes(condition.id)
                    ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600 hover:border-teal-500"
                }
                ${isCompact ? "text-xs px-2 py-1" : "text-sm px-3 py-2"}
              `}
              title={condition.description}
            >
              {condition.name}
            </Button>
          ))}
        </div>

        {/* Right scroll button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 text-gray-200 rounded-full w-8 h-8 p-0 transition-opacity ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRightIcon />
        </Button>
      </div>

      {selectedTags.length > 0 && !isCompact && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-300">
            선택된 주제: <span className="text-teal-400 font-medium">{selectedTags.length}개</span>
          </p>
        </div>
      )}
    </div>
  )
}
