import express, {Express, Response, Request, NextFunction} from 'express';
import morgan from 'morgan';
import userRouter from './routes/userRoutes';
import tourRouter from './routes/tourRoutes';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const app: Express = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Hello from the middleware');
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

export default app;
