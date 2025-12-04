'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'
import LinkInput from '@/components/LinkInput'
import LinkList from '@/components/LinkList'
import { Inbox, Archive, Trash2, LogOut } from 'lucide-react'
import Link from 'next/link'

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'active'
  const [refreshKey, setRefreshKey] = useState(0)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUserEmail(user.email || null)
      }
    }
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
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

  return (
    <div className="min-h-screen bg-toss-grey-50 pb-24">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 px-5 py-4 border-b border-toss-grey-100 flex justify-between items-center">
        <h1 className="text-xl font-bold text-toss-grey-900">리마인드 보관소</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-toss-grey-500 hover:text-toss-grey-800 font-medium"
        >
          로그아웃
        </button>
      </header>

      <main className="max-w-md mx-auto p-5">
        {view === 'active' && (
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
              {view === 'active' && '보관함'}
              {view === 'archive' && '완료된 링크'}
              {view === 'trash' && '휴지통'}
            </h3>
          </div>
          <LinkList status={view} keyProp={refreshKey} />
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-toss-grey-100 pb-safe">
        <div className="flex justify-around max-w-md mx-auto">
          <TabItem viewName="active" icon={Inbox} label="보관함" />
          <TabItem viewName="archive" icon={Archive} label="완료" />
          <TabItem viewName="trash" icon={Trash2} label="휴지통" />
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
