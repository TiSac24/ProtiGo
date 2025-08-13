import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import { CreditCard, ArrowLeft, MapPin, Phone, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const { cart, loading, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');

  const total = getCartTotal();
  const deliveryFee = total > 500 ? 0 : 50; // Free delivery above ₹500
  const tax = total * 0.18; // 18% GST
  const grandTotal = total + deliveryFee + tax;

  const handleAddressChange = (field: string, value: string) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode || !deliveryAddress.country) {
      toast.error('Please fill in all delivery address fields');
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await orderAPI.createOrder({
        paymentMethod,
        deliveryAddress,
        notes
      });

      if (response.success) {
        toast.success('Order placed successfully!');
        await clearCart();
        navigate('/orders');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious food to get started!</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  Cart Items ({cart.items.length})
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            {showCheckout && (
              <div className="bg-white rounded-lg shadow-sm mt-6">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">Checkout Information</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Delivery Address */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Delivery Address
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={deliveryAddress.street}
                          onChange={(e) => handleAddressChange('street', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={deliveryAddress.city}
                          onChange={(e) => handleAddressChange('city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={deliveryAddress.state}
                          onChange={(e) => handleAddressChange('state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={deliveryAddress.zipCode}
                          onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <input
                          type="text"
                          placeholder="Country"
                          value={deliveryAddress.country}
                          onChange={(e) => handleAddressChange('country', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>

                    {/* Payment Method & Notes */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment & Notes
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option value="cash">Cash on Delivery</option>
                            <option value="card">Credit/Debit Card</option>
                            <option value="online">Online Payment</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any special instructions for delivery..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST):</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                {!showCheckout ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full mt-6 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                  </button>
                ) : (
                  <div className="space-y-3 mt-6">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={checkoutLoading}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>{checkoutLoading ? 'Placing Order...' : 'Place Order'}</span>
                    </button>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Back to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;