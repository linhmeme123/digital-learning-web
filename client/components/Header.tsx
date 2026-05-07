'use client'

import { useState } from 'react'
import type { ElementType } from 'react'
import { Menu, LogIn, X, LogOut, User as UserIcon, ShieldCheck, GraduationCap, DoorOpen } from 'lucide-react'
import LoginModal from './LoginModal'
import { useAuth } from '@/hooks/auth-context'

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout, isAdmin, isTeacher, isStudent } = useAuth()

  const menuItems: Array<{ id: string; label: string; icon?: ElementType }> = [
    { id: 'about', label: 'Giới thiệu' },
    { id: 'teachers', label: 'Giáo viên' },
    { id: 'rooms', label: 'Khóa học' },
  ]

  if (isAdmin) {
    menuItems.push({ id: 'management', label: 'Quản lý', icon: ShieldCheck })
    menuItems.push({ id: 'account', label: 'Tài khoản', icon: UserIcon })
  } else if (isTeacher) {
    menuItems.push({ id: 'teachingClasses', label: 'Lớp tôi dạy', icon: GraduationCap })
    menuItems.push({ id: 'teachingRooms', label: 'Phòng dạy', icon: DoorOpen })
    menuItems.push({ id: 'account', label: 'Tài khoản', icon: UserIcon })
  } else if (isStudent) {
    menuItems.push({ id: 'myClasses', label: 'Lớp của tôi', icon: GraduationCap })
    menuItems.push({ id: 'account', label: 'Tài khoản', icon: UserIcon })
  }

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    setIsMobileMenuOpen(false)
  }

  const roleLabel = user?.role === 'ADMIN' ? 'Admin' : user?.role === 'TEACHER' ? 'Teacher' : 'Student'

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                L
              </div>
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:block">
                Lớp Học Số
              </h1>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`text-sm font-semibold transition-all px-3 py-2 rounded-lg ${
                    activeTab === item.id
                      ? 'bg-purple-50 text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                  } flex items-center gap-1`}
                >
                  {item.icon && <item.icon size={16} className="text-purple-500" />}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-bold text-gray-900 leading-none">{user.name}</span>
                    <span className="text-[10px] font-medium text-purple-600 uppercase tracking-wider">{roleLabel}</span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    title="Đăng xuất"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all text-sm font-bold active:scale-95"
                >
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </button>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-purple-100 py-4 space-y-2 pb-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? 'bg-purple-100 text-purple-600 font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon && <item.icon size={20} />}
                  {item.label}
                </button>
              ))}
              {!user && (
                <button
                  onClick={() => {
                    setIsLoginOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg"
                >
                  <LogIn size={20} />
                  Đăng nhập
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
