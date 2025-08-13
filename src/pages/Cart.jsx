import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import { CreditCard, ArrowLeft, MapPin, Phone, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const Cart = () => {
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

  const handleAddressChange = (field, value) => {
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
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-page-loading">
        <div className="cart-page-loading-spinner"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page-empty">
        <div className="cart-page-empty-content">
          <h2 className="cart-page-empty-title">Your cart is empty</h2>
          <p className="cart-page-empty-text">Add some delicious food to get started!</p>
          <Link
            to="/"
            className="cart-page-empty-button"
          >
            <ArrowLeft className="cart-page-button-icon" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-page-content">
        <div className="cart-page-header">
          <h1 className="cart-page-title">Shopping Cart</h1>
          <Link
            to="/"
            className="cart-page-continue-shopping"
          >
            <ArrowLeft className="cart-page-button-icon" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="cart-page-layout">
          {/* Cart Items */}
          <div className="cart-page-items-section">
            <div className="cart-page-items-container">
              <div className="cart-page-items-header">
                <h2 className="cart-page-items-title">
                  Cart Items ({cart.items.length})
                </h2>
              </div>
              <div className="cart-page-items-content">
                <div className="cart-page-items-list">
                  {cart.items.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            {showCheckout && (
              <div className="cart-page-checkout-form">
                <div className="cart-page-checkout-header">
                  <h2 className="cart-page-checkout-title">Checkout Information</h2>
                </div>
                <div className="cart-page-checkout-content">
                  <div className="cart-page-checkout-layout">
                    {/* Delivery Address */}
                    <div>
                      <h3 className="cart-page-section-title">
                        <MapPin className="cart-page-section-icon" />
                        Delivery Address
                      </h3>
                      <div className="cart-page-address-fields">
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={deliveryAddress.street}
                          onChange={(e) => handleAddressChange('street', e.target.value)}
                          className="cart-page-form-input"
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={deliveryAddress.city}
                          onChange={(e) => handleAddressChange('city', e.target.value)}
                          className="cart-page-form-input"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={deliveryAddress.state}
                          onChange={(e) => handleAddressChange('state', e.target.value)}
                          className="cart-page-form-input"
                        />
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={deliveryAddress.zipCode}
                          onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                          className="cart-page-form-input"
                        />
                        <input
                          type="text"
                          placeholder="Country"
                          value={deliveryAddress.country}
                          onChange={(e) => handleAddressChange('country', e.target.value)}
                          className="cart-page-form-input"
                        />
                      </div>
                    </div>

                    {/* Payment Method & Notes */}
                    <div>
                      <h3 className="cart-page-section-title">
                        <CreditCard className="cart-page-section-icon" />
                        Payment & Notes
                      </h3>
                      <div className="cart-page-payment-fields">
                        <div>
                          <label className="cart-page-form-label">Payment Method</label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="cart-page-form-input"
                          >
                            <option value="cash">Cash on Delivery</option>
                            <option value="card">Credit/Debit Card</option>
                            <option value="online">Online Payment</option>
                          </select>
                        </div>
                        <div>
                          <label className="cart-page-form-label">Special Instructions</label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any special instructions for delivery..."
                            rows={3}
                            className="cart-page-form-input"
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
          <div className="cart-page-summary-section">
            <div className="cart-page-summary-container">
              <div className="cart-page-summary-card">
                <h2 className="cart-page-summary-title">Order Summary</h2>
                
                <div className="cart-page-summary-details">
                  <div className="cart-page-summary-row">
                    <span>Subtotal:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="cart-page-summary-row">
                    <span>Delivery Fee:</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="cart-page-summary-row">
                    <span>Tax (18% GST):</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="cart-page-summary-total">
                    <div className="cart-page-summary-total-row">
                      <span>Total:</span>
                      <span>{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                {!showCheckout ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="cart-page-checkout-button"
                  >
                    <CreditCard className="cart-page-button-icon" />
                    <span>Proceed to Checkout</span>
                  </button>
                ) : (
                  <div className="cart-page-order-actions">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={checkoutLoading}
                      className="cart-page-place-order-button"
                    >
                      <CreditCard className="cart-page-button-icon" />
                      <span>{checkoutLoading ? 'Placing Order...' : 'Place Order'}</span>
                    </button>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="cart-page-back-button"
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