"use client";

import { useState, useEffect, useRef } from "react";
import type { Pokemon, EvolutionStage } from "@/types/pokemon";

interface PokemonDetailState {
  pokemon: Pokemon | null;
  evolutionChain: EvolutionStage | null;
  isLoading: boolean;
  error: string | null;
}

const cache = new Map<string, { pokemon: Pokemon; evolutionChain: EvolutionStage }>();

export function usePokemonDetail(pokemonName: string | null): PokemonDetailState {
  const [state, setState] = useState<PokemonDetailState>({
    pokemon: null,
    evolutionChain: null,
    isLoading: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (pokemonName === null) {
      setState({ pokemon: null, evolutionChain: null, isLoading: false, error: null });
      return;
    }

    const cached = cache.get(pokemonName);
    if (cached) {
      setState({
        pokemon: cached.pokemon,
        evolutionChain: cached.evolutionChain,
        isLoading: false,
        error: null,
      });
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetch(`/api/pokemon/${encodeURIComponent(pokemonName)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch Pokemon (${res.status})`);
        }
        return res.json();
      })
      .then((data: { pokemon: Pokemon; evolutionChain: EvolutionStage }) => {
        if (controller.signal.aborted) return;

        cache.set(pokemonName, data);
        setState({
          pokemon: data.pokemon,
          evolutionChain: data.evolutionChain,
          isLoading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState({
          pokemon: null,
          evolutionChain: null,
          isLoading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      });

    return () => {
      controller.abort();
    };
  }, [pokemonName]);

  return state;
}
