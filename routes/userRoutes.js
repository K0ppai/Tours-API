import express from 'express';
import {
  deleteUser,
  getAllUsers,
  getUser,
  patchUser,
  postUser,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(getAllUsers).post(postUser);

router.route('/:id').get(getUser).patch(patchUser).delete(deleteUser);

export default router;
