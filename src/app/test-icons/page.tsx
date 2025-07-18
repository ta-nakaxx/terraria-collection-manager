"use client";

/**
 * アイコンテストページ - デバッグ用
 */

import React from 'react';
import Image from 'next/image';
import ItemIcon from '@/components/ui/ItemIcon';
import { generateItemIcon, svgToDataUri } from '@/utils/iconGenerator';

const testItems = [
  {
    id: "4",
    name: "Iron Broadsword",
    category: "Weapons",
    iconPath: "/assets/icons/weapons/4.png",
    rarity: "white"
  },
  {
    id: "29",
    name: "Life Crystal",
    category: "Consumables", 
    iconPath: "/assets/icons/consumables/29.png",
    rarity: "white"
  },
  {
    id: "test1",
    name: "Non-existent Item",
    category: "Weapons",
    iconPath: "/assets/icons/weapons/nonexistent.png",
    rarity: "white"
  }
];

export default function TestIconsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Icon Test Page</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Direct Image Test</h2>
        <div className="flex gap-4 items-center">
          <div>
            <p>Iron Broadsword (direct):</p>
            <Image
              src="/assets/icons/weapons/4.png"
              alt="Iron Broadsword"
              width={32}
              height={32}
              className="border border-white"
            />
          </div>
          <div>
            <p>Life Crystal (direct):</p>
            <Image
              src="/assets/icons/consumables/29.png"
              alt="Life Crystal" 
              width={32}
              height={32}
              className="border border-white"
            />
          </div>
          <div>
            <p>Default Weapon Icon:</p>
            <Image
              src="/assets/icons/default/weapon.svg"
              alt="Default weapon"
              width={32}
              height={32}
              className="border border-white"
            />
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">ItemIcon Component Test</h2>
        <div className="flex gap-4 items-center">
          {testItems.map((item) => (
            <div key={item.id} className="text-center">
              <p className="mb-2">{item.name}</p>
              <ItemIcon item={item} size={32} />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Generated Icons Test</h2>
        <div className="flex gap-4 items-center">
          {testItems.map((item) => {
            const generatedSvg = generateItemIcon(item);
            const dataUri = svgToDataUri(generatedSvg);
            return (
              <div key={`generated-${item.id}`} className="text-center">
                <p className="mb-2">{item.name} (Generated)</p>
                <Image
                  src={dataUri}
                  alt={`Generated ${item.name}`}
                  width={32}
                  height={32}
                  className="border border-white"
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">File Path Debug</h2>
        <div className="space-y-2 text-sm">
          <p>Expected paths:</p>
          <ul className="list-disc list-inside">
            <li>/assets/icons/weapons/4.png</li>
            <li>/assets/icons/consumables/29.png</li>
            <li>/assets/icons/default/weapon.svg</li>
          </ul>
          <p className="mt-4">Dynamic icon generation fallback system now available!</p>
        </div>
      </section>
    </div>
  );
}