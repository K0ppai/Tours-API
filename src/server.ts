import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

process.on('uncaughtException', (err: Error) => {
  console.log(err.name, err.message);
  console.log('App shutting down...');
  process.exit(1);
});

const port = process.env.PORT || 3000;
const DB: string = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);
mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});

const server = app.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(err.name, err.message);
  console.log('App shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
