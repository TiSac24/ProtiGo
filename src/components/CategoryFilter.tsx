import React from 'react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Array<{ value: string; label: string }>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange,
  categories
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
              selectedCategory === category.value
                ? 'bg-orange-600 text-white'
                : 'text-gray-700 hover:bg-orange-50'
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