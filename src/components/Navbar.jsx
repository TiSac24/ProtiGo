import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-header">
          {/* Logo */}
          <Link to="/" className="logo-container">
            <div className="logo-icon">
              <span className="logo-text">P</span>
            </div>
            <span className="brand-name">ProtiGo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
                          <Link
                to="/"
                className="nav-link"
              >
              Menu
            </Link>
            {user && !isAdmin && (
              <>
                <Link
                  to="/orders"
                  className="nav-link"
                >
                  Orders
                </Link>
              </>
            )}
            {user && isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="nav-link"
                >
                  Admin
                </Link>
                <Link
                  to="/admin/orders"
                  className="nav-link"
                >
                  Manage Orders
                </Link>
              </>
            )}
          </div>

          {/* Right side - Cart, User, Login */}
          <div className="navbar-actions">
            {user && !isAdmin && (
              <Link
                to="/cart"
                className="cart-link"
              >
                <ShoppingBag className="w-6 h-6" />
                {getCartItemCount() > 0 && (
                  <span className="cart-badge">
                    {getCartItemCount()}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="user-menu">
                <div className="user-info">
                  <User className="user-icon" />
                  <span className="user-name">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="logout-button"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link
                  to="/register"
                  className="nav-link"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="login-button"
                >
                  Login
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-button"
            >
              {isMenuOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav">
            <div className="mobile-nav-menu">
              <Link
                to="/"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>
              {!user && (
                <>
                  <Link
                    to="/register"
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="nav-link"
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
                    className="nav-link"
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
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Manage Orders
                  </Link>
                </>
              )}
              {user && (
                <div className="mobile-user-info">
                  <div className="user-info">
                    <User className="user-icon" />
                    <span className="user-name">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="logout-button"
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