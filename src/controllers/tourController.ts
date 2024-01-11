import Tour from '../models/tourModel';
import { NextFunction, Request, Response } from 'express';

// middleware for top-5-cheap
const aliasTopTours = (req: Request, res: Response, next: NextFunction) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  req.query.limit = '5';
  next();
};

const getAllTours = async (req: Request, res: Response) => {
  // Destructuing the query to mutate
  const queryObj = { ...req.query };

  // Exclude the fields that are not in the model
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((field) => delete queryObj[field]);

  // Convert the query to string and replace the operators
  let queryStr: string = JSON.stringify(queryObj);
  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match: string) => `$${match}`
  );

  let query = Tour.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = (req.query.sort as string).split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limiting
  if (req.query.fields) {
    const fileds = (req.query.fields as string).split(',').join(' ');
    query = query.select(fileds);
  } else {
    query = query.select('-__v');
  }

  // Pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const count = await Tour.countDocuments();
    if (skip >= count) throw new Error("This page doesn't exit");
  }

  try {
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

const getTour = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findById(id);

    res.json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

const postTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

const patchTour = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

const deleteTour = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

export { getAllTours, postTour, patchTour, deleteTour, getTour, aliasTopTours };
