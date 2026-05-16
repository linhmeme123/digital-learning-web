'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Edit2, Trash2, BookOpen, Clock, GraduationCap, ChevronRight, CreditCard, Building2, Receipt, Loader2 } from 'lucide-react'
import { coursesApi } from '@/lib/api'
import { Course } from '@/lib/types'

export default function ManagementTab() {
  const [classList, setClassList] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const subjects = useMemo(() => {
    return Array.from(new Set(classList.map((item) => item.subject))).sort()
  }, [classList])

  const filteredClasses = classList.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === 'all' || course.subject === subjectFilter

    return matchesSearch && matchesSubject
  })

  const loadCourses = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await coursesApi.list()
      setClassList(response.data.courses)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách lớp học')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      return
    }

    setError('')

    try {
      await coursesApi.delete(id)
      setClassList((current) => current.filter((course) => course.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa lớp học')
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
              <GraduationCap size={28} />
            </div>
            Quản Lý Toàn Hệ Thống
          </h2>
          <p className="text-gray-500 mt-1 font-medium">Admin quản lý lớp học, thu học phí và tiền thuê phòng</p>
        </div>

        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-purple-200 transition-all active:scale-95 group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Thêm Lớp Mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <CreditCard className="text-purple-600" size={22} />
                Thu học phí
              </h3>
              <p className="text-sm text-gray-500 mt-1">Theo dõi trạng thái đóng phí của học viên</p>
            </div>
            <button className="rounded-xl bg-purple-50 px-4 py-2 text-sm font-bold text-purple-600 hover:bg-purple-100">
              Tạo phiếu thu
            </button>
          </div>
          <div className="p-6 text-sm font-medium text-gray-500">
            Chưa có API học phí. Khu vực này sẽ hiển thị dữ liệu thật khi backend bổ sung endpoint payments.
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Building2 className="text-pink-600" size={22} />
                Tiền thuê phòng
              </h3>
              <p className="text-sm text-gray-500 mt-1">Quản lý chi phí phòng dạy theo ca học</p>
            </div>
            <button className="rounded-xl bg-pink-50 px-4 py-2 text-sm font-bold text-pink-600 hover:bg-pink-100">
              Ghi nhận chi phí
            </button>
          </div>
          <div className="p-6 text-sm font-medium text-gray-500">
            Chưa có API thuê phòng. Khu vực này sẽ hiển thị dữ liệu thật khi backend bổ sung endpoint rooms hoặc room bookings.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Tổng số lớp', value: classList.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Học phí tháng', value: 'Chưa có API', icon: Receipt, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Tiền phòng tuần', value: 'Chưa có API', icon: Clock, color: 'text-pink-600', bg: 'bg-pink-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-purple-100 shadow-xl overflow-hidden">
        {error && (
          <div className="border-b border-red-100 bg-red-50 px-6 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên môn học hoặc mã lớp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all bg-white"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
              className="flex-1 md:w-40 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white font-medium text-gray-600"
            >
              <option value="all">Tất cả môn</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">Lớp & Môn học</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">Lịch học</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">Trình độ</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">Sĩ số</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider border-b border-gray-100 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-purple-600">
                    <Loader2 className="mx-auto animate-spin" size={28} />
                  </td>
                </tr>
              ) : filteredClasses.length > 0 ? (
                filteredClasses.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 rounded-xl flex items-center justify-center font-bold text-xs">
                          {item.id}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{item.name}</p>
                          <p className="text-xs font-medium text-gray-500">{item.subject} • {item.class}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={14} className="text-gray-400" />
                        <span className="font-medium">{item.schedule}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.level === 'Nâng cao' ? 'bg-red-50 text-red-600' :
                        item.level === 'Trung bình' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {item.level}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-700">{item.capacity}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Chỉnh sửa">
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                        <Search size={48} />
                      </div>
                      <p className="font-bold text-gray-400 text-lg">Không tìm thấy lớp học nào</p>
                      <button
                        onClick={() => {
                          setSearchTerm('')
                          setSubjectFilter('all')
                        }}
                        className="text-purple-600 font-bold hover:underline mt-2"
                      >
                        Xóa bộ lọc tìm kiếm
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
