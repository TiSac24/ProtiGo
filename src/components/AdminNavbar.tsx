import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Utensils } from 'lucide-react';

const AdminNavbar: React.FC = () => {
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
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
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
