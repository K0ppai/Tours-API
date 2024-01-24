import { protect, restrictTo } from '../controllers/authController';
import {
  deleteReview,
  getAllReviews,
  postReview,
  updateReview,
} from '../controllers/reviewController';
import express from 'express';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), postReview);

router.route('/:id').patch(updateReview).delete(deleteReview);

export default router;
