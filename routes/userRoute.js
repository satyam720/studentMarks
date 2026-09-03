import express from 'express';
import { forgotPassword, login, protect, signUp, updatePassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/login').post(login);

router.route('/update').post(protect, updatePassword);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:token').patch(resetPassword);

export default router;