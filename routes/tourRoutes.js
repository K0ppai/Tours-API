import express from 'express';
import {
  deleteTour,
  getAllTours,
  getTour,
  patchTour,
  postTour,
} from '../controllers/tourController.js';

const router = express.Router();

router.route('/').get(getAllTours).post(postTour);

router.route('/:id').get(getTour).patch(patchTour).delete(deleteTour);

export default router;
