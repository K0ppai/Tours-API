import express from 'express';
import {
  checkBody,
  checkId,
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  patchUser,
  updateMe,
} from '../controllers/userController';
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signup,
  updatePassword,
} from '../controllers/authController';

const router = express.Router();

// param middleware
// router.param('id', checkId);

router.post('/signup', signup);

router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);

router.patch('/updatePassword', protect, updatePassword);

router.patch('/updateMe', protect, updateMe);

router.delete('/deleteMe', protect, deleteMe);

router.post('/login', login);

router.route('/').get(getAllUsers)

router.route('/:id').get(getUser).patch(protect, patchUser).delete(deleteUser);

export default router;
