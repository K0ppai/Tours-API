import express from 'express';
import {
  deleteTour,
  getAllTours,
  getTour,
  patchTour,
  postTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} from '../controllers/tourController';
import { protect, restrictTo } from '../controllers/authController';

const router = express.Router();

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/tour-stats').get(getTourStats);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/').get(protect, getAllTours).post(postTour);

router
  .route('/:id')
  .get(getTour)
  .patch(patchTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default router;
