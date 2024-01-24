import { NextFunction, Request, Response } from 'express';
import { Model, Query } from 'mongoose';
import { IReview, ITour, IUser } from 'types';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';

export const getAll = (Model: Model<ITour | IUser | IReview>) =>
  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    // filter for the nested tour review route
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: docs,
    });
  });

export const getOne = (
  Model: Model<ITour | IUser | IReview>,
  populateOptions?: {
    path: string;
    select?: string;
  }
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let query = Model.findById(id);

    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError('There is no document with this ID', 404));
    }

    res.json({
      status: 'success',
      data: doc,
    });
  });

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
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      // run validators(ie. maxLength) again
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('There is no document with this ID.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

export const createOne = (Model: Model<ITour | IUser | IReview>) =>
  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });
