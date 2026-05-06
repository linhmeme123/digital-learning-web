'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [language, setLanguage] = useState('vi')
  const [notifications, setNotifications] = useState(true)
  const [theme, setTheme] = useState('light')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Cài đặt</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ngôn ngữ
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Giao diện
            </label>
            <div className="flex gap-3">
              {['light', 'dark'].map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={t}
                    checked={theme === t}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm capitalize text-gray-700">
                    {t === 'light' ? 'Sáng' : 'Tối'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Thông báo
            </label>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2 rounded-lg hover:shadow-lg transition-shadow"
          >
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  )
}
