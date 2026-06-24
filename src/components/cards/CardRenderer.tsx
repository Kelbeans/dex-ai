"use client";

import type { PokemonCard as PokemonCardType } from "@/types/chat";
import type { Pokemon, EvolutionStage, TypeEffectiveness, PokemonForm } from "@/types/pokemon";
import { PokemonCard } from "./PokemonCard";
import { EvolutionChain } from "./EvolutionChain";
import { ComparisonCard } from "./ComparisonCard";
import { TypeChart } from "./TypeChart";
import { FormsCard } from "./FormsCard";

interface CardRendererProps {
  card: PokemonCardType;
}

export function CardRenderer({ card }: CardRendererProps) {
  switch (card.type) {
    case "pokemon":
      return <PokemonCard data={card.data as unknown as Pokemon} />;
    case "evolution":
      return <EvolutionChain data={card.data as unknown as EvolutionStage} />;
    case "comparison":
      return (
        <ComparisonCard
          data={card.data as unknown as { pokemon1: Pokemon; pokemon2: Pokemon }}
        />
      );
    case "type-chart":
      return <TypeChart data={card.data as unknown as TypeEffectiveness} />;
    case "forms":
      return <FormsCard data={card.data as unknown as { baseName: string; forms: PokemonForm[] }} />;
    default:
      return null;
  }
}
