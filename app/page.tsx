'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'
import LinkInput from '@/components/LinkInput'
import LinkList from '@/components/LinkList'
import SplashScreen from '@/components/SplashScreen'
import { Inbox, Archive, Trash2, LogOut, Sparkles, ArrowRight, Search, User } from 'lucide-react'
import Link from 'next/link'

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'active'
  const [refreshKey, setRefreshKey] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [showSplash, setShowSplash] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setAuthChecked(true)
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const handleLinkAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  const TabItem = ({ viewName, icon: Icon, label }: { viewName: string, icon: any, label: string }) => {
    const isActive = view === viewName || (viewName === 'active' && !view)
    return (
      <Link
        href={viewName === 'active' ? '/' : `/?view=${viewName}`}
        className={`flex flex-col items-center justify-center w-full py-3 transition-colors ${isActive
          ? 'text-toss-blue'
          : 'text-toss-grey-400'
          }`}
      >
        <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
      </Link>
    )
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />
  }

  // Landing Page (Not logged in)
  if (authChecked && !user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-toss-blue/10 rounded-3xl flex items-center justify-center mb-8">
            <Sparkles className="w-12 h-12 text-toss-blue" />
          </div>
          <h1 className="text-3xl font-bold text-toss-grey-900 mb-4">
            링크 정리가<br />쉬워집니다
          </h1>
          <p className="text-toss-grey-600 leading-relaxed">
            복잡한 링크들, AI가 알아서 분류해드려요.<br />
            지금 바로 시작해보세요.
          </p>
        </div>
        <div className="w-full max-w-md mb-8">
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-toss-blue hover:bg-blue-600 text-white font-bold py-4 rounded-2xl text-lg transition-colors flex items-center justify-center gap-2"
          >
            시작하기
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  // Main App (Logged in)
  return (
    <div className="min-h-screen bg-toss-grey-50 pb-24">
      {/* Header with Search */}
      <header className="bg-white sticky top-0 z-50 px-5 py-3 border-b border-toss-grey-100 space-y-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-toss-grey-900">리마인드 보관소</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-toss-grey-400" />
          <input
            type="text"
            placeholder="링크 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-toss-grey-100 text-toss-grey-900 pl-11 pr-4 py-3 rounded-2xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-toss-blue transition-all outline-none placeholder:text-toss-grey-400"
          />
        </div>
      </header>

      <main className="max-w-md mx-auto p-5">
        {view === 'active' && !searchQuery && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-toss-grey-900 mb-2">
              새로운 링크를<br />저장해볼까요?
            </h2>
            <p className="text-toss-grey-600 mb-6">AI가 내용을 분석해서 정리해드려요.</p>
            <LinkInput onLinkAdded={handleLinkAdded} />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-toss-grey-900 flex items-center gap-2">
              {searchQuery ? `'${searchQuery}' 검색 결과` : (
                <>
                  {view === 'active' && '보관함'}
                  {view === 'archive' && '완료된 링크'}
                  {view === 'trash' && '휴지통'}
                </>
              )}
            </h3>
          </div>
          {/* Pass searchQuery to LinkList if implemented, for now just showing list */}
          <LinkList status={view} keyProp={refreshKey} searchQuery={searchQuery} />
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-toss-grey-100 pb-safe z-50">
        <div className="flex justify-around max-w-md mx-auto">
          <TabItem viewName="active" icon={Inbox} label="보관함" />
          <TabItem viewName="archive" icon={Archive} label="완료" />
          <TabItem viewName="trash" icon={Trash2} label="휴지통" />
          <Link
            href="/settings"
            className="flex flex-col items-center justify-center w-full py-3 transition-colors text-toss-grey-400 hover:text-toss-grey-600"
          >
            <User className="w-6 h-6 mb-1" strokeWidth={2} />
            <span className="text-[10px] font-medium">마이</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-toss-grey-50">로딩중...</div>}>
      <HomeContent />
    </Suspense>
  )
}
