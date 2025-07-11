"use client";

import { Category } from '@/types';

/**
 * カテゴリサイドバーのProps
 */
interface CategorySidebarProps {
  /** 表示するカテゴリのリスト */
  categories: Category[];
  /** 現在選択されているカテゴリID */
  selectedCategory: string;
  /** 現在選択されているサブカテゴリ（任意） */
  selectedSubcategory: string | null;
  /** カテゴリ選択時のコールバック */
  onCategorySelect: (categoryId: string) => void;
  /** サブカテゴリ選択時のコールバック */
  onSubcategorySelect: (subcategory: string) => void;
}

/**
 * スタイル定数
 */
const STYLES = {
  SIDEBAR: "w-full h-full bg-white/80 backdrop-blur-sm border-r border-gray-200/60 flex flex-col",
  HEADER: "text-sm font-semibold text-gray-900 mb-3 tracking-wide uppercase px-3 pt-3 flex-shrink-0",
  NAV_CONTAINER: "flex-1 overflow-y-auto px-3 pb-3 category-scrollbar",
  NAV: "space-y-1",
  CATEGORY_BUTTON_BASE: "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
  CATEGORY_BUTTON_SELECTED: "bg-gray-900 text-white shadow-lg",
  CATEGORY_BUTTON_UNSELECTED: "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900",
  SUBCATEGORY_CONTAINER: "ml-3 mt-1 space-y-0.5",
  SUBCATEGORY_BUTTON_BASE: "w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
  SUBCATEGORY_BUTTON_SELECTED: "bg-blue-100 text-blue-900 shadow-sm border-l-2 border-blue-500",
  SUBCATEGORY_BUTTON_UNSELECTED: "text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-l-2 border-transparent"
} as const;

/**
 * カテゴリとサブカテゴリの選択を行うサイドバーコンポーネント
 */
export function CategorySidebar({
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategorySelect,
  onSubcategorySelect,
}: CategorySidebarProps) {
  return (
    <div className={STYLES.SIDEBAR}>
      <h2 className={STYLES.HEADER}>Categories</h2>
      <div className={STYLES.NAV_CONTAINER}>
        <nav className={STYLES.NAV}>
          {categories.map((category) => (
          <div key={category.id}>
            <button
              onClick={() => onCategorySelect(category.id)}
              className={`${STYLES.CATEGORY_BUTTON_BASE} ${
                selectedCategory === category.id
                  ? STYLES.CATEGORY_BUTTON_SELECTED
                  : STYLES.CATEGORY_BUTTON_UNSELECTED
              }`}
            >
              {category.name}
            </button>
            {selectedCategory === category.id && (
              <div className={STYLES.SUBCATEGORY_CONTAINER}>
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => onSubcategorySelect(subcategory)}
                    className={`${STYLES.SUBCATEGORY_BUTTON_BASE} ${
                      selectedSubcategory === subcategory
                        ? STYLES.SUBCATEGORY_BUTTON_SELECTED
                        : STYLES.SUBCATEGORY_BUTTON_UNSELECTED
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{subcategory}</span>
                      {selectedSubcategory === subcategory && (
                        <span className="text-blue-600 text-xs">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          ))}
        </nav>
      </div>
    </div>
  );
}