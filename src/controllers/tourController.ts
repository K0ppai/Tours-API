import Tour from '../models/tourModel';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './factoryHandler';
import multer, { FileFilterCallback, Multer } from 'multer';
import { IFileRequest } from 'types';
import sharp from 'sharp';

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

export const getToursWithIn = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius =
      unit === 'mi' ? parseInt(distance) / 3963.2 : parseInt(distance) / 6378.1;

    const tours = await Tour.find({
      startLocation: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius],
        },
      },
    });

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: tours,
    });
  }
);

export const getDistances = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const multiplier = unit === 'mi' ? 0.000621371192 : 0.001;

    const tours = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)],
          },
          distanceField: 'distance',
          // distance is calculated in meter, to convert m to mi/km
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
          id: 1,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: tours,
    });
  }
);

// Upload files
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Please upload only images.', 400));
  }
};

const upload = multer({ storage, fileFilter });

export const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

export const resizeTourImages = catchAsync(
  async (req: IFileRequest, _res: Response, next: NextFunction) => {
    if (!req.files.imageCover || !req.files.images) return next();

    // 1) imageCover
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

    // can access to buffer because of multer.memoryStorage()
    await sharp(req.files.imageCover[0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.body.imageCover}`);

    // 2) images 
    req.body.images = [];
    
    // Use map to return array for Promise.all to await all promises from sharp
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const fileName = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(500, 500)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/users/${fileName}`);

        req.body.images.push(fileName);
      })
    );

    next();
  }
);

export const getAllTours = getAll(Tour);
export const getTour = getOne(Tour, { path: 'reviews' });
export const postTour = createOne(Tour);
export const patchTour = updateOne(Tour);
export const deleteTour = deleteOne(Tour);
