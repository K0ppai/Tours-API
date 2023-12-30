import express from 'express';
import {
  checkBody,
  checkId,
  deleteUser,
  getAllUsers,
  getUser,
  patchUser,
  postUser,
} from '../controllers/userController.js';

const router = express.Router();

router.param('id', checkId);

router.route('/').get(getAllUsers).post(checkBody, postUser);

router.route('/:id').get(getUser).patch(patchUser).delete(deleteUser);

export default router;
