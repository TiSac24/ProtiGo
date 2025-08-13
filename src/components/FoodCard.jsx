import React from 'react';
import { Plus, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

const FoodCard = ({ food }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const isCustomer = user?.role === 'customer';

  const handleAddToCart = () => {
    addToCart(food, 1);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'protein-shake': 'bg-blue-100 text-blue-800',
      'protein-bar': 'bg-green-100 text-green-800',
      'protein-meal': 'bg-orange-100 text-orange-800',
      'protein-snack': 'bg-purple-100 text-purple-800',
      'protein-dessert': 'bg-pink-100 text-pink-800',
      'protein-supplement': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category) => {
    const labels = {
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
    <div className="food-card group">
      <div className="food-image-container">
        <img
          src={food.image.url}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="category-badge">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(food.category)}`}>
            {getCategoryLabel(food.category)}
          </span>
        </div>
        {!food.isAvailable && (
          <div className="out-of-stock-overlay">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="food-card-content">
        <h3 className="food-name">
          {food.name}
        </h3>
        {food.weight && (
          <div className="weight-badge">
            <span className="weight-label">
              {food.weight}
            </span>
          </div>
        )}
        
        <p className="food-description">
          {food.description}
        </p>
        
        {/* Protein Content Highlight */}
        {food.nutritionInfo?.protein && (
          <div className="protein-highlight">
            <div className="protein-content">
              <span className="protein-label">Protein Content</span>
              <span className="protein-value">{food.nutritionInfo.protein}g</span>
            </div>
          </div>
        )}
        
        <div className="preparation-time">
          <div className="preparation-info">
            <Clock className="w-4 h-4 mr-1" />
            {food.preparationTime} mins
          </div>
        </div>
        
        <div className="food-card-footer">
          <div className="food-price">
            {formatPrice(food.price)}
          </div>
          
          {isCustomer && food.isAvailable && (
            <button
              onClick={handleAddToCart}
              className="add-to-cart-button"
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