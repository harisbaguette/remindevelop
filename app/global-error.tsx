'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html>
            <body className="flex items-center justify-center min-h-screen bg-[#f2f4f6]">
                <div className="bg-white p-8 rounded-[32px] shadow-lg max-w-sm w-full text-center m-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">치명적인 오류가 발생했어요</h2>
                    <p className="text-gray-600 mb-6 text-[15px]">
                        앱을 다시 시작하거나<br />잠시 후 다시 시도해 주세요.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="w-full py-4 bg-[#3182f6] text-white rounded-[16px] font-semibold text-[16px] active:scale-[0.98] transition-transform"
                    >
                        다시 시도하기
                    </button>
                </div>
            </body>
        </html>
    )
}
