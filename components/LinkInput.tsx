'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, ArrowUp } from 'lucide-react'
import { toast } from 'sonner'

interface LinkInputProps {
    onLinkAdded: () => void
    initialValue?: string
}

export default function LinkInput({ onLinkAdded, initialValue = '' }: LinkInputProps) {
    const [url, setUrl] = useState(initialValue)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url.trim()) return

        setLoading(true)
        try {
            // 1. Get AI Classification
            const res = await fetch('/api/classify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })

            if (!res.ok) throw new Error('Failed to classify')

            const aiData = await res.json()

            // 2. Save to Supabase
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase.from('links').insert({
                user_id: user.id,
                url,
                title: aiData.title,
                description: aiData.summary,
                category: aiData.category,
                type: aiData.type || 'link',
                image_url: aiData.image || null,
                status: 'active'
            })

            if (error) throw error

            setUrl('')
            onLinkAdded()
            toast.success('링크가 저장되었습니다')
        } catch (error) {
            console.error('Error adding link:', error)
            toast.error('링크 저장에 실패했습니다')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full relative">
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="복사한 링크를 붙여넣으세요"
                className="toss-input pr-12"
                disabled={loading}
            />
            <button
                type="submit"
                disabled={loading || !url.trim()}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-toss-blue disabled:text-toss-grey-300 transition-colors"
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <ArrowUp className="w-6 h-6" />
                )}
            </button>
        </form>
    )
}
