"use client";

import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search items..." }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-9 pr-3 py-2 border border-gray-200/60 rounded-lg text-sm leading-5 bg-white/90 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900/20 focus:border-gray-900/30 transition-all duration-200"
        placeholder={placeholder}
      />
    </div>
  );
}