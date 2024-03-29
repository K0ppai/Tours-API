import Tour from '../models/tourModel';
import User from '../models/userModel';
import Review from '../models/reviewModel';
import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const DB: string = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});

const tours: any = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours.json`).toString()
);
const users: any = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`).toString()
);
const reviews: any = JSON.parse(
  fs.readFileSync(`${__dirname}/data/reviews.json`).toString()
);

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully imported');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
