import { protect, restrictTo } from '../controllers/authController';
import { getAllReviews, postReview } from '../controllers/reviewController';
import express from 'express';

const router = express.Router();

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), postReview);

export default router;
