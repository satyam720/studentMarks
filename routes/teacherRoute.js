import express from 'express';
import { createTeacher, getTeachers } from "../controllers/teacherController.js";
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.route('/').post(protect, restrictTo('teacher', 'admin'), createTeacher).get(protect, restrictTo('teacher', 'admin'),getTeachers);

export default router;