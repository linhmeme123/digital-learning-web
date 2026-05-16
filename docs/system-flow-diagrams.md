# So do use case va may trang thai he thong

Tai lieu nay tom tat luong hien tai cua du an "Lop Hoc So" dua tren folder `client/` va `server/`.

## Tong quan du an

- Frontend: Next.js/React trong `client/`.
- Backend: Express trong `server/`.
- Database: PostgreSQL qua Prisma.
- Auth: JWT, luu bang HTTP-only cookie `access_token`; frontend cung luu token/user trong `localStorage`.
- Role hien co: `STUDENT`, `TEACHER`, `ADMIN`.
- API that su hien co: auth, courses, teachers, home content.
- Cac tinh nang dang la mock/placeholder: quan ly hoc phi, tien thue phong, tai lieu lop hoc, dang ky khoa hoc/enrollment, dat phong, settings.

## So do use case

```mermaid
flowchart LR
    Guest["Khach / phu huynh"]
    Student["Hoc vien"]
    Teacher["Giao vien"]
    Admin["Quan tri vien"]

    subgraph System["He thong Lop Hoc So"]
        UC_ViewHome["Xem trang gioi thieu va hero"]
        UC_ViewTeachers["Xem danh sach giao vien"]
        UC_ViewCourses["Xem danh sach lop/khoa hoc"]
        UC_Signup["Dang ky tai khoan"]
        UC_Login["Dang nhap"]
        UC_Logout["Dang xuat"]
        UC_ViewAccount["Xem thong tin tai khoan"]
        UC_ViewDocs["Xem tai lieu lop hoc"]
        UC_EnterClass["Vao lop"]
        UC_UploadDocs["Them/sua tai lieu lop hoc"]
        UC_ManageCourses["Them/sua/xoa khoa hoc"]
        UC_ManageTeachers["Them/sua/xoa giao vien"]
        UC_AssignTeacher["Phan cong giao vien vao khoa hoc"]
        UC_EditHome["Chinh sua noi dung trang chu"]
        UC_ViewManagement["Xem dashboard quan ly"]
        UC_Fees["Theo doi hoc phi"]
        UC_RoomFees["Theo doi tien thue phong"]
    end

    Guest --> UC_ViewHome
    Guest --> UC_ViewTeachers
    Guest --> UC_ViewCourses
    Guest --> UC_Signup
    Guest --> UC_Login

    Student --> UC_ViewHome
    Student --> UC_ViewTeachers
    Student --> UC_ViewCourses
    Student --> UC_ViewAccount
    Student --> UC_ViewDocs
    Student --> UC_EnterClass
    Student --> UC_Logout

    Teacher --> UC_ViewHome
    Teacher --> UC_ViewTeachers
    Teacher --> UC_ViewCourses
    Teacher --> UC_ViewAccount
    Teacher --> UC_ViewDocs
    Teacher --> UC_EnterClass
    Teacher --> UC_UploadDocs
    Teacher --> UC_Logout

    Admin --> UC_ViewHome
    Admin --> UC_ViewTeachers
    Admin --> UC_ViewCourses
    Admin --> UC_ViewAccount
    Admin --> UC_ManageCourses
    Admin --> UC_ManageTeachers
    Admin --> UC_AssignTeacher
    Admin --> UC_EditHome
    Admin --> UC_ViewManagement
    Admin --> UC_Fees
    Admin --> UC_RoomFees
    Admin --> UC_Logout

    UC_Login -. "tao JWT + cookie" .-> UC_ViewAccount
    UC_ManageTeachers -. "courseIds" .-> UC_AssignTeacher
```

## So do may trang thai nguoi dung

```mermaid
stateDiagram-v2
    [*] --> KiemTraPhien

    KiemTraPhien --> Khach: khong co token / token sai
    KiemTraPhien --> HocVien: token hop le + STUDENT
    KiemTraPhien --> GiaoVien: token hop le + TEACHER
    KiemTraPhien --> Admin: token hop le + ADMIN

    Khach --> DangNhap: bam Dang nhap
    Khach --> DangKy: chuyen sang Dang ky
    DangKy --> HocVien: dang ky role STUDENT thanh cong
    DangKy --> GiaoVien: dang ky role TEACHER thanh cong
    DangKy --> LoiAuth: email trung / mat khau ngan / input thieu
    DangNhap --> HocVien: login STUDENT thanh cong
    DangNhap --> GiaoVien: login TEACHER thanh cong
    DangNhap --> Admin: login ADMIN thanh cong
    DangNhap --> LoiAuth: sai email/mat khau / tai khoan bi khoa
    LoiAuth --> DangNhap: thu lai
    LoiAuth --> DangKy: tao tai khoan moi

    HocVien --> Khach: dang xuat
    GiaoVien --> Khach: dang xuat
    Admin --> Khach: dang xuat

    state Khach {
        [*] --> XemCongKhai
        XemCongKhai --> XemGioiThieu
        XemCongKhai --> XemGiaoVien
        XemCongKhai --> XemLopHoc
        XemLopHoc --> TaiLieuBiKhoa
    }

    state HocVien {
        [*] --> XemNoiDungHocVien
        XemNoiDungHocVien --> XemTaiKhoan
        XemNoiDungHocVien --> XemLopDangHoc
        XemLopDangHoc --> VaoLop
        VaoLop --> XemTaiLieu
    }

    state GiaoVien {
        [*] --> XemNoiDungGiaoVien
        XemNoiDungGiaoVien --> XemTaiKhoanGV
        XemNoiDungGiaoVien --> XemLopPhuTrach
        XemLopPhuTrach --> VaoLopGV
        VaoLopGV --> CapNhatTaiLieu
    }

    state Admin {
        [*] --> QuanTri
        QuanTri --> SuaTrangChu
        QuanTri --> QuanLyKhoaHoc
        QuanTri --> QuanLyGiaoVien
        QuanTri --> DashboardQuanLy
        QuanLyKhoaHoc --> TaoKhoaHoc
        QuanLyKhoaHoc --> SuaKhoaHoc
        QuanLyKhoaHoc --> XoaKhoaHoc
        QuanLyGiaoVien --> TaoGiaoVien
        QuanLyGiaoVien --> SuaGiaoVien
        QuanLyGiaoVien --> XoaGiaoVien
        SuaGiaoVien --> PhanCongLop
    }
```

## So do luong API hien tai

```mermaid
sequenceDiagram
    participant U as Nguoi dung
    participant FE as Next.js client
    participant API as Express API
    participant Guard as Auth/Role guard
    participant SVC as Service layer
    participant DB as PostgreSQL/Prisma

    U->>FE: Mo ung dung
    FE->>API: GET /api/home
    API->>SVC: HomeService.getHomeContent()
    SVC->>DB: upsert/find home_contents id=1
    DB-->>SVC: HomeContent
    SVC-->>API: home
    API-->>FE: hero, about, achievements

    FE->>API: GET /api/teachers va GET /api/courses
    API->>SVC: listTeachers(), listCourses()
    SVC->>DB: teachers + courses
    DB-->>SVC: data
    SVC-->>API: response DTO
    API-->>FE: danh sach cong khai

    U->>FE: Dang nhap
    FE->>API: POST /api/auth/login
    API->>SVC: AuthService.login()
    SVC->>DB: find user by email
    DB-->>SVC: user + passwordHash
    SVC-->>API: user an toan + JWT
    API-->>FE: set cookie access_token + tra token
    FE->>FE: luu user/token vao localStorage

    U->>FE: Admin tao/sua/xoa khoa hoc
    FE->>API: POST/PATCH/DELETE /api/courses
    API->>Guard: authGuard + roleGuard ADMIN
    Guard->>DB: lay user tu token
    DB-->>Guard: user active
    Guard-->>API: cho phep
    API->>SVC: CourseService
    SVC->>DB: create/update/delete course
    DB-->>SVC: ket qua
    SVC-->>API: course DTO
    API-->>FE: cap nhat UI
```

## So do kien truc thanh phan

```mermaid
flowchart TB
    Browser["Trinh duyet"]
    Next["Client Next.js\napp/page.tsx + components"]
    AuthCtx["AuthContext\nlocalStorage + authApi.me"]
    ApiClient["client/lib/api.ts\nfetch + credentials include"]

    Express["Express server\nserver/src/index.js"]
    Routes["Routes\nauth/courses/teachers/home"]
    Controllers["Controllers\nchuan hoa HTTP response"]
    Services["Services\nvalidate + business logic"]
    Guards["authGuard / roleGuard"]
    Prisma["Prisma Client"]
    Postgres["PostgreSQL"]

    Browser --> Next
    Next --> AuthCtx
    Next --> ApiClient
    AuthCtx --> ApiClient
    ApiClient -->|HTTP /api/*| Express
    Express --> Routes
    Routes --> Guards
    Routes --> Controllers
    Guards --> Services
    Controllers --> Services
    Services --> Prisma
    Prisma --> Postgres
```

## Bang API va trang thai tich hop

| Nhom | Endpoint | Quyen | Trang thai frontend |
| --- | --- | --- | --- |
| Auth | `POST /api/auth/signup` | Public | Da dung trong `LoginModal` |
| Auth | `POST /api/auth/login` | Public | Da dung trong `LoginModal` |
| Auth | `GET /api/auth/me` | Dang nhap | Da dung khi hydrate phien |
| Auth | `POST /api/auth/logout` | Public | Da dung khi dang xuat |
| Home | `GET /api/home` | Public | Da dung trong trang gioi thieu/hero |
| Home | `PATCH /api/home` | Admin | Da co nut sua JSON trong `AboutTab` |
| Courses | `GET /api/courses` | Public | Da dung trong `RoomsTab`, `TeachersTab` |
| Courses | `GET /api/courses/:id` | Public | Co wrapper, UI chua thay dung ro |
| Courses | `POST/PATCH/DELETE /api/courses` | Admin | `RoomsTab` co dung, `ManagementTab` chua dung |
| Teachers | `GET /api/teachers` | Public | Da dung trong `TeachersTab` |
| Teachers | `GET /api/teachers/:id` | Public | Co wrapper, UI chua thay dung ro |
| Teachers | `POST/PATCH/DELETE /api/teachers` | Admin | Da dung trong `TeachersTab` |

## Diem can luu y

- `ManagementTab` hien van dung `client/lib/mock-data.ts`, nen dashboard quan ly, hoc phi va tien phong chua ket noi database.
- `RoomsTab` va `TeachersTab` goi API admin ma khong truyen token vao tham so `token`; backend van co the xac thuc qua cookie HTTP-only neu cookie ton tai.
- Chua co bang/API enrollment, room booking, payment, document/file upload, user settings du da duoc ghi trong `NEEDAPI.md`.
- Hien schema Prisma moi co `User`, `Course`, `Teacher`, `HomeContent`.
