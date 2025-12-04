'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LogOut, User, ChevronRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

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
        <div className="min-h-screen bg-toss-grey-50 pb-safe">
            {/* Header */}
            <header className="bg-white sticky top-0 z-50 px-5 py-4 flex items-center gap-4 border-b border-toss-grey-100">
                <Link href="/" className="text-toss-grey-900 hover:text-toss-blue transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold text-toss-grey-900">마이 페이지</h1>
            </header>

            <main className="max-w-md mx-auto p-5 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-toss p-6 shadow-sm flex items-center gap-4">
                    <div className="w-16 h-16 bg-toss-blue/10 rounded-full flex items-center justify-center text-toss-blue">
                        <User className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-toss-grey-900">
                            {user?.email?.split('@')[0]}님
                        </h2>
                        <p className="text-sm text-toss-grey-500">{user?.email}</p>
                    </div>
                    {user?.email === 'master@remind.app' && (
                        <ShieldCheck className="w-6 h-6 text-toss-blue" />
                    )}
                </div>

                {/* Menu List */}
                <div className="bg-white rounded-toss overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-toss-grey-100 flex items-center justify-between cursor-pointer hover:bg-toss-grey-50 transition-colors">
                        <span className="font-medium text-toss-grey-900">공지사항</span>
                        <ChevronRight className="w-5 h-5 text-toss-grey-400" />
                    </div>
                    <div className="p-4 border-b border-toss-grey-100 flex items-center justify-between cursor-pointer hover:bg-toss-grey-50 transition-colors">
                        <span className="font-medium text-toss-grey-900">자주 묻는 질문</span>
                        <ChevronRight className="w-5 h-5 text-toss-grey-400" />
                    </div>
                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-toss-grey-50 transition-colors">
                        <span className="font-medium text-toss-grey-900">앱 버전</span>
                        <span className="text-sm text-toss-grey-500">v1.0.0</span>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-white text-red-500 font-medium py-4 rounded-toss shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                    <LogOut className="w-5 h-5" />
                    로그아웃
                </button>
            </main>
        </div>
    )
}
