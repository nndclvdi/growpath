const express = require('express');
const router = express.Router();

const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', courseController.getCourses);

router.post(
  '/',
  authMiddleware,
  courseController.createCourse
);

router.delete(
  '/:id',
  authMiddleware,
  courseController.deleteCourse
);

module.exports = router;