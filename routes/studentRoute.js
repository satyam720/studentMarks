import express from 'express';
import { createStudent, getStudent, getStudents, getClassStudents } from '../controllers/studentController.js';

const router = express.Router();

router.route('/classStudents').get(getClassStudents);
router.route('/').post(createStudent).get(getStudents);
router.route('/:id').get(getStudent);

export default router;