import { NextFunction, Request, Response } from 'express';
import Review from '../models/reviewModel';
import { IProtectRequest } from 'types';
import { createOne, deleteOne, getAll, updateOne } from './factoryHandler';

export const setUserTourIds = async (
  req: IProtectRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

export const getAllReviews = getAll(Review);
export const postReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
