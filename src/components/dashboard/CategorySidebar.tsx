"use client";

import { Category } from '@/types';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  onSubcategorySelect: (subcategory: string) => void;
}

export function CategorySidebar({
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategorySelect,
  onSubcategorySelect,
}: CategorySidebarProps) {
  return (
    <div className="w-full h-full bg-white/80 backdrop-blur-sm border-r border-gray-200/60 p-3">
      <h2 className="text-sm font-semibold text-gray-900 mb-3 tracking-wide uppercase">Categories</h2>
      <nav className="space-y-1">
        {categories.map((category) => (
          <div key={category.id}>
            <button
              onClick={() => onCategorySelect(category.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-gray-900 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
              }`}
            >
              {category.name}
            </button>
            {selectedCategory === category.id && (
              <div className="ml-3 mt-1 space-y-0.5">
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => onSubcategorySelect(subcategory)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      selectedSubcategory === subcategory
                        ? "bg-gray-100 text-gray-900 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}