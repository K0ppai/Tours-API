import express from 'express';
import {
  checkBody,
  checkId,
  deleteUser,
  getAllUsers,
  getUser,
  patchUser,
  postUser,
} from '../controllers/userController';
import { forgotPassword, login, resetPassword, signup } from '../controllers/authController';

const router = express.Router();

// param middleware
// router.param('id', checkId);

router.post('/signup', signup);

router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);

router.post('/login', login);

router.route('/').get(getAllUsers).post(checkBody, postUser);

router.route('/:id').get(getUser).patch(patchUser).delete(deleteUser);

export default router;
