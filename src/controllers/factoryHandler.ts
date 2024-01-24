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
