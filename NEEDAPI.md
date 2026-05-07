1. Đăng nhập/phân quyền(auth-context.tsx (line 26)/LoginModal.tsx (line 21)) -> Done 
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout
- POST /api/auth/signup 
2. Danh sách lớp/khoá học(RoomsTab.tsx (line 86), thêm lớp ở ManagementTab.tsx (line 37), sửa/xóa ở ManagementTab.tsx (line 141))
- GET /api/courses
- GET /api/courses/:id
- POST /api/courses
- PATCH /api/courses/:id
- DELETE /api/courses/:id
3. Giáo viên(TeachersTab.tsx (line 4))
- GET /api/teachers
- GET /api/teachers/:id
- Nút đăng kí khoá học ở teaxhesTab có thể gọi chung API đăng kí 
4. Đăng kí học(HeroCarousel.tsx (line 48), RoomsTab.tsx (line 86), TeachersTab.tsx (line 83))
- POST /api/enrollments
- body mẫu { courseId, userId, note }
5. Nội dung trang chủ 
- HeroCarousel.tsx (line 5) dùng carouselItems.
- AboutTab.tsx (line 3) dùng achievements, còn giới thiệu/sứ mệnh/tầm nhìn đang hard-code.
- GET /api/home/slides
- GET /api/about
- GET /api/achievements
6. Cài đặt 
- GET /api/users/me/settings
- PATCH /api/users/me/settings
7. Lớp học 
- POST   /api/rooms/book

Các bảng cần
users
subjects
courses
classes
class_schedules
enrollments
teacher_profiles
rooms
room_bookings
payments

phân quyền 
STUDENT  - học viên
TEACHER  - giáo viên thuê phòng / mở lớp
ADMIN    - quản trị hệ thống

