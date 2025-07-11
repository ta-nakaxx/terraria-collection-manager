"use client";

import { Item } from '@/types';
// Lightweight close icon
const CloseIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m18 6-12 12M6 6l12 12"/>
  </svg>
);

interface ItemDetailsPanelProps {
  item: Item | null;
  onClose: () => void;
  onToggleOwned: (itemId: string) => void;
}

const rarityColors = {
  white: "text-gray-600",
  blue: "text-blue-600",
  green: "text-green-600",
  orange: "text-orange-600",
  red: "text-red-600",
  purple: "text-purple-600",
  rainbow: "text-purple-600",
};

export function ItemDetailsPanel({ item, onClose, onToggleOwned }: ItemDetailsPanelProps) {
  if (!item) {
    return (
      <div className="w-full h-full bg-white/80 backdrop-blur-sm border-l border-gray-200/60 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Select an item to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white/90 backdrop-blur-sm border-l border-gray-200/60 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold text-gray-900 tracking-wide">Item Details</h2>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100/80 rounded-lg transition-colors duration-200">
          <CloseIcon />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-2 pb-4 border-b border-gray-200/60">
          <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center shadow-inner">
            <img src={item.iconPath || "/placeholder.svg"} alt={item.name} className="w-12 h-12 object-contain" />
          </div>
          <h3 className={`text-lg font-bold text-center ${rarityColors[item.rarity]}`}>{item.name}</h3>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</span>
            <p className="text-sm text-gray-800 font-medium mt-1">
              {item.category} - {item.subcategory}
              {item.subSubcategory && ` - ${item.subSubcategory}`}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rarity</span>
            <p className={`text-sm font-semibold mt-1 capitalize ${rarityColors[item.rarity]}`}>{item.rarity}</p>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Game Stage</span>
            <p className="text-sm text-gray-800 font-medium mt-1 capitalize">{item.gameStage.replace("-", " ")}</p>
          </div>

          {item.stats && (
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stats</span>
              <div className="mt-2 space-y-1">
                {item.stats.damage && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Damage</span>
                    <span className="text-sm font-semibold text-gray-800">{item.stats.damage}</span>
                  </div>
                )}
                {item.stats.defense && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Defense</span>
                    <span className="text-sm font-semibold text-gray-800">{item.stats.defense}</span>
                  </div>
                )}
                {item.stats.effects && (
                  <div>
                    <span className="text-sm text-gray-600">Effects:</span>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      {item.stats.effects.map((effect, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          {effect}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Acquisition</span>
            <p className="text-sm text-gray-800 font-medium mt-1">{item.acquisition.join(", ")}</p>
          </div>

          {item.description && (
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</span>
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">{item.description}</p>
            </div>
          )}
        </div>

        {/* Collection toggle button (コレクション対象のみ表示) */}
        {item.collectionType === 'collectible' && (
          <button
            onClick={() => onToggleOwned(item.id)}
            className={`w-full py-2.5 px-3 rounded-xl font-semibold transition-all duration-200 text-sm border-2 ${
              item.owned
                ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800 hover:border-gray-800 shadow-lg hover:shadow-xl"
                : "bg-transparent text-gray-900 border-gray-900 hover:bg-gray-50"
            }`}
          >
            {item.owned ? "Owned" : "Not Owned"}
          </button>
        )}

        {/* Reference item indicator (参考アイテム用) */}
        {item.collectionType === 'reference' && (
          <div className="w-full py-2.5 px-3 rounded-xl font-semibold text-sm border-2 border-blue-200 bg-blue-50 text-blue-800 text-center">
            Reference Item
          </div>
        )}
      </div>
    </div>
  );
}