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
  uploadUserPhoto,
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
import multer from 'multer';

const router = express.Router();

// param middleware
// router.param('id', checkId);

router.post('/signup', signup);

router.post('/login', login);

router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);

// Middleware to protect all routes after this
router.use(protect);

router.get('/me', setUserId, getUser);

router.patch('/updatePassword', updatePassword);

router.patch('/updateMe', uploadUserPhoto, updateMe);

router.delete('/deleteMe', deleteMe);

// Middleware for authorization
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);

router.route('/:id').get(getUser).patch(patchUser).delete(deleteUser);

export default router;
