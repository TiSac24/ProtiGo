import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Food } from '../../types';
import { foodAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/currency';

const ManageFoods: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    weight: '',
    category: '',
    image: '',
    ingredients: '',
    preparationTime: '',
    protein: ''
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await foodAPI.getAllFoods();
      setFoods(response.foods);
    } catch (error: any) {
      toast.error('Failed to fetch foods');
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const foodData = {
        ...formData,
        price: parseFloat(formData.price),
        ingredients: formData.ingredients.split(',').map(item => item.trim()),
        preparationTime: parseInt(formData.preparationTime),
        nutritionInfo: {
          protein: parseFloat(formData.protein) || 0
        },
        image: {
          url: formData.image
        }
      };

      if (editingFood) {
        await foodAPI.updateFood(editingFood._id, foodData);
        toast.success('Food updated successfully!');
      } else {
        await foodAPI.createFood(foodData);
        toast.success('Food added successfully!');
      }

      setShowAddForm(false);
      setEditingFood(null);
      resetForm();
      fetchFoods();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save food');
    }
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price.toString(),
      weight: food.weight || '',
      category: food.category,
      image: food.image.url,
      ingredients: food.ingredients?.join(', ') || '',
      preparationTime: food.preparationTime.toString(),
      protein: food.nutritionInfo?.protein?.toString() || ''
    });
    setShowAddForm(true);
  };


  const handleDelete = async (foodId: string) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await foodAPI.deleteFood(foodId);
        toast.success('Food deleted successfully!');
        fetchFoods();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete food');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      weight: '',
      category: '',
      image: '',
      ingredients: '',
      preparationTime: '',
      protein: ''
    });
  };

  const filteredFoods = foods.filter(food => {
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    return matchesCategory;
  });

  const categories = [
    'protein-shake', 'protein-bar', 'protein-meal', 'protein-snack', 'protein-dessert', 'protein-supplement'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Foods</h1>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingFood(null);
              resetForm();
            }}
            className="mt-4 sm:mt-0 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Food</span>
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace('-', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingFood ? 'Edit Food' : 'Add New Food'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹ INR)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (e.g., 330 ml, 60 g)</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., 330 ml"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.replace('-', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (minutes)</label>
                <input
                  type="number"
                  required
                  value={formData.preparationTime}
                  onChange={(e) => setFormData({...formData, preparationTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Protein Content (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.protein}
                  onChange={(e) => setFormData({...formData, protein: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="25.5"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (comma-separated)</label>
                <input
                  type="text"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Tomato, Cheese, Basil"
                />
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {editingFood ? 'Update Food' : 'Add Food'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingFood(null);
                    resetForm();
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Foods Grid */}
        {filteredFoods.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No foods found</h3>
                          <p className="text-gray-500">Try adjusting your filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map((food) => (
              <div key={food._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={food.image.url}
                    alt={food.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
                    <span className="text-lg font-bold text-orange-600">
                      {formatPrice(food.price)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {food.description}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      {food.category.replace('-', ' ').toUpperCase()}
                    </span>
                    {food.nutritionInfo?.protein && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        {food.nutritionInfo.protein}g Protein
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(food)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(food._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFoods;