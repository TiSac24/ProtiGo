import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Utensils } from 'lucide-react';

const AdminNavbar = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: BarChart3
    },
    {
      path: '/admin/foods',
      label: 'Foods',
      icon: Utensils
    }
  ];

  return (
    <div className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-navbar-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-navbar-link ${isActive ? 'admin-navbar-link-active' : 'admin-navbar-link-inactive'}`}
              >
                <Icon className="admin-navbar-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
