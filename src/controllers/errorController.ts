import { NextFunction, Request, Response } from 'express';
import { TErrorHandler } from 'types/errorHandlerTypes';

const globalErrorHandler = (
  err: TErrorHandler,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default globalErrorHandler;
