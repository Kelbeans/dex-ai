"use client";

export type PokemonCategory = "all" | "legendary" | "mythical" | "mega" | "gmax" | "starter" | "fossil" | "paradox";

const CATEGORIES: { id: PokemonCategory; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "legendary", label: "LEGENDARY" },
  { id: "mythical", label: "MYTHICAL" },
  { id: "mega", label: "MEGA" },
  { id: "gmax", label: "GMAX" },
  { id: "starter", label: "STARTER" },
  { id: "fossil", label: "FOSSIL" },
  { id: "paradox", label: "PARADOX" },
];

interface CategoryTabsProps {
  active: PokemonCategory;
  onChange: (category: PokemonCategory) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto px-2 py-1.5 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider transition-colors ${
            active === cat.id
              ? "bg-red-500/20 text-red-400 border border-red-500/40"
              : "text-gray-500 hover:text-gray-300 border border-white/5 hover:border-white/20"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
