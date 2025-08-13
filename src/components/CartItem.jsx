import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      updateCartItem(item._id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item._id);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <img
        src={item.food.image.url}
        alt={item.food.name}
        className="cart-item-image"
      />
      
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.food.name}</h3>
        <p className="cart-item-price">{formatPrice(item.price)} each</p>
        {item.food.nutritionInfo?.protein && (
          <p className="cart-item-protein">
            {item.food.nutritionInfo.protein}g Protein
          </p>
        )}
      </div>
      
      <div className="cart-item-quantity-controls">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="quantity-button quantity-button-decrease"
        >
          <Minus className="quantity-icon" />
        </button>
        
        <span className="quantity-display">{item.quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="quantity-button quantity-button-increase"
        >
          <Plus className="quantity-icon" />
        </button>
      </div>
      
      <div className="cart-item-summary">
        <div className="cart-item-total">
          {formatPrice(itemTotal)}
        </div>
        <button
          onClick={handleRemove}
          className="remove-item-button"
        >
          <Trash2 className="remove-icon" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;