import Tour from '../models/tourModel';
import { NextFunction, Request, Response } from 'express';
import APIFeatures from '../utils/apiFeatures';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { createOne, deleteOne, getAll, updateOne } from './factoryHandler';

// middleware for top-5-cheap
export const aliasTopTours = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  req.query.limit = '5';
  req.query.page = '1';
  next();
};


export const getTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const tour = await Tour.findById(id).populate('reviews');

    if (!tour) {
      return next(new AppError('There is no tour with this ID', 404));
    }

    res.json({
      status: 'success',
      data: { tour },
    });
  }
  );
  
  export const getTourStats = catchAsync(
    async (_req: Request, res: Response, _next: NextFunction) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $avg: '$ratingsQuantity' },
          avgRatings: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          avgPrice: -1,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  }
);

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { year } = req.params;
    
    const tours = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numOfTours: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numOfTours: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: { tours },
    });
  }
  );
  
  export const getAllTours = getAll(Tour);
  export const postTour = createOne(Tour);
  export const patchTour = updateOne(Tour);
  export const deleteTour = deleteOne(Tour);
  