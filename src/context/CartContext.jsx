import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, token, isCustomer } = useAuth();

  useEffect(() => {
    if (user && token && isCustomer) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user, token, isCustomer]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (food, quantity = 1) => {
    try {
      setLoading(true);
      const response = await cartAPI.addToCart(food._id, quantity);
      setCart(response.cart);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      const response = await cartAPI.updateCartItem(itemId, quantity);
      setCart(response.cart);
      toast.success('Cart updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      const response = await cartAPI.removeFromCart(itemId);
      setCart(response.cart);
      toast.success('Item removed from cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.clearCart();
      setCart(response.cart);
      toast.success('Cart cleared!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getCartTotal = () => {
    return cart?.totalAmount || 0;
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};