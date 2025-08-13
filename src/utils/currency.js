// Currency formatting utility for INR
export const formatPrice = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

// For backward compatibility
export const formatINR = (amount) => {
  return formatPrice(amount);
}; 