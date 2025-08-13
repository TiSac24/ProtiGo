import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/admin/Dashboard';
import ManageFoods from './pages/admin/ManageFoods';
import ManageOrders from './pages/admin/ManageOrders';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes - More specific routes first */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute role="admin">
                    <AdminNavbar />
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/foods" 
                element={
                  <ProtectedRoute role="admin">
                    <AdminNavbar />
                    <ManageFoods />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <ProtectedRoute role="admin">
                    <AdminNavbar />
                    <ManageOrders />
                  </ProtectedRoute>
                } 
              />
              
              {/* Customer Routes - Less specific routes last */}
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute role="customer">
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute role="customer">
                    <Orders />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;