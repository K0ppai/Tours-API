import { NextFunction, Request, Response } from 'express';
import Review from '../models/reviewModel';
import catchAsync from '../utils/catchAsync';

export const getAllReviews = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const reviews = await Review.find();

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: reviews,
    });
  }
);

export const postReview = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const newReview = await Review.create(req.body);

    res.status(200).json({
      status: 'success',
      data: newReview,
    });
  }
);
