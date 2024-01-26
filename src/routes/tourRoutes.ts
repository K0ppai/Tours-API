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
  getToursWithIn,
  getDistances,
} from '../controllers/tourController';
import { protect, restrictTo } from '../controllers/authController';
import reviewRouter from '../routes/reviewRoutes';

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/monthly-plan/:year')
  .get(restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router.route('/tour-stats').get(getTourStats);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithIn);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), postTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), patchTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default router;
