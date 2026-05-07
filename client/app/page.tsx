'use client'

import { useState, useEffect } from 'react'
import type { ElementType } from 'react'
import Header from '@/components/Header'
import HeroCarousel from '@/components/HeroCarousel'
import AboutTab from '@/components/AboutTab'
import TeachersTab from '@/components/TeachersTab'
import RoomsTab from '@/components/RoomsTab'
import ManagementTab from '@/components/ManagementTab'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/auth-context'
import { ShieldAlert, Construction, CalendarDays, FileText, UserCircle, BookOpen, DoorOpen, Users } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('about')
  const { user, isAdmin, isTeacher, isStudent, isLoading } = useAuth()

  useEffect(() => {
    const guestTabs = ['about', 'teachers', 'rooms']
    const studentTabs = [...guestTabs, 'myClasses', 'account']
    const teacherTabs = [...guestTabs, 'teachingClasses', 'teachingRooms', 'account']
    const adminTabs = [...guestTabs, 'management', 'account']
    const allowedTabs = isAdmin ? adminTabs : isTeacher ? teacherTabs : isStudent ? studentTabs : guestTabs

    if (!allowedTabs.includes(activeTab)) {
      setActiveTab('about')
    }
  }, [activeTab, isAdmin, isTeacher, isStudent])

  const renderPlaceholder = (title: string) => (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-3xl border border-purple-100 shadow-sm">
      <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
        <Construction size={48} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-500 max-w-md">Tính năng này đang được phát triển. Vui lòng quay lại sau!</p>
    </div>
  )

  const renderFeatureGrid = (
    title: string,
    description: string,
    features: Array<{ title: string; description: string; icon: ElementType }>
  ) => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div key={feature.title} className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <feature.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAccount = () => {
    if (!user) {
      return renderPlaceholder('Tài khoản')
    }

    const roleLabel = user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'TEACHER' ? 'Giáo viên' : 'Học viên'

    return (
      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-purple-600 flex items-center justify-center shadow-sm">
              <UserCircle size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-purple-600 font-semibold">{roleLabel}</p>
            </div>
          </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Email</p>
            <p className="font-semibold text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Số điện thoại</p>
            <p className="font-semibold text-gray-900">{user.phone || 'Chưa cập nhật'}</p>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutTab />
      case 'courses':
        return renderPlaceholder('Danh sách Khoá học')
      case 'teachers':
        return <TeachersTab />
      case 'rooms':
        return <RoomsTab />
      case 'myClasses':
        return renderFeatureGrid('Lớp của tôi', 'Theo dõi lớp đã đăng ký, lịch học và tài liệu của bạn.', [
          { title: 'Lớp đã đăng ký', description: 'Danh sách lớp học bạn đang tham gia sẽ được hiển thị tại đây.', icon: BookOpen },
          { title: 'Lịch học', description: 'Lịch học theo tuần, phòng học và trạng thái buổi học.', icon: CalendarDays },
          { title: 'Tài liệu', description: 'Tài liệu, bài tập và đường dẫn học tập theo từng lớp.', icon: FileText },
        ])
      case 'teachingClasses':
        return renderFeatureGrid('Lớp tôi dạy', 'Quản lý lớp đang phụ trách, lịch dạy và danh sách học viên.', [
          { title: 'Lớp phụ trách', description: 'Các lớp được phân công cho giáo viên đăng nhập.', icon: BookOpen },
          { title: 'Lịch dạy', description: 'Lịch dạy theo ngày, ca học và trạng thái buổi học.', icon: CalendarDays },
          { title: 'Học viên', description: 'Danh sách học viên, sĩ số và tiến độ từng lớp.', icon: Users },
        ])
      case 'teachingRooms':
        return renderFeatureGrid('Phòng dạy', 'Theo dõi phòng dạy, lịch sử dụng phòng và thông tin buổi học.', [
          { title: 'Phòng được phân công', description: 'Danh sách phòng học dành cho các lớp bạn giảng dạy.', icon: DoorOpen },
          { title: 'Lịch sử dụng', description: 'Lịch đặt phòng theo ngày và theo ca học.', icon: CalendarDays },
          { title: 'Ghi chú phòng', description: 'Thông tin thiết bị, trạng thái phòng và ghi chú vận hành.', icon: FileText },
        ])
      case 'account':
        return renderAccount()
      case 'management':
        if (isAdmin) {
          return <ManagementTab />
        }
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-3xl border border-red-100 shadow-sm">
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
              <ShieldAlert size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Quyền truy cập bị từ chối</h2>
            <p className="text-gray-500 max-w-md">Bạn cần đăng nhập với quyền Quản trị viên để truy cập trang này.</p>
          </div>
        )
      default:
        return <AboutTab />
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50">
        <div className="text-sm font-semibold text-purple-600">Đang kiểm tra phiên đăng nhập...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {activeTab === 'about' && (
            <section className="w-full mb-12 md:mb-16">
              <HeroCarousel />
            </section>
          )}

          <section className="w-full">
            {renderContent()}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
