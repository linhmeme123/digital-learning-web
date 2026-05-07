export interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Achievement {
  icon: string;
  title: string;
  description: string;
}

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  achievements: string[];
  image: string;
  description: string;
  quote: string;
  experience: string;
  courses?: Course[];
}

export interface Course {
  id: number;
  name: string;
  level: string;
  schedule: string;
  class: string;
  duration: string;
  capacity: number;
  subject: string;
  classNumber: number;
}

export interface CourseGroup {
  subject: string;
  courses: Course[];
}

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  phone?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
