const TeacherService = require('../services/teacher.service');
const { logError } = require('../utils/logger');

async function listTeachers(req, res) {
  try {
    const teachers = await TeacherService.listTeachers();

    return res.json({
      success: true,
      message: 'Lấy danh sách giáo viên thành công',
      data: {
        teachers,
      },
    });
  } catch (error) {
    logError(req, error, 'listTeachers failed');
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi lấy danh sách giáo viên',
    });
  }
}

async function getTeacherById(req, res) {
  try {
    const teacher = await TeacherService.getTeacherById(req.params.id);

    return res.json({
      success: true,
      message: 'Lấy thông tin giáo viên thành công',
      data: {
        teacher,
      },
    });
  } catch (error) {
    logError(req, error, 'getTeacherById failed');
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi lấy thông tin giáo viên',
    });
  }
}

async function createTeacher(req, res) {
  try {
    const teacher = await TeacherService.createTeacher(req.body);

    return res.status(201).json({
      success: true,
      message: 'Tạo giáo viên thành công',
      data: {
        teacher,
      },
    });
  } catch (error) {
    logError(req, error, 'createTeacher failed');
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi tạo giáo viên',
    });
  }
}

async function updateTeacher(req, res) {
  try {
    const teacher = await TeacherService.updateTeacher(req.params.id, req.body);

    return res.json({
      success: true,
      message: 'Cập nhật giáo viên thành công',
      data: {
        teacher,
      },
    });
  } catch (error) {
    logError(req, error, 'updateTeacher failed');
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi cập nhật giáo viên',
    });
  }
}

async function deleteTeacher(req, res) {
  try {
    await TeacherService.deleteTeacher(req.params.id);

    return res.json({
      success: true,
      message: 'Xóa giáo viên thành công',
    });
  } catch (error) {
    logError(req, error, 'deleteTeacher failed');
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi xóa giáo viên',
    });
  }
}

module.exports = {
  listTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
