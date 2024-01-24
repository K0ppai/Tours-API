import express from 'express';
import {
  checkBody,
  checkId,
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  patchUser,
  setUserId,
  updateMe,
} from '../controllers/userController';
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  restrictTo,
  signup,
  updatePassword,
} from '../controllers/authController';

const router = express.Router();

// param middleware
// router.param('id', checkId);

router.post('/signup', signup);

router.post('/login', login);

router.get('/me', protect, setUserId, getUser);

router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);

router.patch('/updatePassword', protect, updatePassword);

router.patch('/updateMe', protect, updateMe);

router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers);

router
  .route('/:id')
  .get(getUser)
  .patch(protect, patchUser)
  .delete(protect, restrictTo('admin'), deleteUser);

export default router;
