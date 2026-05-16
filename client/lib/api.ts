const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

export const authApi = {
  signup(payload: {
    name: string;
    email: string;
    password: string;
    role?: "student" | "teacher" | "admin" | "STUDENT" | "TEACHER" | "ADMIN";
  }) {
    return apiRequest<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: payload,
    });
  },

  login(payload: { email: string; password: string }) {
    return apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: payload,
    });
  },

  me(token?: string | null) {
    return apiRequest<MeResponse>("/api/auth/me", {
      method: "GET",
      token,
    });
  },

  logout() {
    return apiRequest<BasicResponse>("/api/auth/logout", {
      method: "POST",
    });
  },
};

export const coursesApi = {
  list() {
    return apiRequest<CoursesResponse>("/api/courses");
  },

  detail(id: number) {
    return apiRequest<CourseResponse>(`/api/courses/${id}`);
  },

  create(payload: CoursePayload, token?: string | null) {
    return apiRequest<CourseResponse>("/api/courses", {
      method: "POST",
      body: payload,
      token,
    });
  },

  update(id: number, payload: Partial<CoursePayload>, token?: string | null) {
    return apiRequest<CourseResponse>(`/api/courses/${id}`, {
      method: "PATCH",
      body: payload,
      token,
    });
  },

  delete(id: number, token?: string | null) {
    return apiRequest<BasicResponse>(`/api/courses/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

export const teachersApi = {
  list() {
    return apiRequest<TeachersResponse>("/api/teachers");
  },

  detail(id: number) {
    return apiRequest<TeacherResponse>(`/api/teachers/${id}`);
  },

  create(payload: TeacherPayload, token?: string | null) {
    return apiRequest<TeacherResponse>("/api/teachers", {
      method: "POST",
      body: payload,
      token,
    });
  },

  update(id: number, payload: Partial<TeacherPayload>, token?: string | null) {
    return apiRequest<TeacherResponse>(`/api/teachers/${id}`, {
      method: "PATCH",
      body: payload,
      token,
    });
  },

  delete(id: number, token?: string | null) {
    return apiRequest<BasicResponse>(`/api/teachers/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

export const homeApi = {
  get() {
    return apiRequest<HomeResponse>("/api/home");
  },

  update(payload: Partial<HomeContent>, token?: string | null) {
    return apiRequest<HomeResponse>("/api/home", {
      method: "PATCH",
      body: payload,
      token,
    });
  },
};
