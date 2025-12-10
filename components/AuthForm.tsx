'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AuthForm() {
    const [view, setView] = useState<'login' | 'signup' | 'reset'>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (view === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/')
                router.refresh()
            } else if (view === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                alert('회원가입이 완료되었습니다. 이메일을 확인해주세요.')
                setView('login')
            } else if (view === 'reset') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/update-password`,
                })
                if (error) throw error
                alert('비밀번호 재설정 링크를 이메일로 보냈습니다.')
                setView('login')
            }
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error: any) {
            setError(error.message)
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-[400px] mx-auto px-6 flex flex-col min-h-screen justify-center pb-20 animate-in fade-in duration-700">
            {/* Header Section: Logo & Title */}
            <div className="flex flex-col items-center mb-12">
                <div className="w-20 h-20 mb-6">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-sm" />
                </div>
                <h1 className="text-[30px] font-bold text-toss-grey-900 tracking-tight">
                    {view === 'login' && '로그인'}
                    {view === 'signup' && '회원가입'}
                    {view === 'reset' && '비밀번호 찾기'}
                </h1>
            </div>

            {/* Input Section */}
            <div className="space-y-6">
                {/* Google Login - Only show in Login/Signup */}
                {view !== 'reset' && (
                    <>
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full py-4 bg-[#F2F4F6] text-[#191F28] font-semibold rounded-[18px] hover:bg-[#E5E8EB] transition-colors flex items-center justify-center gap-2.5 relative active:scale-[0.98]"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Google로 계속하기
                        </button>

                        <div className="relative py-2 flex justify-center items-center">
                            <div className="w-full h-[1px] bg-toss-grey-100 absolute"></div>
                            <span className="text-[13px] text-toss-grey-400 bg-white px-3 relative z-10 font-medium">또는</span>
                        </div>
                    </>
                )}

                {/* Email Form */}
                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일"
                            className="w-full px-5 py-4 bg-toss-grey-50 border border-transparent focus:bg-white focus:border-toss-blue rounded-[18px] text-[17px] outline-none transition-all placeholder:text-toss-grey-400"
                            required
                            disabled={loading}
                        />
                        {view !== 'reset' && (
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호"
                                className="w-full px-5 py-4 bg-toss-grey-50 border border-transparent focus:bg-white focus:border-toss-blue rounded-[18px] text-[17px] outline-none transition-all placeholder:text-toss-grey-400"
                                required
                                disabled={loading}
                            />
                        )}
                    </div>

                    {error && (
                        <div className="text-toss-red text-sm font-medium text-center bg-toss-red-light py-3 rounded-[14px]">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-toss-blue text-white font-bold rounded-[18px] text-[17px] hover:bg-toss-blue-dark transition-all active:scale-[0.98] shadow-lg shadow-toss-blue/20"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                        ) : (
                            view === 'login' ? '로그인' : (view === 'signup' ? '동의하고 회원가입' : '재설정 메일 보내기')
                        )}
                    </button>
                </form>

                {/* Toggle Links */}
                <div className="text-center pt-2 space-y-2 flex flex-col items-center">
                    {view === 'login' && (
                        <>
                            <button onClick={() => setView('signup')} className="text-[14px] text-toss-grey-500 hover:text-toss-grey-800 transition-colors font-medium">
                                계정이 없으신가요? 회원가입
                            </button>
                            <button onClick={() => setView('reset')} className="text-[13px] text-toss-grey-400 hover:text-toss-grey-600 transition-colors">
                                비밀번호를 잊으셨나요?
                            </button>
                        </>
                    )}
                    {view === 'signup' && (
                        <button onClick={() => setView('login')} className="text-[14px] text-toss-grey-500 hover:text-toss-grey-800 transition-colors font-medium">
                            이미 계정이 있으신가요? 로그인
                        </button>
                    )}
                    {view === 'reset' && (
                        <button onClick={() => setView('login')} className="text-[14px] text-toss-grey-500 hover:text-toss-grey-800 transition-colors font-medium">
                            로그인으로 돌아가기
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
