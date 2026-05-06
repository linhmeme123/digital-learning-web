'use client'

import { Clock, Users, BookOpen } from 'lucide-react'
import { courses } from '@/lib/mock-data'

export default function RoomsTab() {
  // Group courses by subject
  const groupedCourses = courses.reduce((acc, course) => {
    const existing = acc.find(group => group.subject === course.subject)
    if (existing) {
      existing.courses.push(course)
    } else {
      acc.push({ subject: course.subject, courses: [course] })
    }
    return acc
  }, [] as Array<{ subject: string; courses: typeof courses }>)

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Cơ bản':
        return 'bg-blue-100 text-blue-800'
      case 'Trung bình':
        return 'bg-yellow-100 text-yellow-800'
      case 'Nâng cao':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Phòng Luyện</h2>
        <p className="text-gray-600 mb-8">
          Danh sách các khóa học, lớp học và lịch trình chi tiết
        </p>
      </div>

      {/* Grouped Courses by Subject */}
      <div className="space-y-10">
        {groupedCourses.map((group) => (
          <div key={group.subject} className="space-y-4">
            {/* Subject Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
              <h3 className="text-2xl font-bold text-gray-900">{group.subject}</h3>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                {group.courses.length} lớp
              </span>
            </div>

            {/* Courses for this subject */}
            <div className="grid gap-4">
              {group.courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-purple-100"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        {/* Class Number Badge */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {course.classNumber}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">
                            {course.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Lớp: {course.class}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(
                            course.level
                          )}`}
                        >
                          {course.level}
                        </span>
                        <button className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded font-medium text-sm hover:shadow-lg transition-shadow whitespace-nowrap">
                          Đăng ký
                        </button>
                      </div>
                    </div>

                    {/* Course Details */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                      {/* Schedule */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                          <Clock className="text-purple-600" size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">
                            Lịch học
                          </p>
                          <p className="text-sm text-gray-900 font-medium">
                            {course.schedule}
                          </p>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-pink-100 rounded-lg flex-shrink-0">
                          <BookOpen className="text-pink-600" size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">
                            Thời lượng
                          </p>
                          <p className="text-sm text-gray-900 font-medium">
                            {course.duration}
                          </p>
                        </div>
                      </div>

                      {/* Capacity */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                          <Users className="text-green-600" size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">
                            Sức chứa
                          </p>
                          <p className="text-sm text-gray-900 font-medium">
                            Tối đa {course.capacity} học viên
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                          <div className="w-5 h-5 rounded-full bg-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase">
                            Trạng thái
                          </p>
                          <p className="text-sm text-green-600 font-medium">
                            Có chỗ trống
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Table View for Desktop */}
      <div className="hidden lg:block mt-12 bg-white rounded-lg shadow-sm overflow-hidden border border-purple-100">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                Môn học
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                Lớp
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                Mức độ
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                Lịch học
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                Thời lượng
              </th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                Sức chứa
              </th>
              <th className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {course.subject}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {course.class}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getLevelColor(
                      course.level
                    )}`}
                  >
                    {course.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {course.schedule}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {course.duration}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {course.capacity} học viên
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                    Đăng ký
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
