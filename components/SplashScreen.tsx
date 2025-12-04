'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onFinish, 500) // Wait for fade out animation
    }, 2000)

    return () => clearTimeout(timer)
  }, [onFinish])

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex flex-col items-center animate-in zoom-in-50 duration-700">
        <div className="w-20 h-20 bg-toss-blue rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-toss-blue/30">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-toss-grey-900 mb-2">리마인드 보관소</h1>
        <p className="text-toss-grey-500 text-sm">AI로 정리하는 나만의 지식 저장소</p>
      </div>
    </div>
  )
}
