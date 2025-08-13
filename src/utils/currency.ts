// Currency formatting utility for INR
export const formatPrice = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

// For backward compatibility
export const formatINR = (amount: number): string => {
  return formatPrice(amount);
}; 