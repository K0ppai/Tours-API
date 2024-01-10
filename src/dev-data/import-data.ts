import Tour from '../models/tourModel';
import mongoose from 'mongoose';
import fs from 'node:fs';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const DB: string = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});

const tours: any = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours-simple.json`).toString()
);

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully imported');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === 'import') {
  importData();
} else if (process.argv[2] === 'delete') {
  deleteData();
}

