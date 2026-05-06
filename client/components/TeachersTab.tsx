'use client'

import Image from 'next/image'
import { teachers } from '@/lib/mock-data'

export default function TeachersTab() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đội Ngũ Giáo Viên</h2>
        <p className="text-gray-600 mb-8">
          Các giáo viên chuyên nghiệp với kinh nghiệm thực tế và chứng chỉ quốc tế
        </p>
      </div>

      <div className="space-y-8">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all border border-purple-100"
          >
            <div className="grid md:grid-cols-3 gap-6 p-6">
              {/* Image Section */}
              <div className="md:col-span-1">
                <div className="relative h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden">
                  <Image
                    src={teacher.image}
                    alt={teacher.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.id}`
                    }}
                  />
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900 mb-2">Kinh nghiệm:</p>
                  <p className="text-lg font-bold text-purple-600">{teacher.experience}</p>
                </div>
              </div>

              {/* Content Section */}
              <div className="md:col-span-2 flex flex-col justify-between">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {teacher.name}
                  </h3>
                  <p className="text-lg font-semibold text-purple-600 mb-4">
                    {teacher.subject}
                  </p>

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {teacher.description}
                  </p>

                  {/* Quote */}
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-600 rounded">
                    <p className="text-gray-700 italic">
                      &quot;{teacher.quote}&quot;
                    </p>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-3">
                    Thành tích và chứng chỉ
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {teacher.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        <span className="text-purple-600 font-bold">✓</span>
                        <span className="text-sm text-gray-700">{achievement}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg transition-shadow">
                    Đăng ký khóa học
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
