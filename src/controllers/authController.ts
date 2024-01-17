import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import AppError from '../utils/appError';
import { Types } from 'mongoose';

const signToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
    });

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: user,
    });
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Select pw(+password) again to compare with login pw because of select false in model
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
    });
  }
);

const protect = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      // check token
      if (!token) {
        return next(new AppError('Please log in to get accesss', 401));
      }
    }

    // verify token
    const { id, iat } = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    ) as JwtPayload;

    // check if user with the id exists
    const user = await User.findById(id);

    if (!user) {
      return next(
        new AppError('User no longet exists. Please sign up again.', 401)
      );
    }

    // if user changed password after authentication, authenticate again
    if (user.changePasswordAfter(iat)) {
      return next(
        new AppError('User changed password! Please log in again', 401)
      );
    }

    next();
  }
);

export { signup, login, protect };
