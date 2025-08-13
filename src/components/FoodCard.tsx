import React from 'react';
import { Plus, Clock } from 'lucide-react';
import { Food } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

interface FoodCardProps {
  food: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const isCustomer = user?.role === 'customer';

  const handleAddToCart = () => {
    addToCart(food, 1);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'protein-shake': 'bg-blue-100 text-blue-800',
      'protein-bar': 'bg-green-100 text-green-800',
      'protein-meal': 'bg-orange-100 text-orange-800',
      'protein-snack': 'bg-purple-100 text-purple-800',
      'protein-dessert': 'bg-pink-100 text-pink-800',
      'protein-supplement': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'protein-shake': 'PROTEIN SHAKE',
      'protein-bar': 'PROTEIN BAR',
      'protein-meal': 'PROTEIN MEAL',
      'protein-snack': 'PROTEIN SNACK',
      'protein-dessert': 'PROTEIN DESSERT',
      'protein-supplement': 'PROTEIN SUPPLEMENT'
    };
    return labels[category] || category.toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img
          src={food.image.url}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(food.category)}`}>
            {getCategoryLabel(food.category)}
          </span>
        </div>
        {!food.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
          {food.name}
        </h3>
        {food.weight && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
              {food.weight}
            </span>
          </div>
        )}
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {food.description}
        </p>
        
        {/* Protein Content Highlight */}
        {food.nutritionInfo?.protein && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-800">Protein Content</span>
              <span className="text-lg font-bold text-orange-600">{food.nutritionInfo.protein}g</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {food.preparationTime} mins
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-orange-600">
            {formatPrice(food.price)}
          </div>
          
          {isCustomer && food.isAvailable && (
            <button
              onClick={handleAddToCart}
              className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;