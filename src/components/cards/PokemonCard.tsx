"use client";

import { motion } from "framer-motion";
import type { Pokemon } from "@/types/pokemon";
import { TypeBadge, TYPE_COLORS } from "./TypeBadge";
import { StatRadar } from "./StatRadar";

interface PokemonCardProps {
  data: Pokemon;
}

export function PokemonCard({ data }: PokemonCardProps) {
  if (!data || !data.name) return null;

  const primaryType = data.types?.[0] ?? "normal";
  const glowColor = TYPE_COLORS[primaryType.toLowerCase()] ?? "#68a090";
  const displayName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const displayId = data.id ? `#${String(data.id).padStart(4, "0")}` : "";
  const heightM = data.height ? (data.height / 10).toFixed(1) : "?";
  const weightKg = data.weight ? (data.weight / 10).toFixed(1) : "?";
  const artworkUrl = data.sprites?.officialArtwork || data.sprites?.front || "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-3 rounded-lg border border-white/10 bg-white/5 p-2 backdrop-blur-sm md:p-4"
    >
      {/* Header: artwork + name */}
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 rounded-lg p-1"
          style={{ boxShadow: `0 0 20px ${glowColor}40` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {artworkUrl ? (
            <img
              src={artworkUrl}
              alt={data.name}
              width={120}
              height={120}
              className="h-[80px] w-[80px] object-contain md:h-[120px] md:w-[120px]"
            />
          ) : (
            <div className="flex h-[80px] w-[80px] items-center justify-center text-gray-600 md:h-[120px] md:w-[120px]">
              ?
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg text-gray-100">
            <span className="font-pokemon">{displayName}</span>{" "}
            <span className="text-sm text-gray-500">{displayId}</span>
          </h3>
          <div className="flex flex-wrap gap-1">
            {(data.types ?? []).map((t) => (
              <TypeBadge key={t} typeName={t} />
            ))}
          </div>
        </div>
      </div>

      {/* Stat Radar */}
      {data.stats && <StatRadar stats={data.stats} primaryType={primaryType} />}

      {/* Abilities */}
      {data.abilities && data.abilities.length > 0 && (
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
      )}

      {/* Genus + Flavor Text */}
      {(data.genus || data.flavorText) && (
        <div className="mt-3 border-t border-white/5 pt-2">
          {data.genus && (
            <p className="font-mono text-xs italic text-gray-400">
              {data.genus}
            </p>
          )}
          {data.flavorText && (
            <p className="mt-1 text-xs italic text-gray-500">
              {data.flavorText}
            </p>
          )}
        </div>
      )}

      {/* Height / Weight */}
      <div className="mt-2 flex gap-4 font-mono text-xs text-gray-400">
        <span>Height: {heightM} m</span>
        <span>Weight: {weightKg} kg</span>
      </div>
    </motion.div>
  );
}
