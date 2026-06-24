"use client";

import { useState } from "react";
import { GenTabs } from "./GenTabs";
import { CategoryTabs } from "./CategoryTabs";
import type { PokemonCategory } from "./CategoryTabs";
import { PokemonGrid } from "./PokemonGrid";

interface BrowsePanelProps {
  onPokemonSelect: (id: number, name: string) => void;
}

export function BrowsePanel({ onPokemonSelect }: BrowsePanelProps) {
  const [activeGen, setActiveGen] = useState(1);
  const [activeCategory, setActiveCategory] = useState<PokemonCategory>("all");
  const [searchFilter, setSearchFilter] = useState("");

  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-black/40">
      {/* Search */}
      <div className="border-b border-white/10 px-2 py-2">
        <input
          type="text"
          placeholder="SEARCH..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full rounded border border-white/10 bg-black/60 px-3 py-1.5 text-sm text-gray-300 placeholder-gray-600 outline-none transition-colors focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
        />
      </div>

      {/* Generation Tabs */}
      <div className="border-b border-white/10">
        <GenTabs activeGen={activeGen} onGenChange={setActiveGen} />
      </div>

      {/* Category Filter */}
      <div className="border-b border-white/10">
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Pokemon Grid */}
      <div className="flex-1 overflow-y-auto">
        <PokemonGrid
          gen={activeGen}
          filter={searchFilter}
          category={activeCategory}
          onSelect={onPokemonSelect}
        />
      </div>
    </div>
  );
}
