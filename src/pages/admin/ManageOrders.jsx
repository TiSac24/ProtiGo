import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, User, MapPin } from 'lucide-react';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/currency';

const ManageOrders = () => {
  console.log('=== MANAGE ORDERS COMPONENT LOADING ===');
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    } catch (error) {
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('Updating order status:', { orderId, newStatus });
      const response = await orderAPI.updateOrderStatus(orderId, newStatus);
      console.log('Update response:', response);
      toast.success('Order status updated successfully!');
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error('Error updating order status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update order status';
      toast.error(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
      'preparing': 'bg-orange-100 text-orange-800 border-orange-200',
      'ready': 'bg-purple-100 text-purple-800 border-purple-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
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

  const getNextStatuses = (currentStatus) => {
    const statusFlow = {
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
      <div className="manage-orders-error-container">
        <div className="manage-orders-error-content">
          <h1 className="manage-orders-error-title">Manage Orders</h1>
          <div className="manage-orders-error-message">
            <h2 className="manage-orders-error-heading">❌ Error Loading Orders</h2>
            <p className="manage-orders-error-text">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                fetchOrders();
              }}
              className="manage-orders-error-button"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-orders-container">
      <div className="manage-orders-content">
        <h1 className="manage-orders-title">Manage Orders</h1>
        
      

        {/* Simple Filters */}
        <div className="manage-orders-filters">
          <div className="manage-orders-filter-controls">
            <div>
              <label className="manage-orders-filter-label">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="manage-orders-filter-select"
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
              className="manage-orders-refresh-button"
            >
              Refresh Orders
            </button>
          </div>
        </div>

      
        {/* Orders List */}
        {loading ? (
          <div className="manage-orders-loading-skeleton">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="manage-orders-skeleton-item">
                <div className="manage-orders-skeleton-line manage-orders-skeleton-line-wide"></div>
                <div className="manage-orders-skeleton-line manage-orders-skeleton-line-medium"></div>
                <div className="manage-orders-skeleton-line manage-orders-skeleton-line-narrow"></div>
              </div>
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="manage-orders-empty-state">
            <Clock className="manage-orders-empty-icon" />
            <h3 className="manage-orders-empty-title">No orders found</h3>
            <p className="manage-orders-empty-text">No orders match your current filters.</p>
            <button 
              onClick={fetchOrders}
              className="manage-orders-empty-button"
            >
              Refresh Orders
            </button>
          </div>
        ) : (
          <div className="manage-orders-list">
            {orders.filter(order => order && order._id).map((order) => (
              <div key={order._id} className="manage-orders-order-card">
                <div className="manage-orders-order-content">
                  <div className="manage-orders-order-header">
                    <div>
                      <h3 className="manage-orders-order-id">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <div className="manage-orders-order-meta">
                        <div className="manage-orders-meta-item">
                          <User className="manage-orders-meta-icon" />
                          <span>{order.user?.name || 'Unknown Customer'}</span>
                        </div>
                        <div className="manage-orders-meta-item">
                          <Clock className="manage-orders-meta-icon" />
                          <span>{order.createdAt ? formatDate(order.createdAt) : 'Unknown Date'}</span>
                        </div>
                        <div className="manage-orders-meta-item">
                          <MapPin className="manage-orders-meta-icon" />
                          <span className="capitalize">{order.paymentMethod || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="manage-orders-order-summary">
                      <span className="manage-orders-order-amount">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <div className="manage-orders-status-container">
                        <span className={`manage-orders-status-badge ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="manage-orders-items-section">
                    <h4 className="manage-orders-items-title">Order Items</h4>
                    <div className="manage-orders-items-grid">
                      {order.items.map((item, index) => (
                        <div key={index} className="manage-orders-item-card">
                          {item.food?.image?.url ? (
                            <img
                              src={item.food.image.url}
                              alt={item.food.name || 'Food item'}
                              className="manage-orders-item-image"
                            />
                          ) : (
                            <div className="manage-orders-item-placeholder">
                              <span className="manage-orders-item-placeholder-text">No Image</span>
                            </div>
                          )}
                          <div>
                            <p className="manage-orders-item-name">{item.food?.name || 'Unknown Food'}</p>
                            <p className="manage-orders-item-details">
                              {formatPrice(item.price)} × {item.quantity}
                            </p>
                            {item.food?.nutritionInfo?.protein && (
                              <p className="manage-orders-item-protein">
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
                    <div className="manage-orders-delivery-section">
                      <h4 className="manage-orders-delivery-title">Delivery Address</h4>
                      <p className="manage-orders-delivery-address">
                        {order.deliveryAddress.street}, {order.deliveryAddress.city}, {' '}
                        {order.deliveryAddress.state} {order.deliveryAddress.zipCode}, {' '}
                        {order.deliveryAddress.country}
                      </p>
                    </div>
                  )}

                  {/* Special Instructions */}
                  {order.notes && (
                    <div className="manage-orders-notes-section">
                      <h4 className="manage-orders-notes-title">Special Instructions</h4>
                      <p className="manage-orders-notes-text">{order.notes}</p>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div className="manage-orders-status-actions">
                    <h4 className="manage-orders-status-title">Update Status</h4>
                    <div className="manage-orders-status-info">
                      Current Status: <span className="manage-orders-current-status">{order.status}</span>
                      <br />
                      Available Actions: {getNextStatuses(order.status).join(', ') || 'None'}
                    </div>
                    {getNextStatuses(order.status).length > 0 ? (
                      <div className="manage-orders-action-buttons">
                        {getNextStatuses(order.status).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order._id, status)}
                            className={`manage-orders-action-button ${
                              status === 'cancelled' 
                                ? 'manage-orders-action-button-cancel'
                                : 'manage-orders-action-button-update'
                            }`}
                          >
                            Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="manage-orders-no-actions">No actions available for this status</p>
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