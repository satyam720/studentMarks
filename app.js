import express from 'express';
import morgan from 'morgan';
import subjectRoute from './routes/subjectRoute.js';
import teacherRoute from './routes/teacherRoute.js';
import classRoute from './routes/classRoute.js';
import studentRoute from './routes/studentRoute.js';
import marksRoute from './routes/marksRoute.js';

const app = express();

//set up middlewares
app.use(express.json());
app.use(morgan('dev'));




app.use('/api/v1/subjects', subjectRoute);
app.use('/api/v1/teachers', teacherRoute);
app.use('/api/v1/classes', classRoute);
app.use('/api/v1/students', studentRoute);
app.use('/api/v1/marks', marksRoute);

export default app;