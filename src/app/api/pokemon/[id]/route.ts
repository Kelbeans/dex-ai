import { getPokemon, getEvolutionChain } from '@/lib/pokeapi';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const numericId = parseInt(id, 10);
  if (isNaN(numericId) || numericId < 1) {
    return Response.json(
      { error: 'Invalid Pokemon ID' },
      { status: 400 }
    );
  }

  try {
    const pokemon = await getPokemon(numericId);
    const evolutionChain = await getEvolutionChain(pokemon.name);

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
