import { NextFunction, Request, Response } from 'express';

// middlewares
const checkId = (req: Request, res: Response, next: NextFunction, val: number) => {
  if (val > 20) {
    return res.json({
      message: 'Invalid ID',
    });
  }
  next();
};

const checkBody = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name && !req.body.price) {
    return res.status(400).json({
      message: 'Invalid request body',
    });
  }
  next();
};

const getAllUsers = (req: Request, res: Response) => {
  res.json({ message: 'Get user' });
};

const getUser = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `Get user${id}` });
};

const postUser = (req: Request, res: Response) => {
  res.json({ message: 'Post User' });
};

const patchUser = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `Patch user${id}` });
};

const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `Delete user${id}` });
};

export { getAllUsers, postUser, patchUser, deleteUser, getUser, checkId, checkBody };
