import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { foodAPI } from '../services/api';
import FoodCard from '../components/FoodCard';
import CategoryFilter from '../components/CategoryFilter';
import toast from 'react-hot-toast';

const Home = () => {
  const [foods, setFoods] = useState([]);
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
    } catch (error) {
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
    { value: 'protein-dessert', label: 'Protein Desserts' },
    { value: 'protein-supplement', label: 'Protein Supplements' }
  ];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
              <div className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="home-page-hero-title">
                Welcome to <span className="home-page-hero-highlight">ProtiGo</span>
              </h1>
            <p className="home-page-hero-description">
              Fuel your fitness journey with premium high-protein foods, shakes, and supplements. 
              Build muscle, recover faster, and achieve your fitness goals.
            </p>
            

          </div>
        </div>
      </div>

      {/* Filters and Content */}
      <div className="main-content">
        {/* Top Controls */}
        <div className="controls-header">
          <div className="home-page-sort-controls">
            <div className="home-page-sort-container">
              <Filter className="home-page-sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="home-page-sort-select"
              >
                <option value="">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <div className="home-page-results-count">
            {foods.length} {foods.length === 1 ? 'item' : 'items'} found
          </div>
        </div>

        {/* Sidebar Layout */}
        <div className="content-layout">
          {/* Category Sidebar */}
          <div className="category-sidebar">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Foods Grid */}
          <div className="foods-grid-container">
            {foods.length === 0 ? (
              <div className="empty-state">
                <div className="home-page-empty-emoji">💪</div>
                <h3 className="home-page-empty-title">No protein foods found</h3>
                <p className="home-page-empty-text">
                  Try adjusting your filters or category selection.
                </p>
              </div>
            ) : (
              <div className="foods-grid">
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