import React from 'react';

const CategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange,
  categories
}) => {
  return (
    <div className="category-filter-container">
      <h3 className="category-filter-title">Categories</h3>
      <div className="category-filter-list">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`category-filter-button ${
              selectedCategory === category.value
                ? 'category-filter-button-active'
                : 'category-filter-button-inactive'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;