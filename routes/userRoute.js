import express from 'express';
import { login, protect, signUp, updatePassword } from '../controllers/authController.js';

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/login').post(login);

router.route('/update').post(protect, updatePassword);

export default router;