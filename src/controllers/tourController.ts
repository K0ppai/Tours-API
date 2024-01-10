import Tour from '../models/tourModel';
import { Request, Response } from 'express';

const getAllTours = async (req: Request, res: Response) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      data: {
        tours,
      },
      results: tours.length,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

const getTour = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findById(id);

    res.json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

const postTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

const patchTour = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

const deleteTour = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

export { getAllTours, postTour, patchTour, deleteTour, getTour };
