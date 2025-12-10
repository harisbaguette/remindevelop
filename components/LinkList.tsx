'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Trash2, RefreshCw, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

type Link = {
    id: number
    url: string
    title: string
    description: string
    category: string
    type?: string
    image_url?: string
    created_at: string
}

interface LinkListProps {
    status: string
    keyProp: number
    searchQuery?: string
}

export default function LinkList({ status, keyProp, searchQuery = '' }: LinkListProps) {
    const [links, setLinks] = useState<Link[]>([])
    const [loading, setLoading] = useState(true)
    const [editingLink, setEditingLink] = useState<Link | null>(null)
    const [editForm, setEditForm] = useState({ title: '', description: '', category: '' })

    useEffect(() => {
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

    const emptyTrash = async () => {
        if (!confirm('휴지통을 비우시겠습니까?')) return

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('links')
            .delete()
            .eq('status', 'trash')
            .eq('user_id', user.id)

        if (!error) {
            setLinks([])
        }
    }

    const startEdit = (link: Link) => {
        setEditingLink(link)
        setEditForm({ title: link.title || '', description: link.description || '', category: link.category || '' })
    }

    const saveEdit = async () => {
        if (!editingLink) return

        const { error } = await supabase
            .from('links')
            .update({
                title: editForm.title,
                description: editForm.description,
                category: editForm.category
            })
            .eq('id', editingLink.id)

        if (!error) {
            setLinks(links.map(l => l.id === editingLink.id ? { ...l, ...editForm } : l))
            setEditingLink(null)
            toast.success('수정되었습니다')
        } else {
            toast.error('수정에 실패했습니다')
        }
    }

    // Filter links based on search query
    const filteredLinks = links.filter(link => {
        if (!searchQuery) return true
        const lowerQuery = searchQuery.toLowerCase()
        return (
            link.title?.toLowerCase().includes(lowerQuery) ||
            link.description?.toLowerCase().includes(lowerQuery) ||
            link.url?.toLowerCase().includes(lowerQuery) ||
            link.category?.toLowerCase().includes(lowerQuery)
        )
    })

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="toss-card h-32 animate-pulse bg-toss-grey-100"></div>
                ))}
            </div>
        )
    }

    if (filteredLinks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg text-toss-grey-500 font-medium">
                    {searchQuery ? '검색 결과가 없어요' : (status === 'active' ? '보관된 링크가 없어요' : '비어있어요')}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Empty Trash Button */}
            {status === 'trash' && links.length > 0 && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={emptyTrash}
                        className="text-sm text-toss-red font-medium hover:underline"
                    >
                        휴지통 비우기
                    </button>
                </div>
            )}

            {filteredLinks.map((link) => (
                <div
                    key={link.id}
                    className="toss-card group transition-all active:scale-[0.98] flex gap-4"
                >
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[13px] font-bold text-toss-blue bg-toss-blue-light px-2 py-0.5 rounded-[6px]">
                                {link.category}
                            </span>
                            <div className="flex gap-3">
                                {status !== 'trash' && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                updateStatus(link.id, 'trash')
                                            }}
                                            className="text-toss-grey-300 hover:text-toss-red transition-colors p-1"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                startEdit(link)
                                            }}
                                            className="text-toss-grey-300 hover:text-toss-blue transition-colors p-1"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                                {status === 'trash' && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                updateStatus(link.id, 'active')
                                            }}
                                            className="text-toss-grey-300 hover:text-toss-blue transition-colors p-1"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                deletePermanently(link.id)
                                            }}
                                            className="text-toss-grey-300 hover:text-toss-red transition-colors p-1"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                            <h3 className="text-[18px] font-bold text-toss-grey-900 mb-1 line-clamp-1">
                                {link.title || link.url}
                            </h3>
                            <p className="text-[15px] text-toss-grey-600 line-clamp-2 leading-relaxed">
                                {link.description}
                            </p>
                        </a>
                    </div>

                    {link.image_url && (
                        <div className="w-24 h-24 rounded-[12px] bg-toss-grey-50 overflow-hidden flex-shrink-0 border border-toss-grey-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={link.image_url}
                                alt={link.title}
                                className="w-full h-full object-cover"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                        </div>
                    )}
                </div>
            ))}
            {editingLink && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-5 px-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[24px] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-[18px] font-bold text-toss-grey-900 mb-5">링크 수정</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-medium text-toss-grey-500 mb-1.5">카테고리</label>
                                <input
                                    type="text"
                                    value={editForm.category}
                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                    className="toss-input w-full"
                                    placeholder="예: 개발, 요리, 뉴스"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-toss-grey-500 mb-1.5">제목</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="toss-input w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-toss-grey-500 mb-1.5">설명</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="toss-input w-full min-h-[80px] resize-none py-3"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setEditingLink(null)}
                                className="flex-1 py-3.5 bg-toss-grey-100 text-toss-grey-700 rounded-[16px] font-semibold text-[15px] active:scale-[0.98] transition-transform"
                            >
                                취소
                            </button>
                            <button
                                onClick={saveEdit}
                                className="flex-1 py-3.5 bg-toss-blue text-white rounded-[16px] font-semibold text-[15px] active:scale-[0.98] transition-transform shadow-lg shadow-toss-blue/20"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
