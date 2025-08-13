import React, { useState, useEffect } from 'react';
import { Clock, MapPin, DollarSign } from 'lucide-react';
import { Order } from '../types';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/currency';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.orders);
    } catch (error: any) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-orange-100 text-orange-800',
      'ready': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
          <p className="text-gray-600">Start ordering delicious food to see your order history!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
        
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="capitalize">{order.paymentMethod}</span>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-semibold">
                        {formatDate(order.estimatedDeliveryTime)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">Payment</p>
                      <p className="font-semibold capitalize">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={item.food.image.url}
                          alt={item.food.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.food.name}</p>
                          {(item.weight || item.food.weight) && (
                            <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                              {item.weight || item.food.weight}
                            </span>
                          )}
                          <p className="text-sm text-gray-600">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                          {item.food.nutritionInfo?.protein && (
                            <p className="text-xs text-orange-600 font-medium">
                              {item.food.nutritionInfo.protein}g Protein
                            </p>
                          )}
                        </div>
                        <div className="font-semibold text-gray-800">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Delivery Address</h4>
                    <p className="text-gray-600">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}, {' '}
                      {order.deliveryAddress.state} {order.deliveryAddress.zipCode}, {' '}
                      {order.deliveryAddress.country}
                    </p>
                  </div>
                )}

                {order.notes && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Special Instructions</h4>
                    <p className="text-gray-600">{order.notes}</p>
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