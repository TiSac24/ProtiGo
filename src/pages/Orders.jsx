import React, { useState, useEffect } from 'react';
import { Clock, MapPin, DollarSign } from 'lucide-react';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/currency';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-orange-100 text-orange-800',
      'ready': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="orders-page-loading">
        <div className="orders-page-loading-spinner"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page-empty">
        <div className="orders-page-empty-content">
          <h2 className="orders-page-empty-title">No orders yet</h2>
          <p className="orders-page-empty-text">Start ordering delicious food to see your order history!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page-container">
      <div className="orders-page-content">
        <h1 className="orders-page-title">My Orders</h1>
        
        <div className="orders-page-orders-list">
          {orders.map((order) => (
            <div key={order._id} className="orders-page-order-card">
              <div className="orders-page-order-content">
                <div className="orders-page-order-header">
                  <div>
                    <h3 className="orders-page-order-id">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <div className="orders-page-order-meta">
                      <div className="orders-page-meta-item">
                        <Clock className="orders-page-meta-icon" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="orders-page-meta-item">
                        <MapPin className="orders-page-meta-icon" />
                        <span className="capitalize">{order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="orders-page-order-summary">
                    <span className="orders-page-order-amount">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <div className="orders-page-status-container">
                      <span className={`orders-page-status-badge ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="orders-page-order-details">
                  <div className="orders-page-detail-item">
                    <DollarSign className="orders-page-detail-icon orders-page-detail-icon-amount" />
                    <div>
                      <p className="orders-page-detail-label">Total Amount</p>
                      <p className="orders-page-detail-value">{formatPrice(order.totalAmount)}</p>
                    </div>
                  </div>
                  
                  <div className="orders-page-detail-item">
                    <Clock className="orders-page-detail-icon orders-page-detail-icon-delivery" />
                    <div>
                      <p className="orders-page-detail-label">Estimated Delivery</p>
                      <p className="orders-page-detail-value">
                        {formatDate(order.estimatedDeliveryTime)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="orders-page-detail-item">
                    <MapPin className="orders-page-detail-icon orders-page-detail-icon-payment" />
                    <div>
                      <p className="orders-page-detail-label">Payment</p>
                      <p className="orders-page-detail-value capitalize">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                <div className="orders-page-items-section">
                  <h4 className="orders-page-items-title">Order Items</h4>
                  <div className="orders-page-items-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="orders-page-item-card">
                        <img
                          src={item.food.image.url}
                          alt={item.food.name}
                          className="orders-page-item-image"
                        />
                        <div className="orders-page-item-details">
                          <p className="orders-page-item-name">{item.food.name}</p>
                          {(item.weight || item.food.weight) && (
                            <span className="orders-page-item-weight">
                              {item.weight || item.food.weight}
                            </span>
                          )}
                          <p className="orders-page-item-price">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                          {item.food.nutritionInfo?.protein && (
                            <p className="orders-page-item-protein">
                              {item.food.nutritionInfo.protein}g Protein
                            </p>
                          )}
                        </div>
                        <div className="orders-page-item-total">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="orders-page-delivery-section">
                    <h4 className="orders-page-delivery-title">Delivery Address</h4>
                    <p className="orders-page-delivery-address">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}, {' '}
                      {order.deliveryAddress.state} {order.deliveryAddress.zipCode}, {' '}
                      {order.deliveryAddress.country}
                    </p>
                  </div>
                )}

                {order.notes && (
                  <div className="orders-page-notes-section">
                    <h4 className="orders-page-notes-title">Special Instructions</h4>
                    <p className="orders-page-notes-text">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;