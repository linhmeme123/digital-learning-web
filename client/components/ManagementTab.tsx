'use client'

import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, BookOpen, Clock, Users, GraduationCap, ChevronRight } from 'lucide-react'
import { courses } from '@/lib/mock-data'
import { Course } from '@/lib/types'

export default function ManagementTab() {
  const [classList, setClassList] = useState<Course[]>(courses)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredClasses = classList.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      setClassList(classList.filter(c => c.id !== id))
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
              <GraduationCap size={28} />
            </div>
            Quản Lý Lớp Học
          </h2>
          <p className="text-gray-500 mt-1 font-medium">Hệ thống quản lý danh sách lớp học và học viên</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-purple-200 transition-all active:scale-95 group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Thêm Lớp Mới
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Tổng số lớp', value: classList.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Tổng học viên', value: classList.reduce((acc, curr) => acc + curr.capacity, 0), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Giờ giảng dạy', value: '120h+', icon: Clock, color: 'text-pink-600', bg: 'bg-pink-50' },
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

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-xl overflow-hidden">
        {/* Toolbar */}
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
            <select className="flex-1 md:w-40 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white font-medium text-gray-600">
              <option>Tất cả môn</option>
              <option>Môn Toán</option>
              <option>Môn Vật Lý</option>
              <option>Môn Hoá Học</option>
            </select>
          </div>
        </div>

        {/* Table */}
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
              {filteredClasses.length > 0 ? (
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
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500">
                              U{i}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm font-bold text-gray-700">{item.capacity}</span>
                      </div>
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
                        onClick={() => setSearchTerm('')}
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
