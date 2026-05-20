'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Edit2, Loader2, Plus, Quote, Trash2, Users, X } from 'lucide-react'
import { coursesApi, teachersApi } from '@/lib/api'
import { Course, Teacher } from '@/lib/types'
import { useAuth } from '@/hooks/auth-context'

type TeacherFormState = {
  name: string
  subject: string
  achievementsText: string
  image: string
  description: string
  quote: string
  experience: string
  courseIds: number[]
}

const emptyForm: TeacherFormState = {
  name: '',
  subject: '',
  achievementsText: '',
  image: '',
  description: '',
  quote: '',
  experience: '',
  courseIds: [],
}

export default function TeachersTab() {
  const { isAdmin } = useAuth()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [form, setForm] = useState<TeacherFormState>(emptyForm)

  const courseOptionsBySubject = useMemo(() => {
    return courses.reduce((acc, course) => {
      const existing = acc.find((group) => group.subject === course.subject)
      if (existing) {
        existing.courses.push(course)
      } else {
        acc.push({ subject: course.subject, courses: [course] })
      }
      return acc
    }, [] as Array<{ subject: string; courses: Course[] }>)
  }, [courses])

  const loadData = async () => {
    setError('')
    setIsLoading(true)

    try {
      const [teachersResponse, coursesResponse] = await Promise.all([
        teachersApi.list(),
        coursesApi.list(),
      ])

      setTeachers(teachersResponse.data.teachers)
      setCourses(coursesResponse.data.courses)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách giáo viên')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openCreateForm = () => {
    setEditingTeacher(null)
    setForm(emptyForm)
    setIsFormOpen(true)
  }

  const openEditForm = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setForm({
      name: teacher.name,
      subject: teacher.subject,
      achievementsText: teacher.achievements.join('\n'),
      image: teacher.image,
      description: teacher.description,
      quote: teacher.quote,
      experience: teacher.experience,
      courseIds: teacher.courses?.map((course) => course.id) || [],
    })
    setIsFormOpen(true)
  }

  const toggleCourse = (courseId: number) => {
    setForm((current) => ({
      ...current,
      courseIds: current.courseIds.includes(courseId)
        ? current.courseIds.filter((id) => id !== courseId)
        : [...current.courseIds, courseId],
    }))
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    const payload = {
      name: form.name,
      subject: form.subject,
      achievements: form.achievementsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      image: form.image,
      description: form.description,
      quote: form.quote,
      experience: form.experience,
      courseIds: form.courseIds,
    }

    try {
      if (editingTeacher) {
        const response = await teachersApi.update(editingTeacher.id, payload)
        setTeachers((current) => current.map((teacher) => (teacher.id === editingTeacher.id ? response.data.teacher : teacher)))
      } else {
        const response = await teachersApi.create(payload)
        setTeachers((current) => [...current, response.data.teacher])
      }

      setIsFormOpen(false)
      setEditingTeacher(null)
      setForm(emptyForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu giáo viên')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (teacher: Teacher) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa giáo viên "${teacher.name}"?`)) {
      return
    }

    setError('')

    try {
      await teachersApi.delete(teacher.id)
      setTeachers((current) => current.filter((item) => item.id !== teacher.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa giáo viên')
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Giáo Viên</h2>
          <p className="text-gray-600">
            Giáo viên và lời chia sẻ
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
          >
            <Plus size={18} />
            Thêm giáo viên
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
      ) : teachers.length === 0 ? (
        <div className="rounded-2xl border border-purple-100 bg-white py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Users size={28} />
          </div>
          <p className="text-lg font-bold text-gray-900">Chưa có giáo viên nào</p>
          <p className="mt-2 text-sm text-gray-500">
            {isAdmin ? 'Bạn có thể thêm giáo viên đầu tiên cho trung tâm.' : 'Danh sách giáo viên sẽ được cập nhật sau.'}
          </p>
          {isAdmin && (
            <button
              onClick={openCreateForm}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <Plus size={18} />
              Thêm giáo viên
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-purple-100"
            >
              <div className="grid md:grid-cols-3 gap-6 p-6">
                <div className="md:col-span-1">
                  <div className="relative h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl overflow-hidden">
                    <img
                      src={teacher.image || '/placeholder-user.jpg'}
                      alt={teacher.name}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = '/placeholder-user.jpg'
                      }}
                    />
                  </div>
                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <p className="text-sm font-semibold text-purple-900 mb-2">Kinh nghiệm:</p>
                    <p className="text-lg font-bold text-purple-600">{teacher.experience}</p>
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col justify-between">
                  <div className="mb-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {teacher.name}
                        </h3>
                        <p className="text-lg font-semibold text-purple-600">
                          {teacher.subject}
                        </p>
                      </div>

                      {isAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditForm(teacher)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100"
                          >
                            <Edit2 size={15} />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(teacher)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100"
                          >
                            <Trash2 size={15} />
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="mt-4 text-gray-700 leading-relaxed">
                      {teacher.description}
                    </p>

                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-600 rounded">
                      <div className="flex gap-3">
                        <Quote className="mt-0.5 shrink-0 text-purple-500" size={20} />
                        <p className="text-gray-700 italic">
                          &quot;{teacher.quote}&quot;
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {teacher.achievements.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600 uppercase mb-3">
                          Thành tích và chứng chỉ
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {teacher.achievements.map((achievement) => (
                            <div
                              key={achievement}
                              className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                            >
                              <span className="text-purple-600 font-bold">✓</span>
                              <span className="text-sm text-gray-700">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-semibold text-gray-600 uppercase mb-3">
                        Lớp phụ trách
                      </p>
                      {teacher.courses && teacher.courses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {teacher.courses.map((course) => (
                            <div key={course.id} className="rounded-xl border border-purple-100 bg-purple-50/60 p-3">
                              <div className="flex items-start gap-2">
                                <BookOpen size={18} className="mt-0.5 shrink-0 text-purple-600" />
                                <div>
                                  <p className="font-bold text-gray-900">{course.name}</p>
                                  <p className="text-xs font-medium text-gray-500">
                                    {course.class} • {course.schedule}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Chưa được phân công lớp.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAdmin && isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-purple-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingTeacher ? 'Chỉnh sửa giáo viên' : 'Thêm giáo viên'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="max-h-[calc(90vh-80px)] overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TeacherInput label="Tên giáo viên" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
                <TeacherInput label="Chuyên môn" value={form.subject} onChange={(value) => setForm((current) => ({ ...current, subject: value }))} />
                <TeacherInput label="Ảnh đại diện URL" value={form.image} onChange={(value) => setForm((current) => ({ ...current, image: value }))} required={false} />
                <TeacherInput label="Kinh nghiệm" value={form.experience} onChange={(value) => setForm((current) => ({ ...current, experience: value }))} />
                <TeacherTextarea label="Mô tả" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} />
                <TeacherTextarea label="Lời chia sẻ" value={form.quote} onChange={(value) => setForm((current) => ({ ...current, quote: value }))} />
                <TeacherTextarea
                  label="Thành tích, mỗi dòng một mục"
                  value={form.achievementsText}
                  onChange={(value) => setForm((current) => ({ ...current, achievementsText: value }))}
                  required={false}
                />
              </div>

              <div className="mt-6">
                <p className="block text-sm font-semibold text-gray-700 mb-3">Lớp phụ trách</p>
                {courseOptionsBySubject.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                    Chưa có khóa học nào để phân công.
                  </div>
                ) : (
                  <div className="space-y-4 rounded-xl border border-gray-100 p-4">
                    {courseOptionsBySubject.map((group) => (
                      <div key={group.subject}>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-600">{group.subject}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {group.courses.map((course) => (
                            <label key={course.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 p-3 hover:bg-purple-50">
                              <input
                                type="checkbox"
                                checked={form.courseIds.includes(course.id)}
                                onChange={() => toggleCourse(course.id)}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600"
                              />
                              <span>
                                <span className="block text-sm font-bold text-gray-900">{course.name}</span>
                                <span className="block text-xs text-gray-500">{course.class} • {course.schedule}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
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

function TeacherInput({
  label,
  value,
  onChange,
  required = true,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        required={required}
      />
    </div>
  )
}

function TeacherTextarea({
  label,
  value,
  onChange,
  required = true,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <div className="space-y-2 md:col-span-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-none px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        required={required}
      />
    </div>
  )
}
