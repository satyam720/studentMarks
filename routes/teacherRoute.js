import express from 'express';
import { createTeacher, getTeachers } from "../controllers/teacherController.js";

const router = express.Router();

router.route('/').post(createTeacher).get(getTeachers);

export default router;