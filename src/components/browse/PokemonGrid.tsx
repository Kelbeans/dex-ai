"use client";

import { useState, useEffect } from "react";
import type { PokemonListItem } from "@/lib/pokemon-list";
import type { PokemonCategory } from "./CategoryTabs";
import { filterByCategory } from "@/lib/pokemon-categories";

interface PokemonGridProps {
  gen: number;
  filter: string;
  category: PokemonCategory;
  onSelect: (id: number, name: string) => void;
}

export function PokemonGrid({ gen, filter, category, onSelect }: PokemonGridProps) {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/pokemon-list?gen=${gen}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
        return res.json();
      })
      .then((data: PokemonListItem[]) => {
        if (!cancelled) {
          setPokemon(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [gen]);

  const categoryFiltered = filterByCategory(pokemon, category);
  const filtered = filter
    ? categoryFiltered.filter((p) => p.name.includes(filter.toLowerCase()))
    : categoryFiltered;

  if (loading) {
    return (
      <div className="grid grid-cols-6 gap-2 p-3">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-2 rounded-lg bg-white/5 p-3"
            style={{ height: "calc((100vh - 120px) / 3)" }}
          >
            <div className="h-20 w-20 animate-pulse rounded bg-gray-700" />
            <div className="h-3 w-14 animate-pulse rounded bg-gray-700" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="font-mono text-xs text-red-400">ERROR: {error}</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="font-mono text-xs text-gray-500">NO MATCHES</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-2 overflow-y-auto p-3">
      {filtered.map((p, idx) => (
        <button
          key={`${p.name}-${idx}`}
          onClick={() => onSelect(p.id, p.name)}
          className="flex flex-col items-center justify-center gap-1 rounded-lg bg-white/5 p-3 transition-all hover:scale-[1.03] hover:bg-white/10 hover:shadow-[0_0_12px_rgba(239,68,68,0.3)]"
          style={{ height: "calc((100vh - 120px) / 3)" }}
        >
          <span className="font-mono text-xs text-gray-600">
            #{String(p.id).padStart(3, "0")}
          </span>
          <img
            src={p.spriteUrl}
            alt={p.name}
            width={180}
            height={180}
            loading="lazy"
            className="object-contain"
          />
          <span className="font-pokemon text-base capitalize text-gray-400">
            {p.name.replace(/-/g, " ")}
          </span>
        </button>
      ))}
    </div>
  );
}
