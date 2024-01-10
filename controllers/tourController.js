import Tour from '../models/tourModel.js';

const getAllTours = (req, res) => {
  res.json({ message: 'Get tour' });
};

const getTour = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get tour${id}` });
};

const postTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: tour,
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error });
  }
};

const patchTour = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Patch tour${id}` });
};

const deleteTour = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete tour${id}` });
};

export { getAllTours, postTour, patchTour, deleteTour, getTour };
