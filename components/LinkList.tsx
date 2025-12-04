'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { ExternalLink, Check, Trash2, Archive, Clock, Tag, RefreshCw } from 'lucide-react'

type Link = {
    id: number
    url: string
    title: string
    description: string
    category: string
    created_at: string
}

export default function LinkList({ status = 'active', keyProp }: { status?: string, keyProp?: number }) {
    const [links, setLinks] = useState<Link[]>([])
    const [loading, setLoading] = useState(true)

    const fetchLinks = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', status)
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching links:', error)
        else setLinks(data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchLinks()
    }, [status, keyProp])

    const updateStatus = async (id: number, newStatus: string) => {
        const { error } = await supabase
            .from('links')
            .update({ status: newStatus })
            .eq('id', id)

        if (!error) {
            setLinks(links.filter(link => link.id !== id))
        }
    }

    const deletePermanently = async (id: number) => {
        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', id)

        if (!error) {
            setLinks(links.filter(link => link.id !== id))
        }
    }

    if (loading) return <div className="text-center text-toss-grey-500 mt-10">링크 로딩 중...</div>

    if (links.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-toss-grey-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Archive className="w-8 h-8 text-toss-grey-400" />
                </div>
                <h3 className="text-xl font-bold text-toss-grey-800">링크가 없습니다</h3>
                <p className="text-toss-grey-500 mt-2">
                    {status === 'active' ? '위의 URL을 붙여넣어 시작하세요!' : '이 목록은 비어 있습니다.'}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {links.map((link) => (
                <div key={link.id} className="toss-card flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-toss-blue-light text-toss-blue text-xs font-bold rounded-[6px]">
                                    {link.category}
                                </span>
                                <span className="text-xs text-toss-grey-500">
                                    {new Date(link.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-toss-grey-900 leading-snug mb-1 truncate">
                                {link.title || link.url}
                            </h3>
                            <p className="text-sm text-toss-grey-600 line-clamp-2 leading-relaxed">
                                {link.description || '요약 없음'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-toss-grey-100 mt-1">
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm font-semibold text-toss-blue hover:text-[#1B64DA] transition-colors py-2"
                        >
                            방문하기 <ExternalLink className="w-4 h-4" />
                        </a>

                        <div className="flex items-center gap-1">
                            {status === 'active' && (
                                <>
                                    <button
                                        onClick={() => updateStatus(link.id, 'archive')}
                                        className="p-2 text-toss-grey-500 hover:text-toss-grey-800 hover:bg-toss-grey-100 rounded-full transition-all"
                                        title="보관함으로 이동"
                                    >
                                        <Archive className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => updateStatus(link.id, 'trash')}
                                        className="p-2 text-toss-grey-500 hover:text-toss-red hover:bg-toss-red-light rounded-full transition-all"
                                        title="휴지통으로 이동"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                            {status === 'archive' && (
                                <>
                                    <button
                                        onClick={() => updateStatus(link.id, 'active')}
                                        className="p-2 text-toss-grey-500 hover:text-toss-blue hover:bg-toss-blue-light rounded-full transition-all"
                                        title="다시 활성화"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => updateStatus(link.id, 'trash')}
                                        className="p-2 text-toss-grey-500 hover:text-toss-red hover:bg-toss-red-light rounded-full transition-all"
                                        title="휴지통으로 이동"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                            {status === 'trash' && (
                                <>
                                    <button
                                        onClick={() => updateStatus(link.id, 'active')}
                                        className="p-2 text-toss-grey-500 hover:text-toss-blue hover:bg-toss-blue-light rounded-full transition-all"
                                        title="복구"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => deletePermanently(link.id)}
                                        className="p-2 text-toss-red hover:bg-toss-red-light rounded-full transition-all"
                                        title="영구 삭제"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
