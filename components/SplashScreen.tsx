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
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex flex-col items-center animate-in zoom-in-90 duration-1000">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-toss-blue/20 blur-2xl rounded-full animate-pulse"></div>
          <img
            src="/logo.png"
            alt="Remind Vault Logo"
            className="relative w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
        <h1 className="text-3xl font-bold text-toss-grey-900 mb-3 tracking-tight">리마인드 보관소</h1>
        <p className="text-toss-grey-500 text-sm font-medium tracking-wide">AI로 완성하는 나만의 지식 저장소</p>
      </div>
    </div>
  )
}
