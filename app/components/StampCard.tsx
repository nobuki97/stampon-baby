'use client'

import { STAMP_TEXTS } from '@/app/lib/constants'

interface Props {
  index: number
  dataURL: string | null
  isGenerating: boolean
}

export default function StampCard({ index, dataURL, isGenerating }: Props) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-[90px] h-[78px] sm:w-[108px] sm:h-[93px] rounded-2xl border-2 border-pink-200 bg-pink-50 overflow-hidden flex items-center justify-center relative shadow-sm">
        {dataURL ? (
          <img
            src={dataURL}
            alt={STAMP_TEXTS[index]}
            className="w-full h-full object-cover"
          />
        ) : isGenerating ? (
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-7 h-7 rounded-full border-2 border-pink-300 border-t-transparent animate-spin"
            />
            <span className="text-[10px] text-pink-300 font-medium">生成中</span>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-50 to-purple-50" />
        )}
      </div>
      <span className="text-[10px] sm:text-xs text-gray-400 font-medium text-center leading-tight">
        {STAMP_TEXTS[index]}
      </span>
    </div>
  )
}
