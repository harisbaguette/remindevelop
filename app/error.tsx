'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-toss-grey-100 p-4">
            <div className="bg-white p-8 rounded-[32px] shadow-lg max-w-sm w-full text-center">
                <h2 className="text-xl font-bold text-toss-grey-900 mb-2">오류가 발생했어요</h2>
                <p className="text-toss-grey-600 mb-6 text-[15px]">
                    일시적인 오류일 수 있습니다.<br />다시 시도해 주세요.
                </p>
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="w-full py-4 bg-toss-blue text-white rounded-[16px] font-semibold text-[16px] active:scale-[0.98] transition-transform"
                >
                    다시 시도하기
                </button>
            </div>
        </div>
    )
}
