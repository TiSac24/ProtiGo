import axios from 'axios';

<<<<<<< HEAD
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://protigo-production.up.railway.app/api'
  : 'http://localhost:5000/api';
=======
const API_BASE_URL = 'https://protigo-production.up.railway.app';
>>>>>>> 6dcd722353a3529f9f38006a1e59ad3e63d5aa8c

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
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Food API
export const foodAPI = {
  getAllFoods: async (params) => {
    const response = await api.get('/foods', { params });
    return response.data;
  },

  getFoodById: async (id) => {
    const response = await api.get(`/foods/${id}`);
    return response.data;
  },

  createFood: async (foodData) => {
    const response = await api.post('/foods', foodData);
    return response.data;
  },

  updateFood: async (id, foodData) => {
    const response = await api.put(`/foods/${id}`, foodData);
    return response.data;
  },

  deleteFood: async (id) => {
    const response = await api.delete(`/foods/${id}`);
    return response.data;
  },
};

// Cart API
export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (foodId, quantity) => {
    const response = await api.post('/cart/add', { foodId, quantity });
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/item/${itemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/item/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};

// Order API
export const orderAPI = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getAllOrders: async (params) => {
    const response = await api.get('/orders/all', { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};

export default api;
