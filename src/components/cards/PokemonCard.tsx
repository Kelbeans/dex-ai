"use client";

import { motion } from "framer-motion";
import type { Pokemon } from "@/types/pokemon";
import { TypeBadge, TYPE_COLORS } from "./TypeBadge";
import { StatRadar } from "./StatRadar";

interface PokemonCardProps {
  data: Pokemon;
}

export function PokemonCard({ data }: PokemonCardProps) {
  const primaryType = data.types[0] ?? "normal";
  const glowColor = TYPE_COLORS[primaryType.toLowerCase()] ?? "#68a090";
  const displayName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const displayId = `#${String(data.id).padStart(4, "0")}`;
  const heightM = (data.height / 10).toFixed(1);
  const weightKg = (data.weight / 10).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
    >
      {/* Header: artwork + name */}
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 rounded-lg p-1"
          style={{ boxShadow: `0 0 20px ${glowColor}40` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.sprites.officialArtwork}
            alt={data.name}
            width={120}
            height={120}
            className="h-[120px] w-[120px] object-contain"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-mono text-lg font-bold text-gray-100">
            {displayName}{" "}
            <span className="text-sm text-gray-500">{displayId}</span>
          </h3>
          <div className="flex flex-wrap gap-1">
            {data.types.map((t) => (
              <TypeBadge key={t} typeName={t} />
            ))}
          </div>
        </div>
      </div>

      {/* Stat Radar */}
      <StatRadar stats={data.stats} primaryType={primaryType} />

      {/* Abilities */}
      <div className="mt-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
          Abilities
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          {data.abilities.map((ability) => (
            <span
              key={ability.name}
              className={`font-mono text-xs ${
                ability.isHidden
                  ? "italic text-gray-400"
                  : "text-gray-300"
              }`}
            >
              {ability.name}
              {ability.isHidden && (
                <span className="ml-1 text-[10px] text-red-400/70">(Hidden)</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Genus + Flavor Text */}
      <div className="mt-3 border-t border-white/5 pt-2">
        <p className="font-mono text-xs italic text-gray-400">
          {data.genus}
        </p>
        <p className="mt-1 text-xs italic text-gray-500">
          {data.flavorText}
        </p>
      </div>

      {/* Height / Weight */}
      <div className="mt-2 flex gap-4 font-mono text-xs text-gray-400">
        <span>Height: {heightM} m</span>
        <span>Weight: {weightKg} kg</span>
      </div>
    </motion.div>
  );
}
