import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, User, MapPin } from 'lucide-react';
import { Order } from '../../types';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/currency';

const ManageOrders: React.FC = () => {
  console.log('=== MANAGE ORDERS COMPONENT LOADING ===');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy] = useState('newest');

  // Define fetchOrders function first
  const fetchOrders = React.useCallback(async () => {
    try {
      console.log('Fetching orders...');
      setLoading(true);
      setError(null);
      
      const response = await orderAPI.getAllOrders({
        status: statusFilter,
        sort: sortBy
      });
      
      console.log('Orders response:', response);
      setOrders(response.orders || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sortBy]);

  // Initial load effect
  useEffect(() => {
    console.log('ManageOrders component mounted, fetching orders...');
    fetchOrders();
  }, [fetchOrders]);

  // Filter change effect
  useEffect(() => {
    if (statusFilter !== 'all') {
      console.log('Status filter changed, refetching orders...');
      fetchOrders();
    }
  }, [statusFilter, fetchOrders]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      console.log('Updating order status:', { orderId, newStatus });
      const response = await orderAPI.updateOrderStatus(orderId, newStatus);
      console.log('Update response:', response);
      toast.success('Order status updated successfully!');
      fetchOrders(); // Refresh the orders list
    } catch (error: any) {
      console.error('Error updating order status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update order status';
      toast.error(errorMessage);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
      'preparing': 'bg-orange-100 text-orange-800 border-orange-200',
      'ready': 'bg-purple-100 text-purple-800 border-purple-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getNextStatuses = (currentStatus: string) => {
    const statusFlow: { [key: string]: string[] } = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['delivered', 'cancelled'],
      'delivered': [],
      'cancelled': []
    };
    return statusFlow[currentStatus] || [];
  };

  console.log('Component state:', { orders: orders.length, loading, error, statusFilter, sortBy });

  // Error boundary - if there's an error, show a simple fallback
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Orders</h1>
          <div className="bg-red-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800 mb-4">❌ Error Loading Orders</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                fetchOrders();
              }}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Orders</h1>
        
      

        {/* Simple Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={fetchOrders}
              className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Refresh Orders
            </button>
          </div>
        </div>

      
        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4 w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-600">No orders match your current filters.</p>
            <button 
              onClick={fetchOrders}
              className="mt-4 bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
            >
              Refresh Orders
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.filter(order => order && order._id).map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{order.user?.name || 'Unknown Customer'}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{order.createdAt ? formatDate(order.createdAt) : 'Unknown Date'}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="capitalize">{order.paymentMethod || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                      <span className="text-2xl font-bold text-gray-800">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          {item.food?.image?.url ? (
                            <img
                              src={item.food.image.url}
                              alt={item.food.name || 'Food item'}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{item.food?.name || 'Unknown Food'}</p>
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.price)} × {item.quantity}
                            </p>
                            {item.food?.nutritionInfo?.protein && (
                              <p className="text-xs text-orange-600 font-medium">
                                {item.food.nutritionInfo.protein}g Protein
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {order.deliveryAddress && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">Delivery Address</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {order.deliveryAddress.street}, {order.deliveryAddress.city}, {' '}
                        {order.deliveryAddress.state} {order.deliveryAddress.zipCode}, {' '}
                        {order.deliveryAddress.country}
                      </p>
                    </div>
                  )}

                  {/* Special Instructions */}
                  {order.notes && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">Special Instructions</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Update Status</h4>
                    <div className="mb-2 text-sm text-gray-600">
                      Current Status: <span className="font-medium">{order.status}</span>
                      <br />
                      Available Actions: {getNextStatuses(order.status).join(', ') || 'None'}
                    </div>
                    {getNextStatuses(order.status).length > 0 ? (
                      <div className="flex space-x-2">
                        {getNextStatuses(order.status).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order._id, status)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              status === 'cancelled' 
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No actions available for this status</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;