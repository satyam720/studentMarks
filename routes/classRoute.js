import express from 'express';
import { createClass, getClass } from '../controllers/classController.js';

const router = express.Router();

router.route('/').post(createClass).get(getClass);

export default router;