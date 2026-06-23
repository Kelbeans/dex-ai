import { getGenRange, getSpriteUrl } from "@/lib/pokemon-list";
import type { PokemonListItem } from "@/lib/pokemon-list";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genParam = searchParams.get("gen");

  if (!genParam) {
    return Response.json(
      { error: "gen parameter is required" },
      { status: 400 }
    );
  }

  const gen = parseInt(genParam, 10);
  const range = getGenRange(gen);

  if (!range) {
    return Response.json(
      { error: `Invalid generation: ${gen}. Must be 1-9.` },
      { status: 400 }
    );
  }

  const limit = range.end - range.start + 1;
  const offset = range.start - 1;

  try {
    const res = await fetch(
      `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`
    );

    if (!res.ok) {
      throw new Error(`PokeAPI returned ${res.status}`);
    }

    const data = await res.json();

    const items: PokemonListItem[] = data.results.map(
      (entry: { name: string; url: string }, index: number) => {
        const id = range.start + index;
        return {
          id,
          name: entry.name,
          spriteUrl: getSpriteUrl(id),
        };
      }
    );

    return Response.json(items, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch Pokemon list";
    return Response.json({ error: message }, { status: 500 });
  }
}
