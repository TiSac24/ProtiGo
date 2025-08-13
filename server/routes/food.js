import express from 'express';
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood
} from '../controllers/foodController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllFoods);
router.get('/:id', getFoodById);
router.post('/', protect, authorize('admin'), createFood);
router.put('/:id', protect, authorize('admin'), updateFood);
router.delete('/:id', protect, authorize('admin'), deleteFood);

export default router;