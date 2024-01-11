import express from 'express';
import {
  deleteTour,
  getAllTours,
  getTour,
  patchTour,
  postTour,
  aliasTopTours,
} from '../controllers/tourController';

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/').get(getAllTours).post(postTour);

router.route('/:id').get(getTour).patch(patchTour).delete(deleteTour);

export default router;
