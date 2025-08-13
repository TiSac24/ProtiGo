import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide food name'],
    trim: true,
    maxLength: [100, 'Food name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide food description'],
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide food price'],
    min: [0, 'Price cannot be negative']
  },
  weight: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'protein-shake',
      'protein-bar',
      'protein-meal',
      'protein-dessert',
      'protein-supplement'
    ]
  },
  image: {
    url: {
      type: String,
      required: [true, 'Please provide food image']
    },
    public_id: String
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    default: 30 // in minutes
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Food', foodSchema);