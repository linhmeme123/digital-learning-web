import { CarouselItem, Achievement, Teacher, Course } from './types';

export const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: 'Môn Toán',
    description: 'Khóa học lập trình web toàn diện từ cơ bản đến nâng cao',
    image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
];

export const achievements: Achievement[] = [
  {
    icon: '🎓',
    title: '20 năm kinh nghiệm',
    description: 'Giảng dạy trong ngành Toán học',
  },
];

export const teachers: Teacher[] = [
  {
    id: 1,
    name: 'Nguyễn Thị Thu Hằng',
    subject: 'Dạy Toán',
    achievements: ['Thạc sĩ chuyên ngành phương pháp Toán sơ cấp', 'Thành viên hội toán học Hà Nội', 'Giáo viên toán THPT Lê Quý Đôn-Đống Đa'],
    image: 'https://i.ibb.co/NgdbcF9m/Chat-GPT-Image-May-16-2026-10-37-02-PM.png',
    description: 'Với 25 năm kinh nghiệm giảng dạy Toán học, luyện ôn thi THPT và bồi dưỡng học sinh giỏi ôn thi Olympic, cô Hằng đã có các chuyên đề báo cáo ở các hội thảo toán học về chương trình đổi mới của Bộ Giáo Dục.',
    quote: 'Toán học không chỉ là con số, mà là cách để giải quyết các vấn đề thực tế một cách hiệu quả.',
    experience: '25 năm kinh nghiệm',
  },
];

export const courses: Course[] = [
  {
    id: 1,
    name: 'Toán 6',
    level: 'Cơ bản và Nâng cao',
    schedule: 'Thứ 3, 5 - 19:30-21:00',
    class: 'Lớp 6',
    duration: '1.5 giờ/buổi',
    capacity: 20,
    subject: 'Toán',
    classNumber: 6,
  },
  {
    id: 2,
    name: 'Toán 11',
    level: 'Cơ Bản và Nâng cao',
    schedule: 'Thứ 6, 7 - 19:30-21:00',
    class: 'Lớp 11',
    duration: '1.5 giờ/buổi',
    capacity: 20,
    subject: 'Toán',
    classNumber: 11,
  },
  {
    id: 3,
    name: 'Toán 12',
    level: 'Cơ Bản và Nâng cao',
    schedule: 'Thứ 2, 4 - 19:30-21:00',
    class: 'Lớp 12',
    duration: '1.5 giờ/buổi',
    capacity: 20,
    subject: 'Toán',
    classNumber: 12,
  },
];
