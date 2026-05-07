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
