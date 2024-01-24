import { protect, restrictTo } from '../controllers/authController';
import {
  deleteReview,
  getAllReviews,
  getReview,
  postReview,
  setUserTourIds,
  updateReview,
} from '../controllers/reviewController';
import express from 'express';

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setUserTourIds, postReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

export default router;
