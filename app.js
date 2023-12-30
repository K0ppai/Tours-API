import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import userRouter from './routes/userRoutes.js';
import tourRouter from './routes/tourRoutes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  console.log('Hello from the middleware 2');
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

export default app;
