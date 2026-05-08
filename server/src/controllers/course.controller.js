const CourseService = require('../services/course.service');
const { logError } = require('../utils/logger');

async function listCourses(req, res) {
  try {
    const courses = await CourseService.listCourses();

    return res.json({
      success: true,
      message: 'Lấy danh sách khóa học thành công',
      data: {
        courses,
      },
    });
  } catch (error) {
    logError(req, error, 'listCourses failed');
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi lấy danh sách khóa học',
    });
  }
}

async function getCourseById(req, res) {
  try {
    const course = await CourseService.getCourseById(req.params.id);

    return res.json({
      success: true,
      message: 'Lấy thông tin khóa học thành công',
      data: {
        course,
      },
    });
  } catch (error) {
    logError(req, error, 'getCourseById failed');
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi lấy thông tin khóa học',
    });
  }
}

async function createCourse(req, res) {
  try {
    const course = await CourseService.createCourse(req.body);

    return res.status(201).json({
      success: true,
      message: 'Tạo khóa học thành công',
      data: {
        course,
      },
    });
  } catch (error) {
    logError(req, error, 'createCourse failed');
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi tạo khóa học',
    });
  }
}

async function updateCourse(req, res) {
  try {
    const course = await CourseService.updateCourse(req.params.id, req.body);

    return res.json({
      success: true,
      message: 'Cập nhật khóa học thành công',
      data: {
        course,
      },
    });
  } catch (error) {
    logError(req, error, 'updateCourse failed');
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi cập nhật khóa học',
    });
  }
}

async function deleteCourse(req, res) {
  try {
    await CourseService.deleteCourse(req.params.id);

    return res.json({
      success: true,
      message: 'Xóa khóa học thành công',
    });
  } catch (error) {
    logError(req, error, 'deleteCourse failed');
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi xóa khóa học',
    });
  }
}

module.exports = {
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
