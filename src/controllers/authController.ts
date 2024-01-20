import { NextFunction, Request, Response } from 'express';
import User, { TUser } from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../utils/appError';
import { Types } from 'mongoose';
import { sendEmail } from '../utils/email';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const signToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user: TUser, res: Response, statusCode: number) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: user,
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
      role: req.body.role,
    });

    createSendToken(user, res, 201);
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

    createSendToken(user, res, 200);
  }
);

interface TProtectRequest extends Request {
  user: TUser;
}

const protect = catchAsync(
  async (req: TProtectRequest, _res: Response, next: NextFunction) => {
    let token;

    if (!req.headers.authorization) {
      return next(new AppError('Please log in to get accesss', 401));
    }

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
    const currentUser = await User.findById(id);

    if (!currentUser) {
      return next(
        new AppError('User no longet exists. Please sign up again.', 401)
      );
    }

    // if user changed password after authentication, authenticate again
    if (currentUser.changePasswordAfter(iat)) {
      return next(
        new AppError('User changed password! Please log in again', 401)
      );
    }

    req.user = currentUser;
    next();
  }
);

const restrictTo = (...roles: string[]) => {
  return (req: TProtectRequest, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Sorry, you don't have permission to perform this action.",
          403
        )
      );
    }

    next();
  };
};

const forgotPassword = catchAsync(
  async (req: TProtectRequest, res: Response, next: NextFunction) => {
    // 1) find user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError("User with this email doesn't exist", 404));
    }

    // 2) create reset token for the user
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // 3) send token to email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot password? Click the following link to reset. \n${resetURL}`;
    try {
      await sendEmail({
        email: user.email,
        subject: 'This link expires in 10 min',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (error) {
      user.passwordResetExpiredAt = undefined;
      user.passwordResetToken = undefined;

      await user.save({ validateBeforeSave: false });

      next(
        new AppError(
          'There was an error sending the email. Please try again.',
          500
        )
      );
    }
  }
);

const resetPassword = catchAsync(
  async (req: TProtectRequest, res: Response, next: NextFunction) => {
    // find user
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiredAt: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token is invalid or expired', 498));
    }

    // if user exists change pw
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpiredAt = undefined;
    await user.save();

    // create token
    createSendToken(user, res, 200);
  }
);

const updatePassword = catchAsync(
  async (req: TProtectRequest, res: Response, next: NextFunction) => {
    // 1) check if the user exists and the pw is correct
    const user = await User.findById(req.user.id).select('+password');

    if (!user.correctPassword(req.body.currentPassword, user.password)) {
      return next(new AppError('Oops! Wrong password.', 404));
    }

    // 2) If pw correct, use save event to update so that middlewares will run
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, res, 200);
  }
);

export {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
