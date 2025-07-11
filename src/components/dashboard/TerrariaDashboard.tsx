"use client";

import { useState, useMemo, useCallback } from "react";
import { Item } from "@/types";
import { categories } from "@/data/v0-data";
import { CategorySidebar } from "./CategorySidebar";
import { ItemCard } from "../items/ItemCard";
import { ItemDetailsPanel } from "../items/ItemDetailsPanel";
import { ProgressOverview } from "./ProgressOverview";
import { SearchBar } from "../common/SearchBar";
// Lightweight icon replacement
const Search = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);
import { filterItems } from "@/utils/itemUtils";
import { useCollection } from "@/hooks/useCollection";
import { useItemData, getDataSourceDisplayInfo } from "@/hooks/useItemData";

/**
 * デフォルトで選択されるカテゴリ
 */
const DEFAULT_CATEGORY = "weapons" as const;

/**
 * レイアウト定数
 */
const LAYOUT = {
  SIDEBAR_WIDTH: "w-48",
  DETAILS_PANEL_WIDTH: "w-64",
  GRID_CLASSES: "grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9 2xl:grid-cols-10 gap-6 xl:gap-2 2xl:gap-2"
} as const;

/**
 * ローディング画面コンポーネント
 */
function LoadingScreen() {
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

/**
 * エラー画面コンポーネント
 */
function ErrorScreen({ error }: { error: string }) {
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

/**
 * アイテムが見つからない場合の表示コンポーネント
 */
function EmptyState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No items found matching your criteria.</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters.</p>
      </div>
    </div>
  );
}

/**
 * Terrariaコレクション管理のメインダッシュボードコンポーネント
 * アイテムの一覧表示、カテゴリフィルタリング、検索、所持状態管理を提供
 */
export default function TerrariaDashboard() {
  // UI状態管理
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_CATEGORY);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // アイテムデータ読み込み
  const { 
    items: rawItems, 
    isLoading: isDataLoading, 
    error: dataError,
    dataSource,
    itemCount
  } = useItemData();

  // ローカルストレージ機能を使用
  const { 
    toggleItemOwnership, 
    getItemOwnership, 
    isLoading: isCollectionLoading, 
    error: collectionError 
  } = useCollection();

  // 総合的なローディング状態とエラー状態
  const isLoading = isDataLoading || isCollectionLoading;
  const error = dataError || collectionError;

  // アイテムデータに所持状態を統合
  const itemsWithOwnership = useMemo(() => {
    return rawItems.map(item => ({
      ...item,
      owned: getItemOwnership(item.id)
    }));
  }, [rawItems, getItemOwnership]);

  const filteredItems = useMemo(() => {
    const category = categories.find((c) => c.id === selectedCategory);
    
    const filters = {
      type: category?.type,
      subcategory: selectedSubcategory || undefined,
      search: searchQuery || undefined,
    };
    
    const result = filterItems(itemsWithOwnership, filters);
    
    // Debug: フィルタリング結果をコンソールに出力
    console.log('🔍 Filtering items:', {
      selectedCategory,
      selectedSubcategory,
      categoryType: category?.type,
      totalItems: itemsWithOwnership.length,
      filteredItems: result.length,
      filters
    });
    
    return result;
  }, [itemsWithOwnership, selectedCategory, selectedSubcategory, searchQuery]);

  // イベントハンドラー（useCallbackで最適化）
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
  }, []);

  const handleSubcategorySelect = useCallback((subcategory: string) => {
    setSelectedSubcategory(selectedSubcategory === subcategory ? null : subcategory);
  }, [selectedSubcategory]);

  const handleToggleOwned = useCallback((itemId: string) => {
    toggleItemOwnership(itemId);

    // 選択中のアイテムが切り替え対象の場合、UIを更新
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem((prev) => (prev ? { ...prev, owned: !prev.owned } : null));
    }
  }, [toggleItemOwnership, selectedItem]);

  const handleItemClick = useCallback((item: Item) => {
    setSelectedItem(item);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedItem(null);
  }, []);

  // ローディング状態の表示
  if (isLoading) {
    return <LoadingScreen />;
  }

  // エラー状態の表示
  if (error) {
    return <ErrorScreen error={error} />;
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

          {/* Right Side - Progress and Data Source Info */}
          <div className="flex-shrink-0 flex items-center space-x-4">
            {/* Data Source Indicator */}
            {dataSource && (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-sm">
                  {getDataSourceDisplayInfo(dataSource).icon}
                </span>
                <span className={`text-xs font-medium ${getDataSourceDisplayInfo(dataSource).color}`}>
                  {getDataSourceDisplayInfo(dataSource).label}
                </span>
                <span className="text-xs text-gray-500">
                  ({itemCount} items)
                </span>
              </div>
            )}
            <ProgressOverview items={itemsWithOwnership} />
          </div>
        </div>
      </header>

      {/* Main Content - Fixed height with internal scrolling */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Fixed */}
        <div className={`${LAYOUT.SIDEBAR_WIDTH} flex-shrink-0`}>
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
            <div className={LAYOUT.GRID_CLASSES}>
              {filteredItems.map((item) => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onToggleOwned={handleToggleOwned} 
                  onItemClick={handleItemClick} 
                />
              ))}
            </div>

            {filteredItems.length === 0 && <EmptyState />}
          </div>
        </div>

        {/* Right Sidebar - Fixed */}
        <div className={`${LAYOUT.DETAILS_PANEL_WIDTH} flex-shrink-0`}>
          <ItemDetailsPanel 
            item={selectedItem} 
            onClose={handleCloseDetails} 
            onToggleOwned={handleToggleOwned} 
          />
        </div>
      </div>
    </div>
  );
}