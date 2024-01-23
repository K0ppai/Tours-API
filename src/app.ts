import express, { Express, Response, Request, NextFunction } from 'express';
import morgan from 'morgan';
import { pathToFileURL } from 'node:url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import AppError from './utils/appError';
import userRouter from './routes/userRoutes';
import tourRouter from './routes/tourRoutes';
import reviewRouter from './routes/reviewRoutes';
import globalErrorHandler from './controllers/errorController';

dotenv.config({ path: '.env' });

const app: Express = express();
// const __filename = pathToFileURL(import.meta.filename);
// const __dirname = dirname(__filename);

// Global middlewares
// Set security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from the same IP address to prevent bruce force attack
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: {
    message: 'Too many requests from this IP. Please try again in one hour.',
  },
});

app.use('/api', limiter);

// reading data from the body ie(req.body)
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    // whitelist the duplicate params we want
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware
app.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log('Hello from the middleware');
  next();
});

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

// Error handler middleware for undefined routes
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(
    new AppError(
      `Request route ${req.originalUrl} not found on this server`,
      404
    )
  );
});

// Global error handler
app.use(globalErrorHandler);

export default app;
