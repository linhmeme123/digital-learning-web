import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);
  const courses = [
    {
      id: 1,
      name: "Python Cơ Bản",
      level: "Cơ bản",
      schedule: "Thứ 2, 4, 6 - 19:00-21:00",
      className: "Lớp 1",
      duration: "8 tuần",
      capacity: 25,
      subject: "Python",
      classNumber: 1,
    },
    {
      id: 2,
      name: "Python Trung bình",
      level: "Trung bình",
      schedule: "Thứ 2, 4, 6 - 17:00-19:00",
      className: "Lớp 2",
      duration: "8 tuần",
      capacity: 22,
      subject: "Python",
      classNumber: 2,
    },
    {
      id: 3,
      name: "Python Nâng cao",
      level: "Nâng cao",
      schedule: "Thứ 3, 5 - 20:00-22:00",
      className: "Lớp 3",
      duration: "10 tuần",
      capacity: 20,
      subject: "Python",
      classNumber: 3,
    },
    {
      id: 4,
      name: "HTML & CSS Cơ Bản",
      level: "Cơ bản",
      schedule: "Thứ 2, 4, 6 - 17:00-19:00",
      className: "Lớp 1",
      duration: "6 tuần",
      capacity: 30,
      subject: "Web Development",
      classNumber: 1,
    },
    {
      id: 5,
      name: "JavaScript & React",
      level: "Trung bình",
      schedule: "Thứ 3, 5, 7 - 18:00-20:00",
      className: "Lớp 2",
      duration: "12 tuần",
      capacity: 25,
      subject: "Web Development",
      classNumber: 2,
    },
    {
      id: 6,
      name: "Node.js & Backend",
      level: "Nâng cao",
      schedule: "Thứ 2, 5 - 20:00-22:00",
      className: "Lớp 3",
      duration: "10 tuần",
      capacity: 15,
      subject: "Web Development",
      classNumber: 3,
    },
    {
      id: 7,
      name: "SQL Cơ Bản",
      level: "Cơ bản",
      schedule: "Thứ 3, 6 - 18:00-20:00",
      className: "Lớp 1",
      duration: "6 tuần",
      capacity: 20,
      subject: "Database",
      classNumber: 1,
    },
    {
      id: 8,
      name: "Advanced Database Design",
      level: "Nâng cao",
      schedule: "Thứ 2, 5 - 20:00-22:00",
      className: "Lớp 2",
      duration: "10 tuần",
      capacity: 15,
      subject: "Database",
      classNumber: 2,
    },
    {
      id: 9,
      name: "React Native Cơ Bản",
      level: "Trung bình",
      schedule: "Thứ 4, 6 - 19:00-21:00",
      className: "Lớp 1",
      duration: "12 tuần",
      capacity: 20,
      subject: "Mobile Development",
      classNumber: 1,
    },
    {
      id: 10,
      name: "Flutter Development",
      level: "Trung bình",
      schedule: "Thứ 3, 5, 7 - 19:00-21:00",
      className: "Lớp 2",
      duration: "12 tuần",
      capacity: 18,
      subject: "Mobile Development",
      classNumber: 2,
    },
  ];

  await prisma.user.upsert({
    where: {
      email: "admin@lophocso.vn",
    },
    update: {},
    create: {
      name: "Admin Lớp Học Số",
      email: "admin@lophocso.vn",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "teacher@lophocso.vn",
    },
    update: {},
    create: {
      name: "Giáo viên Demo",
      email: "teacher@lophocso.vn",
      passwordHash,
      role: "TEACHER",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "student@lophocso.vn",
    },
    update: {},
    create: {
      name: "Học viên Demo",
      email: "student@lophocso.vn",
      passwordHash,
      role: "STUDENT",
    },
  });

  for (const course of courses) {
    await prisma.course.upsert({
      where: {
        id: course.id,
      },
      update: {
        name: course.name,
        level: course.level,
        schedule: course.schedule,
        className: course.className,
        duration: course.duration,
        capacity: course.capacity,
        subject: course.subject,
        classNumber: course.classNumber,
      },
      create: course,
    });
  }

  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"courses"', 'id'), COALESCE((SELECT MAX(id) FROM "courses"), 1), true);`
  );

  console.log("Seed completed");
  console.log("Admin: admin@lophocso.vn / 123456");
  console.log("Teacher: teacher@lophocso.vn / 123456");
  console.log("Student: student@lophocso.vn / 123456");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
