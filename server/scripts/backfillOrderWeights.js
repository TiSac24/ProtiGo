import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-ordering-app');
    console.log('Connected to MongoDB');

    const orders = await Order.find({}).populate('items.food');
    let updatedCount = 0;

    for (const order of orders) {
      let changed = false;
      for (const item of order.items) {
        const foodWeight = item?.food && item.food.weight ? item.food.weight : undefined;
        if (!item.weight && foodWeight) {
          item.weight = foodWeight;
          changed = true;
        }
      }
      if (changed) {
        await order.save();
        updatedCount += 1;
      }
    }

    console.log(`Backfill complete. Orders updated: ${updatedCount}`);
    process.exit(0);
  } catch (err) {
    console.error('Backfill failed:', err);
    process.exit(1);
  }
};

run();


