// middlewares
const checkId = (req, res, next, val) => {
  if (val > 20) {
    return res.json({
      message: 'Invalid ID',
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name && !req.body.price) {
    return res.status(400).json({
      message: 'Invalid request body',
    });
  }
  next();
};

const getAllUsers = (req, res) => {
  res.json({ message: 'Get user', requestTime: req.requestTime });
};

const getUser = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get user${id}` });
};

const postUser = (req, res) => {
  res.json({ message: 'Post User' });
};

const patchUser = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Patch user${id}` });
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Delete user${id}` });
};

export { getAllUsers, postUser, patchUser, deleteUser, getUser, checkId, checkBody };
