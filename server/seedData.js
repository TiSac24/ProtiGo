import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from './models/Food.js';
import User from './models/User.js';

dotenv.config();

const sampleFoods = [
  {
    name: 'Whey Protein',
    description: 'Premium whey protein with 25g protein per serving, perfect for muscle recovery',
    price: 2499, // ₹416.67 (equivalent to $4.99)
    weight: '1 kg',
    category: 'protein-supplement',
    image: {
      url: 'https://www.optimumnutrition.co.in/cdn/shop/files/748927065732_1.webp?v=1742973789&width=1445'
    },
    ingredients: ['Whey protein isolate'],
    nutritionInfo: {
      calories: 180,
      protein: 25,
      carbs: 15,
      fat: 2
    },
    preparationTime: 0,
    isAvailable: true
  },
  {
    name: 'Protein Bar',
    description: 'High-protein energy bar with nuts and chocolate, 20g protein per bar',
    price: 99,
    weight: '60 g',
    category: 'protein-bar',
    image: {
      url: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/qst/qst00042/y/62.jpg'
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
    name: 'Banana Shake',
    description: 'High protein shake with banana, milk, nuts and honey',
    price: 99, 
    weight: '250 ml',
    category: 'protein-shake',
    image: {
      url: 'https://www.allrecipes.com/thmb/NHlDzARQoQZnqQOYpEOkZyjJLYw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20804banana-shakeTammyLynn4x3-f07c53dc309143619f2ed3aefdabe4ae.jpg'
    },
    ingredients: ['Milk', 'Banana', 'Nuts', 'Honey'],
    nutritionInfo: {
      calories: 280,
      protein: 10,
      carbs: 2,
      fat: 6
    },
    preparationTime: 20,
    isAvailable: true
  },
  {
    name: 'Greek Yogurt',
    description: 'High-protein Greek yogurt with berries and granola, 15g protein per bowl',
    price: 149, 
    weight: '200 g',
    category: 'protein-dessert',
    image: {
      url: 'https://gratefulgrazer.com/wp-content/uploads/2025/03/greek-yogurt-bowl-square.jpg'
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
    price: 149, 
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
    price: 999, 
    weight: '300 g',
    category: 'protein-supplement',
    image: {
      url: 'https://m.media-amazon.com/images/I/71bYDOsB8CL._UF1000,1000_QL80_.jpg'
    },
    ingredients: ['BCAA blend', 'Electrolytes', 'Natural flavors'],
    nutritionInfo: {
      calories: 5,
      protein: 0,
      carbs: 1,
      fat: 0
    },
    preparationTime: 1,
    isAvailable: true
  },
  {
    name: 'Creatine Monohydrate',
    description: 'Creatine monohydrate supplement for muscle strength and performance',
    price: 599,
    weight: '100 g',
    category: 'protein-supplement',
    image: {
      url: 'https://m.media-amazon.com/images/I/61mQAPUdgmL._UF1000,1000_QL80_.jpg'
    },
    ingredients: ['Creatine monohydrate'],
    nutritionInfo: {
      calories: 5,
      protein: 0,
      carbs: 1,
      fat: 0
    },
    preparationTime: 0,
    isAvailable: true
  },
  {
    name: 'Oat Meal',
    description: 'High ProteinOatmeal with milk and honey',
    price: 249, 
    weight: '200 g',
    category: 'protein-meal',
    image: {
      url: 'https://m.media-amazon.com/images/I/61mQAPUdgmL._UF1000,1000_QL80_.jpg'
    },
    ingredients: ['Whey protein', 'Oats', 'Milk', 'Honey','Nuts','Chia seeds'],
    nutritionInfo: {
      calories: 5,
      protein: 30,
      carbs: 1,
      fat: 0
    },
    preparationTime: 0,
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