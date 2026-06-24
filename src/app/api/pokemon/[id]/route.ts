import { getPokemon, getEvolutionChain } from '@/lib/pokeapi';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id.trim() === '') {
    return Response.json(
      { error: 'Invalid Pokemon identifier' },
      { status: 400 }
    );
  }

  const nameOrId = /^\d+$/.test(id) ? parseInt(id, 10) : id.toLowerCase();

  try {
    const pokemon = await getPokemon(nameOrId);

    let evolutionChain = null;
    try {
      const baseName = pokemon.name.split('-')[0];
      evolutionChain = await getEvolutionChain(baseName);
    } catch {
      // Some forms don't have evolution chains — that's fine
    }

    return Response.json(
      { pokemon, evolutionChain },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch Pokemon';
    const status = message.includes('not found') ? 404 : 500;

    return Response.json({ error: message }, { status });
  }
}
