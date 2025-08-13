import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

export const createOrder = async (req, res) => {
  try {
    const { paymentMethod, deliveryAddress, notes } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.food');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate estimated delivery time (30-60 minutes from now)
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 45);

    const order = await Order.create({
      user: req.user.id,
      items: cart.items.map(item => ({
        food: item.food._id,
        weight: item.food.weight,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: cart.totalAmount,
      paymentMethod,
      deliveryAddress,
      notes,
      estimatedDeliveryTime
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    await order.populate('items.food user');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.food')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, sort } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    let orders = Order.find(query)
      .populate('items.food user', '-password');

    if (sort === 'newest') {
      orders = orders.sort({ createdAt: -1 });
    } else if (sort === 'oldest') {
      orders = orders.sort({ createdAt: 1 });
    }

    const result = await orders;

    res.status(200).json({
      success: true,
      count: result.length,
      orders: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.food user', '-password');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    await order.populate('items.food user', '-password');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};