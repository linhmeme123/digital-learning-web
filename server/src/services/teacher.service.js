const prisma = require('../db/prisma');

const DEFAULT_TEACHER_IMAGE = '/placeholder-user.jpg';

function toCourseResponse(course) {
  return {
    id: course.id,
    name: course.name,
    level: course.level,
    schedule: course.schedule,
    class: course.className,
    duration: course.duration,
    capacity: course.capacity,
    subject: course.subject,
    classNumber: course.classNumber,
  };
}

function toTeacherResponse(teacher) {
  return {
    id: teacher.id,
    name: teacher.name,
    subject: teacher.subject,
    achievements: teacher.achievements,
    image: teacher.image,
    description: teacher.description,
    quote: teacher.quote,
    experience: teacher.experience,
    courses: teacher.courses?.map(toCourseResponse) || [],
    createdAt: teacher.createdAt,
    updatedAt: teacher.updatedAt,
  };
}

function normalizeAchievements(achievements) {
  if (Array.isArray(achievements)) {
    return achievements.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof achievements === 'string') {
    return achievements
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeCourseIds(courseIds) {
  if (!Array.isArray(courseIds)) {
    return [];
  }

  return [...new Set(courseIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0))];
}

function normalizeTeacherPayload(payload, { partial = false } = {}) {
  return {
    name: payload.name?.trim(),
    subject: payload.subject?.trim(),
    achievements: payload.achievements === undefined && partial ? undefined : normalizeAchievements(payload.achievements),
    image: payload.image === undefined && partial ? undefined : payload.image?.trim() || DEFAULT_TEACHER_IMAGE,
    description: payload.description?.trim(),
    quote: payload.quote?.trim(),
    experience: payload.experience?.trim(),
    courseIds: payload.courseIds === undefined && partial ? undefined : normalizeCourseIds(payload.courseIds),
  };
}

function validateTeacherPayload(data, { partial = false } = {}) {
  const requiredFields = ['name', 'subject', 'description', 'quote', 'experience'];

  if (!partial) {
    const missingField = requiredFields.find((field) => !data[field]);

    if (missingField) {
      return 'Vui lòng nhập đầy đủ thông tin giáo viên';
    }
  }

  return null;
}

function throwNotFound() {
  const error = new Error('Không tìm thấy giáo viên');
  error.statusCode = 404;
  throw error;
}

async function assertCoursesExist(courseIds) {
  if (courseIds.length === 0) {
    return;
  }

  const count = await prisma.course.count({
    where: {
      id: {
        in: courseIds,
      },
    },
  });

  if (count !== courseIds.length) {
    const error = new Error('Một hoặc nhiều khóa học được chọn không tồn tại');
    error.statusCode = 400;
    throw error;
  }
}

async function listTeachers() {
  const teachers = await prisma.teacher.findMany({
    include: {
      courses: {
        orderBy: [
          { subject: 'asc' },
          { classNumber: 'asc' },
          { id: 'asc' },
        ],
      },
    },
    orderBy: [
      { name: 'asc' },
      { id: 'asc' },
    ],
  });

  return teachers.map(toTeacherResponse);
}

async function getTeacherById(id) {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      courses: true,
    },
  });

  if (!teacher) {
    throwNotFound();
  }

  return toTeacherResponse(teacher);
}

async function createTeacher(payload) {
  const data = normalizeTeacherPayload(payload);
  const validationError = validateTeacherPayload(data);

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  await assertCoursesExist(data.courseIds);

  const teacher = await prisma.$transaction(async (tx) => {
    const createdTeacher = await tx.teacher.create({
      data: {
        name: data.name,
        subject: data.subject,
        achievements: data.achievements,
        image: data.image,
        description: data.description,
        quote: data.quote,
        experience: data.experience,
      },
    });

    if (data.courseIds.length > 0) {
      await tx.course.updateMany({
        where: {
          id: {
            in: data.courseIds,
          },
        },
        data: {
          teacherId: createdTeacher.id,
        },
      });
    }

    return tx.teacher.findUnique({
      where: {
        id: createdTeacher.id,
      },
      include: {
        courses: true,
      },
    });
  });

  return toTeacherResponse(teacher);
}

async function updateTeacher(id, payload) {
  const teacherId = Number(id);
  const data = normalizeTeacherPayload(payload, { partial: true });
  const validationError = validateTeacherPayload(data, { partial: true });

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  await assertCoursesExist(data.courseIds || []);

  const existingTeacher = await prisma.teacher.findUnique({
    where: {
      id: teacherId,
    },
  });

  if (!existingTeacher) {
    throwNotFound();
  }

  const updateData = Object.fromEntries(
    Object.entries({
      name: data.name,
      subject: data.subject,
      achievements: data.achievements,
      image: data.image,
      description: data.description,
      quote: data.quote,
      experience: data.experience,
    }).filter(([, value]) => value !== undefined && value !== '')
  );

  const teacher = await prisma.$transaction(async (tx) => {
    await tx.teacher.update({
      where: {
        id: teacherId,
      },
      data: updateData,
    });

    if (data.courseIds) {
      await tx.course.updateMany({
        where: {
          teacherId,
        },
        data: {
          teacherId: null,
        },
      });

      if (data.courseIds.length > 0) {
        await tx.course.updateMany({
          where: {
            id: {
              in: data.courseIds,
            },
          },
          data: {
            teacherId,
          },
        });
      }
    }

    return tx.teacher.findUnique({
      where: {
        id: teacherId,
      },
      include: {
        courses: true,
      },
    });
  });

  return toTeacherResponse(teacher);
}

async function deleteTeacher(id) {
  try {
    await prisma.teacher.delete({
      where: {
        id: Number(id),
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throwNotFound();
    }

    throw error;
  }
}

module.exports = {
  listTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
