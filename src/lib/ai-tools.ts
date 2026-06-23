import type { Tool } from '@anthropic-ai/sdk/resources/messages';

export const AI_TOOLS: Tool[] = [
  {
    name: 'get_pokemon',
    description:
      'Get detailed information about a specific Pokemon by name or Pokedex number. Returns stats, types, abilities, sprites, height, weight, genus, and flavor text.',
    input_schema: {
      type: 'object',
      properties: {
        name_or_id: {
          type: 'string',
          description:
            'Pokemon name (e.g., "pikachu") or Pokedex number (e.g., "25")',
        },
      },
      required: ['name_or_id'],
    },
  },
  {
    name: 'get_evolution_chain',
    description:
      'Get the full evolution chain for a Pokemon. Shows all evolution stages, triggers (level up, item, trade), and minimum levels.',
    input_schema: {
      type: 'object',
      properties: {
        pokemon_name: {
          type: 'string',
          description:
            'Name of any Pokemon in the evolution chain (e.g., "charmander" will return the full charmander->charmeleon->charizard chain)',
        },
      },
      required: ['pokemon_name'],
    },
  },
  {
    name: 'get_type_effectiveness',
    description:
      'Get type effectiveness data for a specific type. Shows what types it is strong against, weak against, and immune to — both offensively and defensively.',
    input_schema: {
      type: 'object',
      properties: {
        type_name: {
          type: 'string',
          description: 'Pokemon type name (e.g., "fire", "water", "dragon")',
        },
      },
      required: ['type_name'],
    },
  },
  {
    name: 'search_pokemon',
    description:
      'Search for Pokemon by partial name match. Returns up to 5 matching Pokemon with full details. Use when the user describes a Pokemon vaguely or wants to find Pokemon by name pattern.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Search query — partial Pokemon name (e.g., "char" matches charmander, charmeleon, charizard)',
        },
      },
      required: ['query'],
    },
  },
];
