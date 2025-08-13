import axios, { AxiosResponse } from 'axios';
import { AuthResponse, Food, Cart, Order, User } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<{ success: boolean; user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Food API
export const foodAPI = {
  getAllFoods: async (params?: {
    category?: string;
    search?: string;
    sort?: string;
  }): Promise<{ success: boolean; foods: Food[]; count: number }> => {
    const response = await api.get('/foods', { params });
    return response.data;
  },

  getFoodById: async (id: string): Promise<{ success: boolean; food: Food }> => {
    const response = await api.get(`/foods/${id}`);
    return response.data;
  },

  createFood: async (foodData: Partial<Food>): Promise<{ success: boolean; food: Food }> => {
    const response = await api.post('/foods', foodData);
    return response.data;
  },

  updateFood: async (id: string, foodData: Partial<Food>): Promise<{ success: boolean; food: Food }> => {
    const response = await api.put(`/foods/${id}`, foodData);
    return response.data;
  },

  deleteFood: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/foods/${id}`);
    return response.data;
  },
};

// Cart API
export const cartAPI = {
  getCart: async (): Promise<{ success: boolean; cart: Cart }> => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (foodId: string, quantity: number): Promise<{ success: boolean; cart: Cart }> => {
    const response = await api.post('/cart/add', { foodId, quantity });
    return response.data;
  },

  updateCartItem: async (itemId: string, quantity: number): Promise<{ success: boolean; cart: Cart }> => {
    const response = await api.put(`/cart/item/${itemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (itemId: string): Promise<{ success: boolean; cart: Cart }> => {
    const response = await api.delete(`/cart/item/${itemId}`);
    return response.data;
  },

  clearCart: async (): Promise<{ success: boolean; cart: Cart }> => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};

// Order API
export const orderAPI = {
  createOrder: async (orderData: {
    paymentMethod: string;
    deliveryAddress: any;
    notes?: string;
  }): Promise<{ success: boolean; order: Order }> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getMyOrders: async (): Promise<{ success: boolean; orders: Order[]; count: number }> => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getAllOrders: async (params?: {
    status?: string;
    sort?: string;
  }): Promise<{ success: boolean; orders: Order[]; count: number }> => {
    const response = await api.get('/orders/all', { params });
    return response.data;
  },

  getOrderById: async (id: string): Promise<{ success: boolean; order: Order }> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<{ success: boolean; order: Order }> => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};

export default api;