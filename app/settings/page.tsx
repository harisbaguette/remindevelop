'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronRight, User } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export default function SettingsPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)
            setLoading(false)
        }
        getUser()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    if (loading) return null

    return (
        <div className="min-h-screen bg-toss-grey-100 pb-safe">
            {/* Header */}
            <header className="bg-toss-grey-100 sticky top-0 z-50 px-5 py-4 flex items-center gap-4">
                <Link href="/" className="text-toss-grey-900 hover:text-toss-grey-600 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-[20px] font-bold text-toss-grey-900">설정</h1>
            </header>

            <main className="max-w-md mx-auto px-5 pt-2 space-y-8">
                {/* Profile Section */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 bg-toss-grey-100 rounded-full flex items-center justify-center text-toss-grey-500">
                        <User className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-[20px] font-bold text-toss-grey-900">
                            {user?.email?.split('@')[0]}님
                        </h2>
                        <p className="text-[14px] text-toss-grey-500">
                            {user?.email}
                        </p>
                    </div>
                </div>

                {/* Theme Toggle */}
                <div className="bg-white dark:bg-zinc-800 rounded-[24px] p-5 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-toss-grey-100 dark:bg-zinc-700 flex items-center justify-center">
                            {theme === 'dark' ? <Moon className="w-5 h-5 text-toss-blue" /> : <Sun className="w-5 h-5 text-orange-500" />}
                        </div>
                        <span className="text-[17px] font-medium text-toss-grey-900 dark:text-white">다크 모드</span>
                    </div>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={`w-[50px] h-[30px] rounded-full p-1 transition-colors duration-200 ease-in-out ${theme === 'dark' ? 'bg-toss-blue' : 'bg-toss-grey-200'}`}
                    >
                        <div className={`w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>

                {/* Menu List */}
                <div className="bg-white rounded-[24px] overflow-hidden shadow-sm">
                    <Link href="/privacy" className="flex items-center justify-between p-5 active:bg-toss-grey-50 transition-colors">
                        <span className="text-[17px] font-medium text-toss-grey-900">개인정보 처리방침</span>
                        <ChevronRight className="w-5 h-5 text-toss-grey-300" />
                    </Link>
                    <div className="h-[1px] bg-toss-grey-100 mx-5"></div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between p-5 active:bg-toss-grey-50 transition-colors text-left"
                    >
                        <span className="text-[17px] font-medium text-toss-grey-900">로그아웃</span>
                        <ChevronRight className="w-5 h-5 text-toss-grey-300" />
                    </button>
                </div>

                <div className="px-2">
                    <button
                        onClick={async () => {
                            if (!confirm('정말로 탈퇴하시겠습니까? 모든 데이터가 삭제되며 복구할 수 없습니다.')) return

                            const promise = async () => {
                                const res = await fetch('/api/auth/delete', { method: 'POST' })
                                const data = await res.json()
                                if (!res.ok) throw new Error(data.error || '탈퇴 처리에 실패했습니다.')
                                await supabase.auth.signOut()
                                router.replace('/login')
                                return '탈퇴가 완료되었습니다.'
                            }

                            toast.promise(promise(), {
                                loading: '탈퇴 처리 중...',
                                success: (msg) => msg,
                                error: (err) => err.message,
                            })
                        }}
                        className="text-[15px] text-toss-grey-500 underline underline-offset-4 hover:text-red-500 transition-colors"
                    >
                        회원 탈퇴
                    </button>
                </div>
            </main>
        </div>
    )
}
