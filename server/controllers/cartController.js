import Cart from '../models/Cart.js';
import Food from '../models/Food.js';

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.food');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { foodId, quantity = 1 } = req.body;

    const food = await Food.findById(foodId);
    if (!food || !food.isAvailable) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found or unavailable'
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{
          food: foodId,
          quantity,
          price: food.price
        }]
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        item => item.food.toString() === foodId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({
          food: foodId,
          quantity,
          price: food.price
        });
      }
      
      await cart.save();
    }

    await cart.populate('items.food');

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    if (quantity <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.food');

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items.pull(itemId);
    await cart.save();
    await cart.populate('items.food');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};