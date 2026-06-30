import express from 'express';
import { createSubject, getSubject } from "../controllers/subjectController.js";

const router = express.Router();

router.route('/').post(createSubject).get(getSubject);

export default router;