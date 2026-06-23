"use client";

import { useState, useEffect } from "react";
import type { PokemonListItem } from "@/lib/pokemon-list";

interface PokemonGridProps {
  gen: number;
  filter: string;
  onSelect: (id: number, name: string) => void;
}

export function PokemonGrid({ gen, filter, onSelect }: PokemonGridProps) {
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

  const filtered = filter
    ? pokemon.filter((p) => p.name.includes(filter.toLowerCase()))
    : pokemon;

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2 p-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 rounded bg-white/5 p-2"
          >
            <div className="h-12 w-12 animate-pulse rounded bg-gray-700" />
            <div className="h-3 w-10 animate-pulse rounded bg-gray-700" />
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
    <div className="grid grid-cols-3 gap-2 overflow-y-auto p-2">
      {filtered.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id, p.name)}
          className="flex flex-col items-center gap-1 rounded bg-white/5 p-2 transition-all hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_8px_rgba(239,68,68,0.3)]"
        >
          <img
            src={p.spriteUrl}
            alt={p.name}
            width={48}
            height={48}
            loading="lazy"
            className="pixelated"
          />
          <span className="font-mono text-[10px] capitalize text-gray-400">
            {p.name}
          </span>
        </button>
      ))}
    </div>
  );
}
