const express = require('express');

const {
  listTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teacher.controller');
const { authGuard } = require('../middlewares/authGuard');
const { roleGuard } = require('../middlewares/roleGuard');

const router = express.Router();
const adminOnly = [authGuard, roleGuard(['ADMIN'])];

router.get('/', listTeachers);
router.get('/:id', getTeacherById);
router.post('/', adminOnly, createTeacher);
router.patch('/:id', adminOnly, updateTeacher);
router.delete('/:id', adminOnly, deleteTeacher);

module.exports = router;
