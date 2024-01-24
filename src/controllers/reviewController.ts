import { NextFunction, Request, Response } from 'express';
import Review from '../models/reviewModel';
import catchAsync from '../utils/catchAsync';
import { IProtectRequest } from 'types';
import { createOne, deleteOne, updateOne } from './factoryHandler';

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

export const setUserTourIds = async (
  req: IProtectRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

export const postReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
