import { Suspense } from 'react'
import SuccessInner from './SuccessInner'

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <p className="text-pink-500 font-bold animate-pulse">読み込み中...</p>
      </div>
    }>
      <SuccessInner />
    </Suspense>
  )
}
