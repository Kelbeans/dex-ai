export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  abilities: { name: string; isHidden: boolean }[];
  sprites: {
    front: string;
    frontShiny: string;
    officialArtwork: string;
  };
  height: number;
  weight: number;
  genus: string;
  flavorText: string;
}

export interface EvolutionStage {
  species: string;
  spriteUrl: string;
  evolvesTo: EvolutionStage[];
  trigger?: string;
  minLevel?: number;
  item?: string;
}

export interface TypeEffectiveness {
  type: string;
  doubleDamageTo: string[];
  halfDamageTo: string[];
  noDamageTo: string[];
  doubleDamageFrom: string[];
  halfDamageFrom: string[];
  noDamageFrom: string[];
}
