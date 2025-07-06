"use client";

import { useState, useMemo } from "react";
import { Item } from "@/types";
import { categories, v0Items } from "@/data/v0-data";
import { CategorySidebar } from "./CategorySidebar";
import { ItemCard } from "../items/ItemCard";
import { ItemDetailsPanel } from "../items/ItemDetailsPanel";
import { ProgressOverview } from "./ProgressOverview";
import { SearchBar } from "../common/SearchBar";
import { Search } from "lucide-react";
import { filterItems } from "@/utils/itemUtils";
import { useCollection } from "@/hooks/useCollection";

export default function TerrariaDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ローカルストレージ機能を使用
  const { 
    collection, 
    toggleItemOwnership, 
    getItemOwnership, 
    isLoading, 
    error 
  } = useCollection();

  // アイテムデータに所持状態を統合
  const itemsWithOwnership = useMemo(() => {
    return v0Items.map(item => ({
      ...item,
      owned: getItemOwnership(item.id)
    }));
  }, [collection, getItemOwnership]);

  const filteredItems = useMemo(() => {
    const category = selectedCategory ? categories.find((c) => c.id === selectedCategory) : null;
    
    return filterItems(itemsWithOwnership, {
      type: category?.type,
      subcategory: selectedSubcategory || undefined,
      search: searchQuery || undefined,
    });
  }, [itemsWithOwnership, selectedCategory, selectedSubcategory, searchQuery]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(selectedSubcategory === subcategory ? null : subcategory);
  };

  const handleToggleOwned = (itemId: string) => {
    // ローカルストレージで所持状態を切り替え
    toggleItemOwnership(itemId);

    // 選択中のアイテムが切り替え対象の場合、UIを更新
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem((prev) => (prev ? { ...prev, owned: !prev.owned } : null));
    }
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  // ローディング状態
  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your collection...</p>
        </div>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 text-red-600">⚠️</div>
          </div>
          <p className="text-red-600 font-medium">Error loading collection</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header - Fixed */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left Side - Title and Search */}
          <div className="flex items-center space-x-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Terraria Collection Manager</h1>
              <p className="text-sm text-gray-600 mt-0.5">Track your adventure progress</p>
            </div>
            <div className="w-64">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search items..." />
            </div>
          </div>

          {/* Right Side - Progress Overview */}
          <div className="flex-shrink-0">
            <ProgressOverview items={itemsWithOwnership} />
          </div>
        </div>
      </header>

      {/* Main Content - Fixed height with internal scrolling */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Fixed */}
        <div className="w-48 flex-shrink-0">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onCategorySelect={handleCategorySelect}
            onSubcategorySelect={handleSubcategorySelect}
          />
        </div>

        {/* Center Area - Scrollable Item Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-10 bg-gradient-to-br from-gray-50/50 to-white">
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 2xl:grid-cols-10 gap-6 xl:gap-2 2xl:gap-2">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} onToggleOwned={handleToggleOwned} onItemClick={handleItemClick} />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No items found matching your criteria.</p>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Fixed */}
        <div className="w-64 flex-shrink-0">
          <ItemDetailsPanel item={selectedItem} onClose={handleCloseDetails} onToggleOwned={handleToggleOwned} />
        </div>
      </div>
    </div>
  );
}