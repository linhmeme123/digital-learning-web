const express = require('express');

const {
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/course.controller');
const { authGuard } = require('../middlewares/authGuard');
const { roleGuard } = require('../middlewares/roleGuard');

const router = express.Router();
const adminOnly = [authGuard, roleGuard(['ADMIN'])];

router.get('/', listCourses);
router.get('/:id', getCourseById);
router.post('/', adminOnly, createCourse);
router.patch('/:id', adminOnly, updateCourse);
router.delete('/:id', adminOnly, deleteCourse);

module.exports = router;
