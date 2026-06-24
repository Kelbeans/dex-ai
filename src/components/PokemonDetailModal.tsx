"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { TypeBadge, TYPE_COLORS } from "@/components/cards/TypeBadge";
import { StatRadar } from "@/components/cards/StatRadar";
import { EvolutionChain } from "@/components/cards/EvolutionChain";

interface PokemonDetailModalProps {
  pokemonName: string | null;
  onClose: () => void;
  onAskAI: (name: string) => void;
}

export function PokemonDetailModal({
  pokemonName,
  onClose,
  onAskAI,
}: PokemonDetailModalProps) {
  const { pokemon, evolutionChain, isLoading, error } = usePokemonDetail(pokemonName);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (pokemonName !== null) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [pokemonName, handleEscape]);

  const handleAskAI = () => {
    if (pokemon) {
      onAskAI(pokemon.name);
      onClose();
    }
  };

  const isOpen = pokemonName !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={onClose}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-red-500/30 bg-[#0a0a0f]/95 p-5 shadow-[0_0_30px_rgba(239,68,68,0.15)] backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 font-mono text-sm text-gray-400 transition-colors hover:border-red-500/50 hover:text-red-400"
              aria-label="Close"
            >
              X
            </button>

            {/* Loading state */}
            {isLoading && <LoadingSkeleton />}

            {/* Error state */}
            {error && (
              <div className="py-8 text-center">
                <p className="font-mono text-sm text-red-400">{error}</p>
                <button
                  onClick={onClose}
                  className="mt-4 font-mono text-xs uppercase text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            )}

            {/* Pokemon data */}
            {pokemon && !isLoading && (
              <PokemonContent
                pokemon={pokemon}
                evolutionChain={evolutionChain}
                onAskAI={handleAskAI}
                onClose={onClose}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 py-4">
      <div className="flex items-start gap-4">
        <div className="h-[150px] w-[150px] rounded-lg bg-white/5" />
        <div className="flex-1 space-y-3 pt-2">
          <div className="h-6 w-32 rounded bg-white/5" />
          <div className="h-4 w-20 rounded bg-white/5" />
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-white/5" />
            <div className="h-5 w-16 rounded-full bg-white/5" />
          </div>
        </div>
      </div>
      <div className="h-40 rounded-lg bg-white/5" />
      <div className="h-20 rounded-lg bg-white/5" />
      <div className="h-24 rounded-lg bg-white/5" />
    </div>
  );
}

function PokemonContent({
  pokemon,
  evolutionChain,
  onAskAI,
  onClose,
}: {
  pokemon: NonNullable<ReturnType<typeof usePokemonDetail>["pokemon"]>;
  evolutionChain: ReturnType<typeof usePokemonDetail>["evolutionChain"];
  onAskAI: () => void;
  onClose: () => void;
}) {
  const primaryType = pokemon.types[0] ?? "normal";
  const glowColor = TYPE_COLORS[primaryType.toLowerCase()] ?? "#68a090";
  const displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const displayId = `#${String(pokemon.id).padStart(4, "0")}`;
  const heightM = (pokemon.height / 10).toFixed(1);
  const weightKg = (pokemon.weight / 10).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Header: artwork + name */}
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 rounded-lg p-2"
          style={{ boxShadow: `0 0 30px ${glowColor}50` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pokemon.sprites.officialArtwork}
            alt={pokemon.name}
            width={150}
            height={150}
            className="h-[150px] w-[150px] object-contain"
          />
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <h2 className="font-pokemon text-xl text-gray-100">
            {displayName}
          </h2>
          <span className="font-mono text-sm text-gray-500">{displayId}</span>
          <div className="flex flex-wrap gap-1">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} typeName={t} />
            ))}
          </div>
        </div>
      </div>

      {/* Stat Radar */}
      <StatRadar stats={pokemon.stats} primaryType={primaryType} />

      {/* Abilities */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
          Abilities
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          {pokemon.abilities.map((ability) => (
            <span
              key={ability.name}
              className={`font-mono text-xs ${
                ability.isHidden ? "italic text-gray-400" : "text-gray-300"
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

      {/* Evolution Chain */}
      {evolutionChain && <EvolutionChain data={evolutionChain} />}

      {/* Alternate Forms (Mega, Gmax, Regional) */}
      {pokemon.forms && pokemon.forms.length > 0 && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-gray-500">
            Alternate Forms
          </p>
          <div className="flex flex-wrap gap-3">
            {pokemon.forms.map((form) => (
              <div key={form.name} className="flex flex-col items-center gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {form.spriteUrl ? (
                  <img
                    src={form.spriteUrl}
                    alt={form.formName}
                    width={64}
                    height={64}
                    className="h-16 w-16 object-contain"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center text-gray-600">?</div>
                )}
                <span className="font-pokemon text-[10px] text-gray-400">
                  {form.formName}
                </span>
                <div className="flex gap-0.5">
                  {(form.types ?? []).map((t) => (
                    <TypeBadge key={t} typeName={t} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Genus + Flavor Text */}
      <div className="border-t border-white/5 pt-3">
        <p className="font-mono text-xs italic text-gray-400">
          {pokemon.genus}
        </p>
        <p className="mt-1 text-xs italic text-gray-500">
          {pokemon.flavorText}
        </p>
      </div>

      {/* Height / Weight */}
      <div className="flex gap-4 font-mono text-xs text-gray-400">
        <span>Height: {heightM} m</span>
        <span>Weight: {weightKg} kg</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 border-t border-white/5 pt-4">
        <button
          onClick={onAskAI}
          className="flex-1 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-red-400 transition-all hover:border-red-500 hover:bg-red-500/20 hover:text-red-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
        >
          ASK DEXAI
        </button>
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm uppercase tracking-wider text-gray-400 transition-colors hover:border-white/20 hover:text-gray-200"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}
