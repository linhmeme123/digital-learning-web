const prisma = require('../db/prisma');

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
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
}

function normalizeCoursePayload(payload) {
  const classValue = payload.className || payload.class;

  return {
    name: payload.name?.trim(),
    level: payload.level?.trim(),
    schedule: payload.schedule?.trim(),
    className: classValue?.trim(),
    duration: payload.duration?.trim(),
    capacity: Number(payload.capacity),
    subject: payload.subject?.trim(),
    classNumber: Number(payload.classNumber),
  };
}

function validateCoursePayload(data, { partial = false } = {}) {
  const requiredFields = ['name', 'level', 'schedule', 'className', 'duration', 'capacity', 'subject', 'classNumber'];

  if (!partial) {
    const missingField = requiredFields.find((field) => data[field] === undefined || data[field] === '' || Number.isNaN(data[field]));

    if (missingField) {
      return 'Vui lòng nhập đầy đủ thông tin khóa học';
    }
  }

  if (data.capacity !== undefined && (!Number.isInteger(data.capacity) || data.capacity <= 0)) {
    return 'Sức chứa phải là số nguyên lớn hơn 0';
  }

  if (data.classNumber !== undefined && (!Number.isInteger(data.classNumber) || data.classNumber <= 0)) {
    return 'Số lớp phải là số nguyên lớn hơn 0';
  }

  return null;
}

function throwNotFound() {
  const error = new Error('Không tìm thấy khóa học');
  error.statusCode = 404;
  throw error;
}

async function listCourses() {
  const courses = await prisma.course.findMany({
    orderBy: [
      { subject: 'asc' },
      { classNumber: 'asc' },
      { id: 'asc' },
    ],
  });

  return courses.map(toCourseResponse);
}

async function getCourseById(id) {
  const course = await prisma.course.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!course) {
    throwNotFound();
  }

  return toCourseResponse(course);
}

async function createCourse(payload) {
  const data = normalizeCoursePayload(payload);
  const validationError = validateCoursePayload(data);

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const course = await prisma.course.create({
    data,
  });

  return toCourseResponse(course);
}

async function updateCourse(id, payload) {
  const data = normalizeCoursePayload(payload);
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== '' && !Number.isNaN(value))
  );
  const validationError = validateCoursePayload(cleanData, { partial: true });

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  try {
    const course = await prisma.course.update({
      where: {
        id: Number(id),
      },
      data: cleanData,
    });

    return toCourseResponse(course);
  } catch (error) {
    if (error.code === 'P2025') {
      throwNotFound();
    }

    throw error;
  }
}

async function deleteCourse(id) {
  try {
    await prisma.course.delete({
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
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
