import express from 'express';
import {
  createJob,
  getJobs,
  deleteJob,
  updateJob,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply `protect` middleware to all routes
router.route('/').post(protect, createJob).get(protect, getJobs);
router.route('/:id').put(protect, updateJob).delete(protect, deleteJob);

export default router;
