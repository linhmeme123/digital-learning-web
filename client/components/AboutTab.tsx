'use client'

import { useState } from 'react'
import { Edit2, Loader2, X } from 'lucide-react'
import { HomeContent, homeApi } from '@/lib/api'
import { useAuth } from '@/hooks/auth-context'

type AboutTabProps = {
  content: HomeContent | null
  onContentUpdated: (content: HomeContent) => void
}

export default function AboutTab({ content, onContentUpdated }: AboutTabProps) {
  const { isAdmin } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState('')

  if (!content) {
    return (
      <div className="rounded-2xl border border-purple-100 bg-white py-16 text-center text-purple-600">
        <Loader2 className="mx-auto animate-spin" size={28} />
      </div>
    )
  }

  const openEditor = () => {
    setForm(JSON.stringify(content, null, 2))
    setError('')
    setIsEditing(true)
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const payload = JSON.parse(form)
      const response = await homeApi.update(payload)
      onContentUpdated(response.data.home)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nội dung JSON chưa hợp lệ hoặc không thể lưu')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-12">
      {isAdmin && (
        <div className="flex justify-end">
          <button onClick={openEditor} className="inline-flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-2 font-bold text-purple-600 hover:bg-purple-100">
            <Edit2 size={16} />
            Chỉnh sửa trang chủ
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.introductionTitle}</h2>
        {content.introductionBody.map((paragraph) => (
          <p key={paragraph} className="text-lg text-gray-600 leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">Giá Trị Cốt Lõi</h3>
        <ul className="space-y-3">
          {content.coreValues.map((value) => (
            <li key={value.title} className="flex items-start gap-3">
              <span className="text-xl">✓</span>
              <span><strong>{value.title}:</strong> {value.description}</span>
            </li>
          ))}
        </ul>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleSave} className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-purple-100 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
              <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa nội dung trang chủ</h3>
              <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>}
              <textarea value={form} onChange={(event) => setForm(event.target.value)} rows={22} className="w-full rounded-xl border border-gray-200 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditing(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-50">Hủy</button>
                <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 font-bold text-white disabled:opacity-70">
                  {isSaving && <Loader2 size={18} className="animate-spin" />}
                  Lưu
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
