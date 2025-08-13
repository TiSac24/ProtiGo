import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from './models/Food.js';
import User from './models/User.js';

dotenv.config();

const sampleFoods = [
  {
    name: 'Whey Protein Shake',
    description: 'Premium whey protein shake with 25g protein per serving, perfect for muscle recovery',
    price: 416.67, // ₹416.67 (equivalent to $4.99)
    weight: '330 ml',
    category: 'protein-shake',
    image: {
      url: 'https://images.pexels.com/photos/4052384/pexels-photo-4052384.jpeg'
    },
    ingredients: ['Whey protein isolate', 'Milk', 'Banana', 'Honey'],
    nutritionInfo: {
      calories: 180,
      protein: 25,
      carbs: 15,
      fat: 2
    },
    preparationTime: 3,
    isAvailable: true
  },
  {
    name: 'Protein Power Bar',
    description: 'High-protein energy bar with nuts and chocolate, 20g protein per bar',
    price: 333.17, // ₹333.17 (equivalent to $3.99)
    weight: '60 g',
    category: 'protein-bar',
    image: {
      url: 'https://images.pexels.com/photos/46174/pexels-photo-46174.jpeg'
    },
    ingredients: ['Protein blend', 'Almonds', 'Dark chocolate', 'Oats', 'Honey'],
    nutritionInfo: {
      calories: 220,
      protein: 20,
      carbs: 18,
      fat: 8
    },
    preparationTime: 0,
    isAvailable: true
  },
  {
    name: 'Grilled Chicken Breast',
    description: 'Lean grilled chicken breast with herbs and spices, 30g protein per serving',
    price: 1084.67, // ₹1084.67 (equivalent to $12.99)
    weight: '250 g',
    category: 'protein-meal',
    image: {
      url: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg'
    },
    ingredients: ['Chicken breast', 'Olive oil', 'Herbs', 'Spices', 'Lemon'],
    nutritionInfo: {
      calories: 280,
      protein: 30,
      carbs: 2,
      fat: 6
    },
    preparationTime: 20,
    isAvailable: true
  },
  {
    name: 'Greek Yogurt Bowl',
    description: 'High-protein Greek yogurt with berries and granola, 15g protein per bowl',
    price: 583.67, // ₹583.67 (equivalent to $6.99)
    weight: '200 g',
    category: 'protein-snack',
    image: {
      url: 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg'
    },
    ingredients: ['Greek yogurt', 'Mixed berries', 'Granola', 'Honey', 'Nuts'],
    nutritionInfo: {
      calories: 200,
      protein: 15,
      carbs: 25,
      fat: 5
    },
    preparationTime: 5,
    isAvailable: true
  },
  {
    name: 'Protein Brownie',
    description: 'Delicious protein brownie with 12g protein, guilt-free dessert option',
    price: 416.67, // ₹416.67 (equivalent to $4.99)
    weight: '80 g',
    category: 'protein-dessert',
    image: {
      url: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'
    },
    ingredients: ['Protein powder', 'Dark chocolate', 'Almond flour', 'Eggs', 'Cocoa'],
    nutritionInfo: {
      calories: 180,
      protein: 12,
      carbs: 20,
      fat: 8
    },
    preparationTime: 2,
    isAvailable: true
  },
  {
    name: 'BCAA Supplement',
    description: 'Branched-chain amino acid supplement for muscle recovery and growth',
    price: 2504.17, // ₹2504.17 (equivalent to $29.99)
    weight: '300 g',
    category: 'protein-supplement',
    image: {
      url: 'https://images.pexels.com/photos/4052384/pexels-photo-4052384.jpeg'
    },
    ingredients: ['BCAA blend', 'Electrolytes', 'Natural flavors'],
    nutritionInfo: {
      calories: 5,
      protein: 5,
      carbs: 1,
      fat: 0
    },
    preparationTime: 1,
    isAvailable: true
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@proteinhub.com',
    password: 'password123',
    role: 'admin',
    phone: '1234567890'
  },
  {
    name: 'Customer User',
    email: 'customer@proteinhub.com',
    password: 'password123',
    role: 'customer',
    phone: '0987654321'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-ordering-app');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Food.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const createdUsers = await User.create(sampleUsers);
    console.log('Created sample users');

    // Add createdBy field to foods
    const adminUser = createdUsers.find(user => user.role === 'admin');
    const foodsWithUser = sampleFoods.map(food => ({
      ...food,
      createdBy: adminUser._id
    }));

    // Create sample foods
    await Food.create(foodsWithUser);
    console.log('Created sample foods');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 