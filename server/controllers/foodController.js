import Food from '../models/Food.js';

export const getAllFoods = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let foods = Food.find(query).populate('createdBy', 'name');
    
    if (sort) {
      const sortBy = sort === 'price-low' ? { price: 1 } : 
                    sort === 'price-high' ? { price: -1 } :
                    sort === 'newest' ? { createdAt: -1 } : {};
      foods = foods.sort(sortBy);
    }

    const result = await foods;

    res.status(200).json({
      success: true,
      count: result.length,
      foods: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('createdBy', 'name');
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    res.status(200).json({
      success: true,
      food
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const createFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      weight,
      category,
      image,
      ingredients,
      nutritionInfo,
      preparationTime
    } = req.body;

    const food = await Food.create({
      name,
      description,
      price,
      weight,
      category,
      image: image || {
        url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
      },
      ingredients,
      nutritionInfo: nutritionInfo || {},
      preparationTime,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      food
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateFood = async (req, res) => {
  try {
    let food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // Check if user is the creator or admin
    if (food.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own food items'
      });
    }

    food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Food item updated successfully',
      food
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // Check if user is the creator or admin
    if (food.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own food items'
      });
    }

    await Food.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};