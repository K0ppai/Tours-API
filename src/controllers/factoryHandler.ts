import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { IReview, ITour, IUser } from 'types';
import catchAsync from '../utils/catchAsync';

export const deleteOne = (Model: Model<ITour | IUser | IReview>) =>
  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    await Model.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export const updateOne = (Model: Model<ITour | IUser | IReview>) =>
  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const tour = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      // run validators(ie. maxLength) again
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  });

export const createOne = (Model: Model<ITour | IUser | IReview>) =>
  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const tour = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour },
    });
  });
