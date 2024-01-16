import { NextFunction, Request, Response } from 'express';
import { TErrorHandler } from 'types/errorHandlerType';

const globalErrorHandler = (
  err: TErrorHandler,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default globalErrorHandler;
