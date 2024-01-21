import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import bcrypt from 'bcrypt';
import { IProtectRequest } from 'types';

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

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  }
);

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

export const getUser = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `Get user${id}` });
};

export const postUser = (req: Request, res: Response) => {
  res.json({ message: 'Post User' });
};

export const patchUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let { password } = req.body;

  if (password) {
    password = await bcrypt.hash(password, 12);
    req.body.password = password;
  }

  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    // run validators(ie. maxLength) again
    runValidators: true,
  });

  res.json({ message: `Patch user${id}`, user });
});

export const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `Delete user${id}` });
};
