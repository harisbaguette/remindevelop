'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AuthForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [saveId, setSaveId] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const savedEmail = localStorage.getItem('savedEmail')
        if (savedEmail) {
            setEmail(savedEmail)
            setSaveId(true)
        }
    }, [])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        let authEmail = email
        let authPassword = password

        // Master Account Logic
        if (email === 'master' && password === '1111') {
            authEmail = 'master@remind.app'
            authPassword = 'master1234' // Internal secure password for master account
        }

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: authEmail,
                    password: authPassword,
                })

                if (error) {
                    // Auto-create master account if it doesn't exist and credentials match master logic
                    if (email === 'master' && password === '1111' && error.message.includes('Invalid login credentials')) {
                        const { error: signUpError } = await supabase.auth.signUp({
                            email: authEmail,
                            password: authPassword,
                        })
                        if (signUpError) throw signUpError
                        // Retry login after signup
                        const { error: retryError } = await supabase.auth.signInWithPassword({
                            email: authEmail,
                            password: authPassword,
                        })
                        if (retryError) throw retryError
                    } else {
                        throw error
                    }
                }

                // Handle Save ID
                if (saveId) {
                    localStorage.setItem('savedEmail', email)
                } else {
                    localStorage.removeItem('savedEmail')
                }

                router.push('/')
            } else {
                const { error } = await supabase.auth.signUp({
                    email: authEmail,
                    password: authPassword,
                })
                if (error) throw error
                alert('로그인 링크를 이메일로 확인하세요!')
            }
        } catch (err: any) {
            setError(err.message === 'Invalid login credentials' ? '아이디 또는 비밀번호가 잘못되었습니다.' : err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl shadow-toss-grey-200/50 animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-toss-grey-900 mb-2">
                    {isLogin ? '반가워요 👋' : '회원가입'}
                </h1>
                <p className="text-toss-grey-500 text-sm">
                    {isLogin ? '서비스 이용을 위해 로그인해주세요' : '이메일로 간편하게 가입하세요'}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-toss-grey-500 ml-1">아이디 (이메일)</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="toss-input"
                        placeholder="이메일 또는 master"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-toss-grey-500 ml-1">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="toss-input"
                        placeholder="비밀번호 입력"
                        required
                    />
                </div>

                {isLogin && (
                    <div className="flex items-center ml-1">
                        <input
                            type="checkbox"
                            id="saveId"
                            checked={saveId}
                            onChange={(e) => setSaveId(e.target.checked)}
                            className="w-4 h-4 rounded border-toss-grey-300 text-toss-blue focus:ring-toss-blue"
                        />
                        <label htmlFor="saveId" className="ml-2 text-sm text-toss-grey-600 cursor-pointer">
                            아이디 저장
                        </label>
                    </div>
                )}

                {error && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-500 text-sm text-center font-medium animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="toss-button w-full mt-4"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        isLogin ? '로그인' : '동의하고 회원가입'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-toss-grey-500 hover:text-toss-grey-800 transition-colors underline underline-offset-4"
                >
                    {isLogin ? "계정이 없으신가요? 회원가입" : '이미 계정이 있으신가요? 로그인'}
                </button>
            </div>
        </div>
    )
}
