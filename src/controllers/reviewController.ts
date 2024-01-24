import { NextFunction, Request, Response } from 'express';
import Review from '../models/reviewModel';
import catchAsync from '../utils/catchAsync';
import { IProtectRequest } from 'types';
import { deleteOne, updateOne } from './factoryHandler';

export const getAllReviews = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const reviews = await Review.find(filter);

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: reviews,
    });
  }
);

export const postReview = catchAsync(
  async (req: IProtectRequest, res: Response, _next: NextFunction) => {
    // Define tour and user ids if there's none
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);

    res.status(200).json({
      status: 'success',
      data: newReview,
    });
  }
);

export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
