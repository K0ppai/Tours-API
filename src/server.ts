import app from './app';
import mongoose from 'mongoose';

const port = process.env.PORT || 3000;
const DB: any = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});

app.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
