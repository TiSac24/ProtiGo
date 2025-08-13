import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Food } from '../types';
import { foodAPI } from '../services/api';
import FoodCard from '../components/FoodCard';
import CategoryFilter from '../components/CategoryFilter';
import toast from 'react-hot-toast';

const Home: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await foodAPI.getAllFoods({
        category: selectedCategory === 'all' ? undefined : selectedCategory,

        sort: sortBy || undefined
      });
      setFoods(response.foods);
    } catch (error: any) {
      toast.error('Failed to fetch protein foods');
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, sortBy]);

  const categories = [
    { value: 'all', label: 'All Proteins' },
    { value: 'protein-shake', label: 'Protein Shakes' },
    { value: 'protein-bar', label: 'Protein Bars' },
    { value: 'protein-meal', label: 'Protein Meals' },
    { value: 'protein-snack', label: 'Protein Snacks' },
    { value: 'protein-dessert', label: 'Protein Desserts' },
    { value: 'protein-supplement', label: 'Protein Supplements' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Welcome to <span className="text-orange-600">ProtiGo</span>
              </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Fuel your fitness journey with premium high-protein foods, shakes, and supplements. 
              Build muscle, recover faster, and achieve your fitness goals.
            </p>
            

          </div>
        </div>
      </div>

      {/* Filters and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            {foods.length} {foods.length === 1 ? 'item' : 'items'} found
          </div>
        </div>

        {/* Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Foods Grid */}
          <div className="flex-1">
            {foods.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💪</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No protein foods found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or category selection.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {foods.map((food) => (
                  <FoodCard key={food._id} food={food} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;