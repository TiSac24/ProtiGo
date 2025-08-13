import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      updateCartItem(item._id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item._id);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border">
      <img
        src={item.food.image.url}
        alt={item.food.name}
        className="w-16 h-16 object-cover rounded-md"
      />
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.food.name}</h3>
        <p className="text-gray-600 text-sm">{formatPrice(item.price)} each</p>
        {item.food.nutritionInfo?.protein && (
          <p className="text-xs text-orange-600 font-medium">
            {item.food.nutritionInfo.protein}g Protein
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-right">
        <div className="font-semibold text-lg text-gray-800">
          {formatPrice(itemTotal)}
        </div>
        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-800 transition-colors mt-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;