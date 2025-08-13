import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-gray-800">ProtiGo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
                          <Link
                to="/"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
              Menu
            </Link>
            {user && !isAdmin && (
              <>
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                >
                  Orders
                </Link>
              </>
            )}
            {user && isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                >
                  Admin
                </Link>
                <Link
                  to="/admin/orders"
                  className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                >
                  Manage Orders
                </Link>
              </>
            )}
          </div>

          {/* Right side - Cart, User, Login */}
          <div className="flex items-center space-x-4">
            {user && !isAdmin && (
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800 font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/register"
                  className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Login
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>
              {!user && (
                <>
                  <Link
                    to="/register"
                    className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </>
              )}
              {user && !isAdmin && (
                <>
                  <Link
                    to="/orders"
                    className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                </>
              )}
              {user && isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Manage Orders
                  </Link>
                </>
              )}
              {user && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;