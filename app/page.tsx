'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'
import LinkInput from '@/components/LinkInput'
import LinkList from '@/components/LinkList'
import { Inbox, Archive, Trash2, User, Search, Loader2 } from 'lucide-react'
import Link from 'next/link'

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'active'
  const [refreshKey, setRefreshKey] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Handle Share Intent Data
  const sharedUrl = searchParams.get('url')
  const sharedText = searchParams.get('text')
  const sharedTitle = searchParams.get('title') // Not used yet but available
  const initialLinkValue = sharedUrl || sharedText || ''

  useEffect(() => {
    if (initialLinkValue) {
      // Optional: Auto-focus or just let it sit there. 
      // If needed we can clear the query param to avoid persistence on refresh, 
      // but replacing the route might reload the page.
      // For now, just pre-fill.
    }
  }, [initialLinkValue])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setAuthChecked(true)
      } else {
        router.replace('/login')
      }
    }
    checkUser()
  }, [router])

  const handleLinkAdded = () => {
    setRefreshKey(prev => prev + 1)
  }


  const TabItem = ({ viewName, icon: Icon, label }: { viewName: string, icon: any, label: string }) => {
    const isActive = view === viewName || (viewName === 'active' && !view)
    return (
      <Link
        href={viewName === 'active' ? '/' : `/?view=${viewName}`}
        className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${isActive
          ? 'text-toss-grey-900'
          : 'text-toss-grey-400'
          }`}
      >
        <Icon className={`w-7 h-7 mb-1 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
        <span className="text-[11px] font-medium">{label}</span>
      </Link>
    )
  }

  // Redirecting or Loading
  if (!authChecked || !user) {
    return null
  }

  // Main App (Logged in)
  if (authChecked && user) {
    return (
      <div className="min-h-screen bg-toss-grey-100 pb-24">
        {/* Header */}
        <header className="bg-toss-grey-100 sticky top-0 z-50 px-5 py-4 flex justify-between items-center">
          <h1 className="text-[24px] font-bold text-toss-grey-900">보관소</h1>
          <Link href="/settings" className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-toss-grey-600 shadow-sm">
            <User className="w-5 h-5" />
          </Link>
        </header>

        <main className="max-w-md mx-auto px-5 space-y-8">
          {/* Input Section */}
          <div className="sticky top-[72px] z-40 bg-toss-grey-100 pb-2">
            <LinkInput onLinkAdded={handleLinkAdded} initialValue={initialLinkValue} />
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-toss-grey-400" />
            <input
              type="text"
              placeholder="검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="toss-input pl-8 border-b border-toss-grey-300 focus:border-toss-grey-900 bg-transparent px-0 rounded-none"
            />
          </div>

          <div>
            <h3 className="text-[20px] font-bold text-toss-grey-900 mb-4">
              {searchQuery ? '검색 결과' : (
                <>
                  {view === 'active' && '최근 보관함'}
                  {view === 'archive' && '완료된 항목'}
                  {view === 'trash' && '휴지통'}
                </>
              )}
            </h3>
            <LinkList status={view} keyProp={refreshKey} searchQuery={searchQuery} />
          </div>
        </main>

        {/* Bottom Tab Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-toss-grey-200 pb-safe z-50 rounded-t-[20px] shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex justify-around max-w-md mx-auto px-2">
            <TabItem viewName="active" icon={Inbox} label="보관함" />
            <TabItem viewName="archive" icon={Archive} label="완료" />
            <TabItem viewName="trash" icon={Trash2} label="휴지통" />
          </div>
        </nav>
      </div>
    )
  }

  return null
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-toss-grey-100"><Loader2 className="w-8 h-8 animate-spin text-toss-blue" /></div>}>
      <HomeContent />
    </Suspense>
  )
}
