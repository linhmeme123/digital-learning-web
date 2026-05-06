'use client'

import { useState } from 'react'
import { Menu, Settings, LogIn, X } from 'lucide-react'
import LoginModal from './LoginModal'
import SettingsModal from './SettingsModal'

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { id: 'about', label: 'Giới thiệu' },
    { id: 'teachers', label: 'Giáo viên' },
    { id: 'rooms', label: 'Phòng luyện' },
  ]

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Lớp Học Số
              </h1>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  type="button"
                  style={{ pointerEvents: 'auto' }}
                  className={`text-sm font-medium transition-all cursor-pointer pb-1 active:scale-95 hover:opacity-80 ${
                    activeTab === item.id
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                aria-label="Cài đặt"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow text-sm font-medium"
              >
                <LogIn size={16} />
                Đăng nhập
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-purple-600"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-purple-100 py-4 space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  type="button"
                  style={{ pointerEvents: 'auto' }}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-purple-100 text-purple-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setIsLoginOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                type="button"
                style={{ pointerEvents: 'auto' }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
              >
                <LogIn size={16} />
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  )
}
