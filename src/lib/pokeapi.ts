import type { Pokemon, PokemonForm, EvolutionStage, TypeEffectiveness } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

function cleanFlavorText(text: string): string {
  return text
    .replace(/\f/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, '').split('/');
  return parseInt(parts[parts.length - 1], 10);
}

export async function getPokemon(nameOrId: string | number): Promise<Pokemon> {
  const identifier = String(nameOrId).toLowerCase();

  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(`${BASE_URL}/pokemon/${identifier}`),
    fetch(`${BASE_URL}/pokemon-species/${identifier}`),
  ]);

  if (!pokemonRes.ok) {
    throw new Error(`Pokemon not found: ${nameOrId}`);
  }
  if (!speciesRes.ok) {
    throw new Error(`Pokemon species not found: ${nameOrId}`);
  }

  const pokemonData = await pokemonRes.json();
  const speciesData = await speciesRes.json();

  const types = pokemonData.types.map(
    (t: { type: { name: string } }) => t.type.name
  );

  const statsMap: Record<string, string> = {
    hp: 'hp',
    attack: 'attack',
    defense: 'defense',
    'special-attack': 'specialAttack',
    'special-defense': 'specialDefense',
    speed: 'speed',
  };

  const stats = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  };

  for (const s of pokemonData.stats) {
    const key = statsMap[s.stat.name as string];
    if (key) {
      (stats as Record<string, number>)[key] = s.base_stat;
    }
  }

  const abilities = pokemonData.abilities.map(
    (a: { ability: { name: string }; is_hidden: boolean }) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    })
  );

  const sprites = {
    front: pokemonData.sprites.front_default || '',
    frontShiny: pokemonData.sprites.front_shiny || '',
    officialArtwork:
      pokemonData.sprites.other?.['official-artwork']?.front_default || '',
  };

  const genusEntry = speciesData.genera?.find(
    (g: { language: { name: string } }) => g.language.name === 'en'
  );
  const genus = genusEntry?.genus || '';

  const flavorEntry = speciesData.flavor_text_entries?.find(
    (e: { language: { name: string } }) => e.language.name === 'en'
  );
  const flavorText = flavorEntry ? cleanFlavorText(flavorEntry.flavor_text) : '';

  // Fetch forms but don't let failure break the main response
  let forms: PokemonForm[] | undefined;
  try {
    const fetchedForms = await getPokemonForms(identifier);
    if (fetchedForms.length > 0) {
      forms = fetchedForms;
    }
  } catch {
    // Forms are optional — silently ignore failures
  }

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    types,
    stats,
    abilities,
    sprites,
    height: pokemonData.height,
    weight: pokemonData.weight,
    genus,
    flavorText,
    forms,
  };
}

function classifyFormType(name: string): PokemonForm['formType'] {
  if (name.includes('mega')) return 'mega';
  if (name.includes('gmax')) return 'gmax';
  if (name.includes('alola')) return 'alolan';
  if (name.includes('galar')) return 'galarian';
  if (name.includes('hisui')) return 'hisuian';
  if (name.includes('paldea')) return 'paldean';
  return 'other';
}

function generateFormName(pokemonName: string, baseName: string): string {
  const suffix = pokemonName.replace(`${baseName}-`, '');
  const formType = classifyFormType(suffix);

  switch (formType) {
    case 'mega': {
      const extra = suffix.replace('mega', '').replace(/-/g, ' ').trim();
      return extra ? `Mega ${extra.charAt(0).toUpperCase() + extra.slice(1)}` : 'Mega';
    }
    case 'gmax':
      return 'Gigantamax';
    case 'alolan':
      return 'Alolan';
    case 'galarian':
      return 'Galarian';
    case 'hisuian':
      return 'Hisuian';
    case 'paldean':
      return 'Paldean';
    default: {
      return suffix
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
  }
}

export async function getPokemonForms(nameOrId: string | number): Promise<PokemonForm[]> {
  const identifier = String(nameOrId).toLowerCase();

  const speciesRes = await fetch(`${BASE_URL}/pokemon-species/${identifier}`);
  if (!speciesRes.ok) {
    if (speciesRes.status === 404) return [];
    throw new Error(`Pokemon species not found: ${nameOrId}`);
  }

  const speciesData = await speciesRes.json();
  const varieties: { is_default: boolean; pokemon: { name: string; url: string } }[] =
    speciesData.varieties || [];

  // Filter out the default variety
  const alternateVarieties = varieties.filter((v) => !v.is_default);

  if (alternateVarieties.length === 0) return [];

  const baseName = speciesData.name as string;

  const formsRaw = await Promise.all(
    alternateVarieties.map(async (variety): Promise<PokemonForm | null> => {
      const pokemonRes = await fetch(variety.pokemon.url);
      if (!pokemonRes.ok) {
        return null;
      }
      const pokemonData = await pokemonRes.json();

      const types = pokemonData.types.map(
        (t: { type: { name: string } }) => t.type.name
      );

      const spriteUrl =
        pokemonData.sprites?.other?.['official-artwork']?.front_default ||
        pokemonData.sprites?.front_default ||
        '';

      const statsMap: Record<string, string> = {
        hp: 'hp',
        attack: 'attack',
        defense: 'defense',
        'special-attack': 'specialAttack',
        'special-defense': 'specialDefense',
        speed: 'speed',
      };

      const stats = {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
      };

      for (const s of pokemonData.stats) {
        const key = statsMap[s.stat.name as string];
        if (key) {
          (stats as Record<string, number>)[key] = s.base_stat;
        }
      }

      const formName = generateFormName(variety.pokemon.name, baseName);
      const formType = classifyFormType(variety.pokemon.name);

      return {
        id: pokemonData.id,
        name: variety.pokemon.name,
        formName,
        formType,
        types,
        spriteUrl,
        stats,
      } as PokemonForm;
    })
  );

  return formsRaw.filter((f): f is PokemonForm => f !== null);
}

export async function getEvolutionChain(
  pokemonName: string
): Promise<EvolutionStage> {
  const speciesRes = await fetch(
    `${BASE_URL}/pokemon-species/${pokemonName.toLowerCase()}`
  );
  if (!speciesRes.ok) {
    throw new Error(`Pokemon species not found: ${pokemonName}`);
  }

  const speciesData = await speciesRes.json();
  const evolutionUrl = speciesData.evolution_chain.url;

  const evolutionRes = await fetch(evolutionUrl);
  if (!evolutionRes.ok) {
    throw new Error(`Evolution chain not found for: ${pokemonName}`);
  }

  const evolutionData = await evolutionRes.json();

  function parseChain(chain: {
    species: { name: string; url: string };
    evolves_to: Array<{
      species: { name: string; url: string };
      evolution_details: Array<{
        trigger?: { name: string };
        min_level?: number | null;
        item?: { name: string } | null;
      }>;
      evolves_to: unknown[];
    }>;
  }): EvolutionStage {
    const speciesId = extractIdFromUrl(chain.species.url);
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`;

    const evolvesTo = chain.evolves_to.map((evo) => {
      const stage = parseChain(
        evo as unknown as Parameters<typeof parseChain>[0]
      );
      const details = evo.evolution_details[0];
      if (details) {
        if (details.trigger) {
          stage.trigger = details.trigger.name;
        }
        if (details.min_level) {
          stage.minLevel = details.min_level;
        }
        if (details.item) {
          stage.item = details.item.name;
        }
      }
      return stage;
    });

    return {
      species: chain.species.name,
      spriteUrl,
      evolvesTo,
    };
  }

  return parseChain(evolutionData.chain);
}

export async function getTypeEffectiveness(
  typeName: string
): Promise<TypeEffectiveness> {
  const res = await fetch(`${BASE_URL}/type/${typeName.toLowerCase()}`);
  if (!res.ok) {
    throw new Error(`Type not found: ${typeName}`);
  }

  const data = await res.json();
  const relations = data.damage_relations;

  return {
    type: data.name,
    doubleDamageTo: relations.double_damage_to.map(
      (t: { name: string }) => t.name
    ),
    halfDamageTo: relations.half_damage_to.map(
      (t: { name: string }) => t.name
    ),
    noDamageTo: relations.no_damage_to.map((t: { name: string }) => t.name),
    doubleDamageFrom: relations.double_damage_from.map(
      (t: { name: string }) => t.name
    ),
    halfDamageFrom: relations.half_damage_from.map(
      (t: { name: string }) => t.name
    ),
    noDamageFrom: relations.no_damage_from.map(
      (t: { name: string }) => t.name
    ),
  };
}

let pokemonListCache: { name: string; url: string }[] | null = null;

export async function searchPokemon(query: string): Promise<Pokemon[]> {
  if (!pokemonListCache) {
    const res = await fetch(`${BASE_URL}/pokemon?limit=1025`);
    if (!res.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    const data = await res.json();
    pokemonListCache = data.results;
  }

  const lowerQuery = query.toLowerCase();
  const matches = pokemonListCache!
    .filter((p) => p.name.includes(lowerQuery))
    .slice(0, 5);

  const results = await Promise.all(
    matches.map((m) => getPokemon(m.name))
  );

  return results;
}
