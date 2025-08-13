import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
import { foodAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/currency';

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
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
    } catch (error) {
      toast.error('Failed to fetch foods');
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
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
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save food');
    }
  };

  const handleEdit = (food) => {
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


  const handleDelete = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await foodAPI.deleteFood(foodId);
        toast.success('Food deleted successfully!');
        fetchFoods();
      } catch (error) {
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
      <div className="manage-foods-loading">
        <div className="manage-foods-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="manage-foods-container">
      <div className="manage-foods-content">
        <div className="manage-foods-header">
          <h1 className="manage-foods-title">Manage Foods</h1>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingFood(null);
              resetForm();
            }}
            className="add-food-button"
          >
            <Plus className="add-food-icon" />
            <span>Add New Food</span>
          </button>
        </div>

        {/* Filter */}
        <div className="filter-section">
          <div className="filter-content">
            <div className="filter-select-container">
              <Filter className="filter-icon" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
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
          <div className="food-form-section">
            <h2 className="food-form-title">
              {editingFood ? 'Edit Food' : 'Add New Food'}
            </h2>
            <form onSubmit={handleSubmit} className="food-form">
              <div>
                <label className="food-form-label">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="food-form-input"
                />
              </div>
              <div>
                <label className="food-form-label">Price (₹ INR)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="food-form-input"
                />
              </div>
              <div>
                <label className="food-form-label">Weight (e.g., 330 ml, 60 g)</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="food-form-input"
                  placeholder="e.g., 330 ml"
                />
              </div>
              <div>
                <label className="food-form-label">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="food-form-input"
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
                <label className="food-form-label">Preparation Time (minutes)</label>
                <input
                  type="number"
                  required
                  value={formData.preparationTime}
                  onChange={(e) => setFormData({...formData, preparationTime: e.target.value})}
                  className="food-form-input"
                />
              </div>
              <div>
                <label className="food-form-label">Protein Content (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.protein}
                  onChange={(e) => setFormData({...formData, protein: e.target.value})}
                  className="food-form-input"
                  placeholder="25.5"
                />
              </div>
              <div className="food-form-field-full-width">
                <label className="food-form-label">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="food-form-input"
                />
              </div>
              <div className="food-form-field-full-width">
                <label className="food-form-label">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="food-form-input"
                />
              </div>
              <div className="food-form-field-full-width">
                <label className="food-form-label">Ingredients (comma-separated)</label>
                <input
                  type="text"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                  className="food-form-input"
                  placeholder="Tomato, Cheese, Basil"
                />
              </div>
              <div className="food-form-actions">
                <button
                  type="submit"
                  className="food-form-submit-button"
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
                  className="food-form-cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Foods Grid */}
        {filteredFoods.length === 0 ? (
          <div className="empty-foods-state">
            <h3 className="empty-foods-title">No foods found</h3>
            <p className="empty-foods-text">Try adjusting your filter criteria.</p>
          </div>
        ) : (
          <div className="foods-grid">
            {filteredFoods.map((food) => (
              <div key={food._id} className="food-management-card">
                <div className="food-management-image">
                  <img
                    src={food.image.url}
                    alt={food.name}
                    className="food-management-img"
                  />
                </div>
                <div className="food-management-content">
                  <div className="food-management-header">
                    <h3 className="food-management-name">{food.name}</h3>
                    <span className="food-management-price">
                      {formatPrice(food.price)}
                    </span>
                  </div>
                  <p className="food-management-description">
                    {food.description}
                  </p>
                  <div className="food-management-badges">
                    <span className="food-management-category-badge">
                      {food.category.replace('-', ' ').toUpperCase()}
                    </span>
                    {food.nutritionInfo?.protein && (
                      <span className="food-management-protein-badge">
                        {food.nutritionInfo.protein}g Protein
                      </span>
                    )}
                  </div>
                  <div className="food-management-actions">
                    <div className="food-action-buttons">
                      <button
                        onClick={() => handleEdit(food)}
                        className="edit-food-button"
                      >
                        <Edit className="food-action-icon" />
                      </button>
                      <button
                        onClick={() => handleDelete(food._id)}
                        className="delete-food-button"
                      >
                        <Trash2 className="food-action-icon" />
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