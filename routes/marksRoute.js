import express from 'express';
import { addMarks, getClassAverage, getHighestScoring, getMarks } from '../controllers/marksController.js';

const router = express.Router();

router.route('/classAverage').get(getClassAverage);
router.route('/highScore').get(getHighestScoring)
router.route('/').post(addMarks).get(getMarks);

export default router;