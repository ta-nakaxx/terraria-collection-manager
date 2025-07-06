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

export default function TerrariaDashboard() {
  const [items, setItems] = useState<Item[]>(v0Items);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by category
    if (selectedCategory) {
      const category = categories.find((c) => c.id === selectedCategory);
      if (category) {
        filtered = filtered.filter((item) => item.type === category.type);
      }
    }

    // Filter by subcategory
    if (selectedSubcategory) {
      filtered = filtered.filter((item) => item.subcategory === selectedSubcategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return filtered;
  }, [items, selectedCategory, selectedSubcategory, searchQuery]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(selectedSubcategory === subcategory ? null : subcategory);
  };

  const handleToggleOwned = (itemId: string) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, owned: !item.owned } : item)));

    // Update selected item if it's the one being toggled
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
            <ProgressOverview items={items} />
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