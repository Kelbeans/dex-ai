"use client";

import { motion } from "framer-motion";
import type { Pokemon } from "@/types/pokemon";
import { TypeBadge } from "./TypeBadge";

interface ComparisonCardProps {
  data: { pokemon1: Pokemon; pokemon2: Pokemon };
}

const STAT_LABELS: { key: keyof Pokemon["stats"]; label: string }[] = [
  { key: "hp", label: "HP" },
  { key: "attack", label: "Atk" },
  { key: "defense", label: "Def" },
  { key: "specialAttack", label: "SpA" },
  { key: "specialDefense", label: "SpD" },
  { key: "speed", label: "Spe" },
];

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function totalStats(stats: Pokemon["stats"]): number {
  return stats.hp + stats.attack + stats.defense + stats.specialAttack + stats.specialDefense + stats.speed;
}

export function ComparisonCard({ data }: ComparisonCardProps) {
  const { pokemon1, pokemon2 } = data;
  const total1 = totalStats(pokemon1.stats);
  const total2 = totalStats(pokemon2.stats);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
    >
      <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-gray-500">
        Comparison
      </p>

      {/* Headers */}
      <div className="mb-3 flex flex-col gap-4 md:flex-row md:gap-4">
        <PokemonHeader pokemon={pokemon1} />
        <PokemonHeader pokemon={pokemon2} />
      </div>

      {/* Stats */}
      <div className="space-y-2">
        {STAT_LABELS.map(({ key, label }) => {
          const val1 = pokemon1.stats[key];
          const val2 = pokemon2.stats[key];
          const max = Math.max(val1, val2, 1);

          return (
            <div key={key}>
              <p className="mb-0.5 text-center font-mono text-[10px] text-gray-500">
                {label}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <StatBar value={val1} max={max} isHigher={val1 >= val2} align="right" />
                <StatBar value={val2} max={max} isHigher={val2 >= val1} align="left" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-3 grid grid-cols-2 gap-4 border-t border-white/5 pt-2">
        <p
          className={`text-right font-mono text-xs ${
            total1 >= total2 ? "text-green-400" : "text-gray-400"
          }`}
        >
          {total1}
        </p>
        <p
          className={`font-mono text-xs ${
            total2 >= total1 ? "text-green-400" : "text-gray-400"
          }`}
        >
          {total2}
        </p>
      </div>
      <p className="mt-0.5 text-center font-mono text-[9px] text-gray-600">
        Total Base Stats
      </p>
    </motion.div>
  );
}

function PokemonHeader({ pokemon }: { pokemon: Pokemon }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pokemon.sprites.front}
        alt={pokemon.name}
        width={48}
        height={48}
        className="h-12 w-12 object-contain"
      />
      <p className="font-mono text-xs font-bold text-gray-200">
        {capitalize(pokemon.name)}
      </p>
      <div className="flex flex-wrap justify-center gap-1">
        {pokemon.types.map((t) => (
          <TypeBadge key={t} typeName={t} />
        ))}
      </div>
    </div>
  );
}

function StatBar({
  value,
  max,
  isHigher,
  align,
}: {
  value: number;
  max: number;
  isHigher: boolean;
  align: "left" | "right";
}) {
  const pct = (value / max) * 100;
  const barColor = isHigher ? "bg-green-500/70" : "bg-gray-600/50";

  return (
    <div className={`flex items-center gap-1 ${align === "right" ? "flex-row-reverse" : ""}`}>
      <span
        className={`font-mono text-[10px] ${
          isHigher ? "text-green-400" : "text-gray-500"
        }`}
      >
        {value}
      </span>
      <div className={`h-2 flex-1 overflow-hidden rounded-full bg-white/5 ${align === "right" ? "flex justify-end" : ""}`}>
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
