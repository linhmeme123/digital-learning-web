'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Clock, Edit2, FileText, Loader2, Lock, Plus, Trash2, Upload, Users, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { coursesApi } from '@/lib/api'
import { Course } from '@/lib/types'
import { useAuth } from '@/hooks/auth-context'

type CourseFormState = Omit<Course, 'id'>

const emptyForm: CourseFormState = {
  name: '',
  level: 'Cơ bản',
  schedule: '',
  class: '',
  duration: '',
  capacity: 20,
  subject: '',
  classNumber: 1,
}

export default function RoomsTab() {
  const { user, isAdmin, isTeacher, isStudent } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState<CourseFormState>(emptyForm)

  const visibleCourses = useMemo(() => {
    if (isAdmin || !user) {
      return courses
    }

    if (isTeacher) {
      return courses.filter((course) => [1, 4, 7, 9].includes(course.id))
    }

    if (isStudent) {
      return courses.filter((course) => [1, 2, 5].includes(course.id))
    }

    return courses
  }, [courses, isAdmin, isStudent, isTeacher, user])

  const groupedCourses = useMemo(() => {
    return visibleCourses.reduce((acc, course) => {
      const existing = acc.find((group) => group.subject === course.subject)
      if (existing) {
        existing.courses.push(course)
      } else {
        acc.push({ subject: course.subject, courses: [course] })
      }
      return acc
    }, [] as Array<{ subject: string; courses: Course[] }>)
  }, [visibleCourses])

  const loadCourses = async () => {
    setError('')
    setIsLoading(true)

    try {
      const response = await coursesApi.list()
      setCourses(response.data.courses)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách khóa học')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

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

  const openCreateForm = () => {
    setEditingCourse(null)
    setForm(emptyForm)
    setIsFormOpen(true)
  }

  const openEditForm = (course: Course) => {
    setEditingCourse(course)
    setForm({
      name: course.name,
      level: course.level,
      schedule: course.schedule,
      class: course.class,
      duration: course.duration,
      capacity: course.capacity,
      subject: course.subject,
      classNumber: course.classNumber,
    })
    setIsFormOpen(true)
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
        classNumber: Number(form.classNumber),
      }

      if (editingCourse) {
        const response = await coursesApi.update(editingCourse.id, payload)
        setCourses((current) => current.map((course) => (course.id === editingCourse.id ? response.data.course : course)))
      } else {
        const response = await coursesApi.create(payload)
        setCourses((current) => [...current, response.data.course])
      }

      setIsFormOpen(false)
      setEditingCourse(null)
      setForm(emptyForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu khóa học')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (course: Course) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khóa học "${course.name}"?`)) {
      return
    }

    setError('')

    try {
      await coursesApi.delete(course.id)
      setCourses((current) => current.filter((item) => item.id !== course.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa khóa học')
    }
  }

  const pageTitle = isAdmin
    ? 'Quản lý lớp học'
    : isTeacher
      ? 'Lớp tôi dạy'
      : isStudent
        ? 'Lớp học của học sinh'
        : 'Lớp học'

  const pageDescription = isAdmin
    ? 'Admin có thể thêm, chỉnh sửa và xóa lớp học trên hệ thống.'
    : isTeacher
      ? 'Giáo viên xem các lớp được phân công và chỉnh sửa tài liệu học tập.'
      : isStudent
        ? 'Học sinh/phụ huynh xem các lớp đang theo học và tài liệu của lớp.'
        : 'Khách có thể xem toàn bộ lớp học công khai, nhưng cần đăng nhập để xem tài liệu.'

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h2>
          <p className="text-gray-600">
            {pageDescription}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
          >
            <Plus size={18} />
            Thêm khóa học
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl border border-purple-100 bg-white py-16 text-purple-600">
          <Loader2 className="animate-spin" size={28} />
        </div>
      ) : visibleCourses.length === 0 ? (
        <div className="rounded-2xl border border-purple-100 bg-white py-16 text-center">
          <p className="text-lg font-bold text-gray-900">Chưa có khóa học nào</p>
          <p className="mt-2 text-sm text-gray-500">Admin có thể thêm khóa học mới tại đây.</p>
        </div>
      ) : (
        <>
          <div className="space-y-10">
            {groupedCourses.map((group) => (
              <div key={group.subject} className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded" />
                  <h3 className="text-2xl font-bold text-gray-900">{group.subject}</h3>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                    {group.courses.length} lớp
                  </span>
                </div>

                <div className="grid gap-4">
                  {group.courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-purple-100"
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-lg">
                                {course.classNumber}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">
                                {course.name}
                              </h4>
                              <p className="text-sm text-gray-600">Lớp: {course.class}</p>
                              {isTeacher && <p className="text-xs font-semibold text-purple-600 mt-1">Bạn đang phụ trách lớp này</p>}
                              {isStudent && <p className="text-xs font-semibold text-purple-600 mt-1">Đang theo học</p>}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                              {course.level}
                            </span>
                            {isAdmin ? (
                              <>
                                <button
                                  onClick={() => openEditForm(course)}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded font-bold text-sm hover:bg-blue-100 transition-colors"
                                >
                                  <Edit2 size={14} />
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleDelete(course)}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded font-bold text-sm hover:bg-red-100 transition-colors"
                                >
                                  <Trash2 size={14} />
                                  Xóa
                                </button>
                              </>
                            ) : !user ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 rounded font-bold text-sm">
                                <Lock size={14} />
                                Tài liệu khóa
                              </span>
                            ) : (
                              <button className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded font-medium text-sm hover:shadow-lg transition-shadow whitespace-nowrap">
                                Vào lớp
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                          <CourseMeta icon={Clock} label="Lịch học" value={course.schedule} color="purple" />
                          <CourseMeta icon={BookOpen} label="Thời lượng" value={course.duration} color="pink" />
                          <CourseMeta icon={Users} label="Sức chứa" value={`Tối đa ${course.capacity} học viên`} color="green" />
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

                        <ClassDocuments course={course} isGuest={!user} isTeacher={isTeacher} isStudent={isStudent} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block mt-12 bg-white rounded-lg shadow-sm overflow-hidden border border-purple-100">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                <tr>
                  {['Môn học', 'Lớp', 'Mức độ', 'Lịch học', 'Thời lượng', 'Sức chứa', 'Hành động'].map((heading) => (
                    <th key={heading} className={`px-6 py-3 text-sm font-bold text-gray-900 ${heading === 'Hành động' ? 'text-right' : 'text-left'}`}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visibleCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{course.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.class}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.schedule}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.duration}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.capacity} học viên</td>
                    <td className="px-6 py-4 text-right">
                      {isAdmin ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditForm(course)} className="text-blue-600 hover:text-blue-700 font-bold text-sm">
                            Sửa
                          </button>
                          <button onClick={() => handleDelete(course)} className="text-red-600 hover:text-red-700 font-bold text-sm">
                            Xóa
                          </button>
                        </div>
                      ) : !user ? (
                        <span className="text-gray-400 font-medium text-sm">Không có quyền xem tài liệu</span>
                      ) : (
                        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                          Vào lớp
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {isAdmin && isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-purple-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <CourseInput label="Tên khóa học" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
              <CourseInput label="Môn học" value={form.subject} onChange={(value) => setForm((current) => ({ ...current, subject: value }))} />
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Trình độ</label>
                <select
                  value={form.level}
                  onChange={(event) => setForm((current) => ({ ...current, level: event.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option>Cơ bản</option>
                  <option>Trung bình</option>
                  <option>Nâng cao</option>
                </select>
              </div>
              <CourseInput label="Lớp" value={form.class} onChange={(value) => setForm((current) => ({ ...current, class: value }))} />
              <CourseInput label="Lịch học" value={form.schedule} onChange={(value) => setForm((current) => ({ ...current, schedule: value }))} />
              <CourseInput label="Thời lượng" value={form.duration} onChange={(value) => setForm((current) => ({ ...current, duration: value }))} />
              <CourseInput label="Sức chứa" type="number" value={String(form.capacity)} onChange={(value) => setForm((current) => ({ ...current, capacity: Number(value) }))} />
              <CourseInput label="Số lớp" type="number" value={String(form.classNumber)} onChange={(value) => setForm((current) => ({ ...current, classNumber: Number(value) }))} />

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg disabled:opacity-70"
                >
                  {isSaving && <Loader2 size={18} className="animate-spin" />}
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ClassDocuments({
  course,
  isGuest,
  isTeacher,
  isStudent,
}: {
  course: Course
  isGuest: boolean
  isTeacher: boolean
  isStudent: boolean
}) {
  const documents = [
    `Giáo án ${course.name}`,
    `Bài tập tuần ${course.classNumber}`,
    `Tài liệu ôn tập ${course.level}`,
  ]

  if (isGuest) {
    return (
      <div className="mt-5 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-3 text-gray-500">
          <Lock size={18} />
          <p className="text-sm font-semibold">Khách chỉ xem thông tin lớp học. Đăng nhập để xem tài liệu.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50/40 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-purple-700">Tài liệu lớp học</p>
          <p className="text-xs text-gray-500">
            {isTeacher ? 'Giáo viên có thể cập nhật tài liệu như một lớp Teams.' : 'Tài liệu chỉ hiển thị với thành viên của lớp.'}
          </p>
        </div>
        {isTeacher && (
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-purple-600 shadow-sm hover:bg-purple-100">
            <Upload size={15} />
            Thêm tài liệu
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {documents.map((document) => (
          <div key={document} className="rounded-lg bg-white p-3 shadow-sm border border-purple-100">
            <div className="flex items-start gap-2">
              <FileText size={18} className="mt-0.5 shrink-0 text-purple-600" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">{document}</p>
                <p className="text-xs text-gray-500">PDF • cập nhật gần đây</p>
              </div>
            </div>
            {isTeacher && (
              <button className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700">
                Sửa tài liệu
              </button>
            )}
            {isStudent && (
              <button className="mt-3 text-xs font-bold text-purple-600 hover:text-purple-700">
                Xem tài liệu
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function CourseMeta({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon
  label: string
  value: string
  color: 'purple' | 'pink' | 'green'
}) {
  const colors = {
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
    green: 'bg-green-100 text-green-600',
  }

  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg flex-shrink-0 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase">{label}</p>
        <p className="text-sm text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  )
}

function CourseInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'number'
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        required
        min={type === 'number' ? 1 : undefined}
      />
    </div>
  )
}
