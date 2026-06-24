export interface PokemonCard {
  type: "pokemon" | "comparison" | "evolution" | "type-chart" | "forms";
  data: Record<string, unknown>;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  cards?: PokemonCard[];
  timestamp: number;
}
