import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('customer'), getCart);
router.post('/add', protect, authorize('customer'), addToCart);
router.put('/item/:itemId', protect, authorize('customer'), updateCartItem);
router.delete('/item/:itemId', protect, authorize('customer'), removeFromCart);
router.delete('/clear', protect, authorize('customer'), clearCart);

export default router;