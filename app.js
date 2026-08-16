import express from 'express';
import morgan from 'morgan';
import subjectRoute from './routes/subjectRoute.js';
import teacherRoute from './routes/teacherRoute.js';
import classRoute from './routes/classRoute.js';
import studentRoute from './routes/studentRoute.js';
import marksRoute from './routes/marksRoute.js';
import AppError from './Utils/AppError.js';
import globalError from './controllers/errorController.js';

const app = express();

//set up middlewares
app.use(express.json());
app.use(morgan('dev'));




app.use('/api/v1/subjects', subjectRoute);
app.use('/api/v1/teachers', teacherRoute);
app.use('/api/v1/classes', classRoute);
app.use('/api/v1/students', studentRoute);
app.use('/api/v1/marks', marksRoute);

app.all(/.*/, (req, res, next) => {
    next(new AppError(`Can't find the ${req.originalUrl} on this server`, 400));
})

app.use(globalError);

export default app;