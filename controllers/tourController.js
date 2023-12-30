const getAllTours = (req, res) => {
  res.json({ message: 'Get tour', requestTime: req.requestTime });
};

const getTour = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get tour${id}` });
};

const postTour = (req, res) => {
  res.json({ message: 'Post tour' });
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
