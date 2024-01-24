import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import bcrypt from 'bcrypt';
import { IProtectRequest } from 'types';
import { deleteOne, getAll, getOne, updateOne } from './factoryHandler';

// middlewares
export const checkId = (
  _req: Request,
  res: Response,
  next: NextFunction,
  val: number
) => {
  if (val > 20) {
    return res.json({
      message: 'Invalid ID',
    });
  }
  next();
};

export const checkBody = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name && !req.body.price) {
    return res.status(400).json({
      message: 'Invalid request body',
    });
  }
  next();
};

export const updateMe = catchAsync(
  async (req: IProtectRequest, res: Response, _next: NextFunction) => {
    const updateFields = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  }
);

export const deleteMe = catchAsync(
  async (req: IProtectRequest, res: Response, _next: NextFunction) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

export const setUserId = (
  req: IProtectRequest,
  _res: Response,
  next: NextFunction
) => {
  req.params.id = req.user.id;

  next();
};

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
// Don't update password with this it won't bcrypt because it's not an save/create event
export const patchUser = updateOne(User);
export const deleteUser = deleteOne(User);
