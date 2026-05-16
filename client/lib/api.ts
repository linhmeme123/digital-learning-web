import { achievements, courses as initialCourses, teachers as initialTeachers } from "@/lib/mock-data";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  return Promise.reject(
    new Error(`Mock API chưa khai báo endpoint ${options.method || "GET"} ${endpoint}`)
  );
}

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  phone?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
};

export type MeResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
};

export type BasicResponse = {
  success: boolean;
  message: string;
};

export type CoursePayload = {
  name: string;
  level: string;
  schedule: string;
  class: string;
  duration: string;
  capacity: number;
  subject: string;
  classNumber: number;
};

export type ApiCourse = CoursePayload & {
  id: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CoursesResponse = {
  success: boolean;
  message: string;
  data: {
    courses: ApiCourse[];
  };
};

export type CourseResponse = {
  success: boolean;
  message: string;
  data: {
    course: ApiCourse;
  };
};

export type TeacherPayload = {
  name: string;
  subject: string;
  achievements: string[];
  image: string;
  description: string;
  quote: string;
  experience: string;
  courseIds: number[];
};

export type ApiTeacher = {
  id: number;
  name: string;
  subject: string;
  achievements: string[];
  image: string;
  description: string;
  quote: string;
  experience: string;
  courses: ApiCourse[];
  createdAt?: string;
  updatedAt?: string;
};

export type TeachersResponse = {
  success: boolean;
  message: string;
  data: {
    teachers: ApiTeacher[];
  };
};

export type TeacherResponse = {
  success: boolean;
  message: string;
  data: {
    teacher: ApiTeacher;
  };
};

export type HomeSlide = {
  id: number;
  title: string;
  description: string;
  image: string;
};

export type HomeAchievement = {
  icon: string;
  title: string;
  description: string;
};

export type HomeCoreValue = {
  title: string;
  description: string;
};

export type HomeContent = {
  id: number;
  heroSlides: HomeSlide[];
  introductionTitle: string;
  introductionBody: string[];
  achievements: HomeAchievement[];
  mission: string;
  vision: string;
  coreValues: HomeCoreValue[];
  createdAt?: string;
  updatedAt?: string;
};

export type HomeResponse = {
  success: boolean;
  message: string;
  data: {
    home: HomeContent;
  };
};

const now = new Date().toISOString();
const STORAGE_USER_KEY = "mock_current_user";

let mockUsers: AuthUser[] = [
  {
    id: "1",
    name: "Admin Lớp Học Số",
    email: "admin@lophocso.vn",
    role: "ADMIN",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "2",
    name: "Giáo viên Demo",
    email: "teacher@lophocso.vn",
    role: "TEACHER",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "3",
    name: "Học viên Demo",
    email: "student@lophocso.vn",
    role: "STUDENT",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];

function normalizeCourse(course: Partial<ApiCourse> & { id: number; name: string }, index: number): ApiCourse {
  const gradeMatch = course.name.match(/\d+/);
  const gradeLabel = gradeMatch ? `Lớp ${gradeMatch[0]}` : `Lớp ${index + 1}`;

  return {
    id: course.id,
    name: course.name,
    level: course.level || "Cơ Bản và Nâng cao",
    schedule: course.schedule || "Đang cập nhật",
    class: course.class || gradeLabel,
    duration: course.duration || "1.5 giờ/buổi",
    capacity: course.capacity || 20,
    subject: course.subject || "Toán",
    classNumber: course.classNumber || index + 1,
    createdAt: course.createdAt || now,
    updatedAt: course.updatedAt || now,
  };
}

let mockCoursesState: ApiCourse[] = initialCourses.map((course, index) => ({
  ...normalizeCourse(course, index),
  createdAt: now,
  updatedAt: now,
}));

let mockTeachersState: ApiTeacher[] = initialTeachers.map((teacher, index) => ({
  ...teacher,
  courses: mockCoursesState.filter(
    (course) => course.subject === teacher.subject || course.id % initialTeachers.length === index
  ),
  createdAt: now,
  updatedAt: now,
}));

let mockHomeState: HomeContent = {
  id: 1,
  heroSlides: [
    {
      id: 1,
      title: "Lớp Học Số",
      description: "Không gian học tập hiện đại cho học sinh, giáo viên và phụ huynh",
      image: "linear-gradient(135deg, #6d28d9 0%, #db2777 55%, #f59e0b 100%)",
    },
    {
      id: 2,
      title: "Theo lộ trình",
      description: "Theo dõi lớp, giáo viên, tài liệu và tiến độ học tập",
      image: "linear-gradient(135deg, #0f766e 0%, #2563eb 50%, #7c3aed 100%)",
    },
  ],
  introductionTitle: "Về Lớp Học Số",
  introductionBody: [
    "Lớp dạy kèm 1-1, dạy nhóm nhỏ",
    "Sau mỗi buổi học sẽ có tài liệu và video để học sinh ôn lại",
  ],
  achievements,
  mission: "Kết nối học viên, giáo viên và phụ huynh trong một trải nghiệm học tập dễ tiếp cận.",
  vision: "Trở thành nền tảng giới thiệu và quản lý lớp học linh hoạt cho các trung tâm giáo dục.",
  coreValues: [
    { title: "Rõ ràng", description: "Thông tin lớp học, tài liệu và giáo viên được công khai" },
    { title: "Tâm huyết", description: "Giáo viên luôn dạy học với tâm huyết và trách nhiệm" },
    { title: "Hiện đại", description: "Sử dụng các công nghệ dạy học mới và bài giảng mới nhất" },
    { title: "Tin cậy", description: "Phụ huynh có thể theo dõi tiến độ học tập của con" },
  ],
  createdAt: now,
  updatedAt: now,
};

function mockDelay<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), 180);
  });
}

function nextNumberId(items: Array<{ id: number }>) {
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function normalizeRole(role?: string): UserRole {
  const upperRole = role?.toUpperCase();
  return upperRole === "ADMIN" || upperRole === "TEACHER" ? upperRole : "STUDENT";
}

function getCurrentMockUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem(STORAGE_USER_KEY);
  return rawUser ? (JSON.parse(rawUser) as AuthUser) : null;
}

function setCurrentMockUser(user: AuthUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (user) {
    window.localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(STORAGE_USER_KEY);
  }
}

function mockAuthResponse(user: AuthUser, message: string): AuthResponse {
  setCurrentMockUser(user);
  return {
    success: true,
    message,
    data: {
      user,
      token: `mock-token-${user.id}`,
    },
  };
}

export const authApi = {
  signup(payload: {
    name: string;
    email: string;
    password: string;
    role?: "student" | "teacher" | "admin" | "STUDENT" | "TEACHER" | "ADMIN";
  }) {
    const normalizedEmail = payload.email.trim().toLowerCase();

    if (!payload.name || !normalizedEmail || !payload.password) {
      return Promise.reject(new Error("Vui lòng nhập đầy đủ thông tin đăng ký"));
    }

    if (payload.password.length < 6) {
      return Promise.reject(new Error("Mật khẩu phải có ít nhất 6 ký tự"));
    }

    if (mockUsers.some((user) => user.email === normalizedEmail)) {
      return Promise.reject(new Error("Email đã được sử dụng"));
    }

    const user: AuthUser = {
      id: String(mockUsers.length + 1),
      name: payload.name.trim(),
      email: normalizedEmail,
      role: normalizeRole(payload.role),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    mockUsers = [...mockUsers, user];
    return mockDelay(mockAuthResponse(user, "Đăng ký demo thành công"));
  },

  login(payload: { email: string; password: string }) {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const user = mockUsers.find((item) => item.email === normalizedEmail);

    if (!user || payload.password !== "123456") {
      return Promise.reject(
        new Error("Email hoặc mật khẩu không chính xác. Tài khoản demo dùng mật khẩu 123456.")
      );
    }

    return mockDelay(mockAuthResponse(user, "Đăng nhập demo thành công"));
  },

  me(_token?: string | null) {
    const user = getCurrentMockUser();

    if (!user) {
      return Promise.reject(new Error("Bạn chưa đăng nhập"));
    }

    return mockDelay({
      success: true,
      message: "Lấy thông tin người dùng demo thành công",
      data: {
        user,
      },
    });
  },

  logout() {
    setCurrentMockUser(null);
    return mockDelay({
      success: true,
      message: "Đăng xuất demo thành công",
    });
  },
};

export const coursesApi = {
  list() {
    return mockDelay({
      success: true,
      message: "Lấy danh sách khóa học demo thành công",
      data: {
        courses: mockCoursesState,
      },
    });
  },

  detail(id: number) {
    const course = mockCoursesState.find((item) => item.id === id);

    if (!course) {
      return Promise.reject(new Error("Không tìm thấy khóa học"));
    }

    return mockDelay({
      success: true,
      message: "Lấy khóa học demo thành công",
      data: {
        course,
      },
    });
  },

  create(payload: CoursePayload, _token?: string | null) {
    const course: ApiCourse = {
      ...payload,
      id: nextNumberId(mockCoursesState),
      createdAt: now,
      updatedAt: new Date().toISOString(),
    };

    mockCoursesState = [...mockCoursesState, course];

    return mockDelay({
      success: true,
      message: "Tạo khóa học demo thành công",
      data: {
        course,
      },
    });
  },

  update(id: number, payload: Partial<CoursePayload>, _token?: string | null) {
    const currentCourse = mockCoursesState.find((item) => item.id === id);

    if (!currentCourse) {
      return Promise.reject(new Error("Không tìm thấy khóa học"));
    }

    const course = {
      ...currentCourse,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    mockCoursesState = mockCoursesState.map((item) => (item.id === id ? course : item));
    mockTeachersState = mockTeachersState.map((teacher) => ({
      ...teacher,
      courses: teacher.courses.map((item) => (item.id === id ? course : item)),
    }));

    return mockDelay({
      success: true,
      message: "Cập nhật khóa học demo thành công",
      data: {
        course,
      },
    });
  },

  delete(id: number, _token?: string | null) {
    mockCoursesState = mockCoursesState.filter((item) => item.id !== id);
    mockTeachersState = mockTeachersState.map((teacher) => ({
      ...teacher,
      courses: teacher.courses.filter((course) => course.id !== id),
    }));

    return mockDelay({
      success: true,
      message: "Xóa khóa học demo thành công",
    });
  },
};

export const teachersApi = {
  list() {
    return mockDelay({
      success: true,
      message: "Lấy danh sách giáo viên demo thành công",
      data: {
        teachers: mockTeachersState,
      },
    });
  },

  detail(id: number) {
    const teacher = mockTeachersState.find((item) => item.id === id);

    if (!teacher) {
      return Promise.reject(new Error("Không tìm thấy giáo viên"));
    }

    return mockDelay({
      success: true,
      message: "Lấy giáo viên demo thành công",
      data: {
        teacher,
      },
    });
  },

  create(payload: TeacherPayload, _token?: string | null) {
    const teacher: ApiTeacher = {
      id: nextNumberId(mockTeachersState),
      name: payload.name,
      subject: payload.subject,
      achievements: payload.achievements,
      image: payload.image || "/placeholder-user.jpg",
      description: payload.description,
      quote: payload.quote,
      experience: payload.experience,
      courses: mockCoursesState.filter((course) => payload.courseIds.includes(course.id)),
      createdAt: now,
      updatedAt: new Date().toISOString(),
    };

    mockTeachersState = [...mockTeachersState, teacher];

    return mockDelay({
      success: true,
      message: "Tạo giáo viên demo thành công",
      data: {
        teacher,
      },
    });
  },

  update(id: number, payload: Partial<TeacherPayload>, _token?: string | null) {
    const currentTeacher = mockTeachersState.find((item) => item.id === id);

    if (!currentTeacher) {
      return Promise.reject(new Error("Không tìm thấy giáo viên"));
    }

    const teacher: ApiTeacher = {
      ...currentTeacher,
      ...payload,
      image: payload.image ?? currentTeacher.image,
      courses: payload.courseIds
        ? mockCoursesState.filter((course) => payload.courseIds?.includes(course.id))
        : currentTeacher.courses,
      updatedAt: new Date().toISOString(),
    };

    mockTeachersState = mockTeachersState.map((item) => (item.id === id ? teacher : item));

    return mockDelay({
      success: true,
      message: "Cập nhật giáo viên demo thành công",
      data: {
        teacher,
      },
    });
  },

  delete(id: number, _token?: string | null) {
    mockTeachersState = mockTeachersState.filter((item) => item.id !== id);

    return mockDelay({
      success: true,
      message: "Xóa giáo viên demo thành công",
    });
  },
};

export const homeApi = {
  get() {
    return mockDelay({
      success: true,
      message: "Lấy nội dung trang chủ demo thành công",
      data: {
        home: mockHomeState,
      },
    });
  },

  update(payload: Partial<HomeContent>, _token?: string | null) {
    mockHomeState = {
      ...mockHomeState,
      ...payload,
      id: mockHomeState.id,
      updatedAt: new Date().toISOString(),
    };

    return mockDelay({
      success: true,
      message: "Cập nhật nội dung trang chủ demo thành công",
      data: {
        home: mockHomeState,
      },
    });
  },
};
