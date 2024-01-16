import { Request, Response, NextFunction } from 'express';

type TTourControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchAsync = (fn: TTourControllerFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
