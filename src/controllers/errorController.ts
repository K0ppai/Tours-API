import { NextFunction, Request, Response } from 'express';
import { TErrorHandler } from 'types';
import AppError from '../utils/appError';

const handleCastErrorDB = (err: TErrorHandler) => {
  const message = `Invalid ${err.path}: ${err.value} doesn't exist.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: TErrorHandler) => {
  const message = Object.values(err.errors)
    .map((err: { message: string }) => err.message)
    .join('. ');

  return new AppError(`${message}.`, 400);
};

const handleDuplicateErrorDB = (err: TErrorHandler) => {
  const message = `Duplicate name value: ${err.keyValue.name}. Please use another one.`;
  return new AppError(message, 400);
};

const handleInvalidTokenError = () =>
  new AppError('Invalid Token. Please log in again.', 401);

const handleExpiredTokenError = () =>
  new AppError('Expired Token. Please log in again.', 401);

const sendErrorDev = (err: TErrorHandler, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: TErrorHandler, res: Response) => {
  // Send only operational errors
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // For unknown errors, don't leak and send a generic message.
  } else {
    console.error('Error: ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const globalErrorHandler = (
  err: TErrorHandler,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleInvalidTokenError();
    if (error.name === 'TokenExpiredError') error = handleExpiredTokenError();

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
