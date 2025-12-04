import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-5 bg-toss-grey-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-toss-grey-900 mb-2">리마인드 보관소</h1>
                    <p className="text-toss-grey-600">링크를 저장하고 AI로 정리하세요</p>
                </div>
                <AuthForm />
            </div>
        </main>
    )
}
