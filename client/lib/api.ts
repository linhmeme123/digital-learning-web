import { courses as mockCourses, teachers as baseMockTeachers } from "@/lib/mock-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Có lỗi xảy ra khi gọi API");
  }

  return data;
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

let mockCurrentUser: AuthUser | null = null;
let mockCoursesState: ApiCourse[] = mockCourses.map((course) => ({
  ...course,
  createdAt: now,
  updatedAt: now,
}));
let mockTeachersState: ApiTeacher[] = baseMockTeachers.map((teacher, index) => ({
  ...teacher,
  courses: mockCoursesState.filter((course) => course.subject === teacher.subject || course.id % baseMockTeachers.length === index),
  createdAt: now,
  updatedAt: now,
}));
let mockHomeState: HomeContent = {
  id: 1,
  heroSlides: [
    {
      id: 1,
      title: "Môn Toán",
      description: "Lộ trình học chắc nền tảng, bám sát mục tiêu của từng học viên",
      image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: 2,
      title: "Môn Vật Lý",
      description: "Hiểu bản chất hiện tượng và luyện giải bài tập theo chủ đề",
      image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: 3,
      title: "Môn Hoá Học",
      description: "Nắm chắc lý thuyết, phản ứng và phương pháp giải nhanh",
      image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ],
  introductionTitle: "Về Lớp Học Số",
  introductionBody: [
    "Lớp Học Số là một trung tâm giáo dục ứng dụng công nghệ để giúp học viên học tập linh hoạt, có lộ trình và có người đồng hành.",
    "Với đội ngũ giáo viên có kinh nghiệm và phương pháp giảng dạy hiện đại, chúng tôi giúp học viên nắm vững kiến thức và tự tin tiến bộ.",
  ],
  achievements: [
    { icon: "🎓", title: "5 năm kinh nghiệm", description: "Giảng dạy liên tục và cải tiến chương trình học" },
    { icon: "👥", title: "2000+ học viên", description: "Đồng hành cùng nhiều thế hệ học viên" },
    { icon: "⭐", title: "4.9/5 đánh giá", description: "Chất lượng học tập được học viên xác nhận" },
    { icon: "🏆", title: "Giáo viên chất lượng", description: "Đội ngũ giáo viên có chuyên môn và kinh nghiệm thực tế" },
  ],
  mission: "Trang bị cho học viên kiến thức nền tảng, tư duy tự học và kỹ năng giải quyết vấn đề.",
  vision: "Trở thành môi trường học tập số đáng tin cậy, nơi học viên có thể phát triển toàn diện và bền vững.",
  coreValues: [
    { title: "Chất Lượng", description: "Đảm bảo chất lượng giáo dục cao nhất" },
    { title: "Sáng Tạo", description: "Khuyến khích sự sáng tạo và đổi mới" },
    { title: "Cộng Tác", description: "Hợp tác với học viên để đạt mục tiêu chung" },
    { title: "Tiên Phong", description: "Luôn theo dõi và áp dụng công nghệ mới" },
  ],
  createdAt: now,
  updatedAt: now,
};

function mockDelay<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), 150);
  });
}

function nextNumberId(items: Array<{ id: number }>) {
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function normalizeRole(role?: string): UserRole {
  const upperRole = role?.toUpperCase();
  return upperRole === "ADMIN" || upperRole === "TEACHER" ? upperRole : "STUDENT";
}

function mockAuthResponse(user: AuthUser, message: string): AuthResponse {
  mockCurrentUser = user;
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
    if (USE_MOCK) {
      const user: AuthUser = {
        id: String(mockUsers.length + 1),
        name: payload.name,
        email: payload.email,
        role: normalizeRole(payload.role),
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };
      mockUsers = [...mockUsers, user];
      return mockDelay(mockAuthResponse(user, "Đăng ký mock thành công"));
    }

    return apiRequest<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: payload,
    });
  },

  login(payload: { email: string; password: string }) {
    if (USE_MOCK) {
      const user = mockUsers.find((item) => item.email === payload.email);
      if (!user || payload.password !== "123456") {
        return Promise.reject(new Error("Email hoặc mật khẩu không chính xác. Mock dùng mật khẩu 123456."));
      }
      return mockDelay(mockAuthResponse(user, "Đăng nhập mock thành công"));
    }

    return apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: payload,
    });
  },

  me(token?: string | null) {
    if (USE_MOCK) {
      if (!token || !mockCurrentUser) {
        return Promise.reject(new Error("Bạn chưa đăng nhập"));
      }

      return mockDelay({
        success: true,
        message: "Lấy thông tin người dùng mock thành công",
        data: {
          user: mockCurrentUser,
        },
      });
    }

    return apiRequest<MeResponse>("/api/auth/me", {
      method: "GET",
      token,
    });
  },

  logout() {
    if (USE_MOCK) {
      mockCurrentUser = null;
      return mockDelay({
        success: true,
        message: "Đăng xuất mock thành công",
      });
    }

    return apiRequest<BasicResponse>("/api/auth/logout", {
      method: "POST",
    });
  },
};

export const coursesApi = {
  list() {
    if (USE_MOCK) {
      return mockDelay({
        success: true,
        message: "Lấy danh sách khóa học mock thành công",
        data: {
          courses: mockCoursesState,
        },
      });
    }

    return apiRequest<CoursesResponse>("/api/courses");
  },

  detail(id: number) {
    if (USE_MOCK) {
      const course = mockCoursesState.find((item) => item.id === id);
      if (!course) return Promise.reject(new Error("Không tìm thấy khóa học"));
      return mockDelay({
        success: true,
        message: "Lấy khóa học mock thành công",
        data: {
          course,
        },
      });
    }

    return apiRequest<CourseResponse>(`/api/courses/${id}`);
  },

  create(payload: CoursePayload, token?: string | null) {
    if (USE_MOCK) {
      const course: ApiCourse = {
        ...payload,
        id: nextNumberId(mockCoursesState),
        createdAt: now,
        updatedAt: now,
      };
      mockCoursesState = [...mockCoursesState, course];
      return mockDelay({
        success: true,
        message: "Tạo khóa học mock thành công",
        data: {
          course,
        },
      });
    }

    return apiRequest<CourseResponse>("/api/courses", {
      method: "POST",
      body: payload,
      token,
    });
  },

  update(id: number, payload: Partial<CoursePayload>, token?: string | null) {
    if (USE_MOCK) {
      const currentCourse = mockCoursesState.find((item) => item.id === id);
      if (!currentCourse) return Promise.reject(new Error("Không tìm thấy khóa học"));

      const course = { ...currentCourse, ...payload, updatedAt: new Date().toISOString() };
      mockCoursesState = mockCoursesState.map((item) => (item.id === id ? course : item));
      mockTeachersState = mockTeachersState.map((teacher) => ({
        ...teacher,
        courses: teacher.courses.map((item) => (item.id === id ? course : item)),
      }));
      return mockDelay({
        success: true,
        message: "Cập nhật khóa học mock thành công",
        data: {
          course,
        },
      });
    }

    return apiRequest<CourseResponse>(`/api/courses/${id}`, {
      method: "PATCH",
      body: payload,
      token,
    });
  },

  delete(id: number, token?: string | null) {
    if (USE_MOCK) {
      mockCoursesState = mockCoursesState.filter((item) => item.id !== id);
      mockTeachersState = mockTeachersState.map((teacher) => ({
        ...teacher,
        courses: teacher.courses.filter((course) => course.id !== id),
      }));
      return mockDelay({
        success: true,
        message: "Xóa khóa học mock thành công",
      });
    }

    return apiRequest<BasicResponse>(`/api/courses/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

export const teachersApi = {
  list() {
    if (USE_MOCK) {
      return mockDelay({
        success: true,
        message: "Lấy danh sách giáo viên mock thành công",
        data: {
          teachers: mockTeachersState,
        },
      });
    }

    return apiRequest<TeachersResponse>("/api/teachers");
  },

  detail(id: number) {
    if (USE_MOCK) {
      const teacher = mockTeachersState.find((item) => item.id === id);
      if (!teacher) return Promise.reject(new Error("Không tìm thấy giáo viên"));
      return mockDelay({
        success: true,
        message: "Lấy giáo viên mock thành công",
        data: {
          teacher,
        },
      });
    }

    return apiRequest<TeacherResponse>(`/api/teachers/${id}`);
  },

  create(payload: TeacherPayload, token?: string | null) {
    if (USE_MOCK) {
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
        updatedAt: now,
      };
      mockTeachersState = [...mockTeachersState, teacher];
      return mockDelay({
        success: true,
        message: "Tạo giáo viên mock thành công",
        data: {
          teacher,
        },
      });
    }

    return apiRequest<TeacherResponse>("/api/teachers", {
      method: "POST",
      body: payload,
      token,
    });
  },

  update(id: number, payload: Partial<TeacherPayload>, token?: string | null) {
    if (USE_MOCK) {
      const currentTeacher = mockTeachersState.find((item) => item.id === id);
      if (!currentTeacher) return Promise.reject(new Error("Không tìm thấy giáo viên"));

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
        message: "Cập nhật giáo viên mock thành công",
        data: {
          teacher,
        },
      });
    }

    return apiRequest<TeacherResponse>(`/api/teachers/${id}`, {
      method: "PATCH",
      body: payload,
      token,
    });
  },

  delete(id: number, token?: string | null) {
    if (USE_MOCK) {
      mockTeachersState = mockTeachersState.filter((item) => item.id !== id);
      return mockDelay({
        success: true,
        message: "Xóa giáo viên mock thành công",
      });
    }

    return apiRequest<BasicResponse>(`/api/teachers/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

export const homeApi = {
  get() {
    if (USE_MOCK) {
      return mockDelay({
        success: true,
        message: "Lấy nội dung trang chủ mock thành công",
        data: {
          home: mockHomeState,
        },
      });
    }

    return apiRequest<HomeResponse>("/api/home");
  },

  update(payload: Partial<HomeContent>, token?: string | null) {
    if (USE_MOCK) {
      mockHomeState = {
        ...mockHomeState,
        ...payload,
        id: mockHomeState.id,
        updatedAt: new Date().toISOString(),
      };
      return mockDelay({
        success: true,
        message: "Cập nhật nội dung trang chủ mock thành công",
        data: {
          home: mockHomeState,
        },
      });
    }

    return apiRequest<HomeResponse>("/api/home", {
      method: "PATCH",
      body: payload,
      token,
    });
  },
};
