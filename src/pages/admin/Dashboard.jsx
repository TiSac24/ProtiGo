import React, { useState, useEffect } from 'react';
import { BarChart3, Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { orderAPI, foodAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/currency';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalFoods: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders and foods
      const [ordersResponse, foodsResponse] = await Promise.all([
        orderAPI.getAllOrders(),
        foodAPI.getAllFoods()
      ]);

      const orders = ordersResponse.orders;
      const foods = foodsResponse.foods;

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalFoods: foods.length,
        pendingOrders
      });

      // Set recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));

    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening with your restaurant.</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon stat-icon-orders">
                <ShoppingBag className="stat-icon-svg" />
              </div>
              <div className="stat-details">
                <p className="stat-label">Total Orders</p>
                <p className="stat-value">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon stat-icon-revenue">
                <DollarSign className="stat-icon-svg" />
              </div>
              <div className="stat-details">
                <p className="stat-label">Total Revenue</p>
                <p className="stat-value">{formatPrice(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon stat-icon-foods">
                <BarChart3 className="stat-icon-svg" />
              </div>
              <div className="stat-details">
                <p className="stat-label">Menu Items</p>
                <p className="stat-value">{stats.totalFoods}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon stat-icon-pending">
                <TrendingUp className="stat-icon-svg" />
              </div>
              <div className="stat-details">
                <p className="stat-label">Pending Orders</p>
                <p className="stat-value">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders-section">
          <div className="recent-orders-header">
            <h2 className="recent-orders-title">Recent Orders</h2>
          </div>
          <div className="recent-orders-content">
            {recentOrders.length === 0 ? (
              <div className="empty-orders-state">
                <ShoppingBag className="empty-orders-icon" />
                <p className="empty-orders-text">No orders yet</p>
              </div>
            ) : (
              <div className="orders-list">
                {recentOrders.map((order) => (
                  <div key={order._id} className="order-item">
                    <div className="order-details">
                      <p className="order-id">
                        Order #{order._id.slice(-8)}
                      </p>
                      <p className="order-customer">
                        Customer: {order.user?.name || 'Unknown'}
                      </p>
                      <p className="order-items-count">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="order-summary">
                      <p className="order-amount">{formatPrice(order.totalAmount)}</p>
                      <span className={`order-status order-status-${order.status}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;