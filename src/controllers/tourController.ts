import Tour from '../models/tourModel';
import { NextFunction, Request, Response } from 'express';
import APIFeatures from '../utils/apiFeatures';

// middleware for top-5-cheap
const aliasTopTours = (req: Request, _res: Response, next: NextFunction) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  req.query.limit = '5';
  req.query.page = '1';
  next();
};

const getAllTours = async (req: Request, res: Response) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

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

const getTourStats = async (_req: Request, res: Response) => {
  try {
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

    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

export {
  getAllTours,
  postTour,
  patchTour,
  deleteTour,
  getTour,
  aliasTopTours,
  getTourStats,
};
