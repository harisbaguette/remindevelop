'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Loader2 } from 'lucide-react'

export default function LinkInput({ onLinkAdded }: { onLinkAdded: () => void }) {
    const [url, setUrl] = useState('')
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
                status: 'active'
            })

            if (error) throw error

            setUrl('')
            onLinkAdded()
        } catch (error) {
            console.error('Error adding link:', error)
            alert('Failed to add link. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-3">
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="링크를 붙여넣으세요 (https://...)"
                    className="toss-input"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="toss-button"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <span className="flex items-center gap-2 text-[17px]">
                            <Plus className="w-5 h-5" />
                            저장하기
                        </span>
                    )}
                </button>
            </div>
        </form>
    )
}
