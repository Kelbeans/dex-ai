import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePokemonDetail } from "../usePokemonDetail";

describe("usePokemonDetail", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns idle state when pokemonId is null", () => {
    const { result } = renderHook(() => usePokemonDetail(null));

    expect(result.current.pokemon).toBeNull();
    expect(result.current.evolutionChain).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets isLoading to true when pokemonId is provided", () => {
    // Mock fetch to never resolve so we can check loading state
    vi.spyOn(globalThis, "fetch").mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => usePokemonDetail(25));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.pokemon).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("fetches and returns pokemon data on success", async () => {
    const mockData = {
      pokemon: {
        id: 25,
        name: "pikachu",
        types: ["electric"],
        stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
        abilities: [{ name: "static", isHidden: false }],
        sprites: { front: "", frontShiny: "", officialArtwork: "" },
        height: 4,
        weight: 60,
        genus: "Mouse Pokemon",
        flavorText: "When it is angered, it immediately discharges the energy stored in the pouches in its cheeks.",
      },
      evolutionChain: {
        species: "pichu",
        spriteUrl: "https://example.com/pichu.png",
        evolvesTo: [],
      },
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    const { result } = renderHook(() => usePokemonDetail(25));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toEqual(mockData.pokemon);
    expect(result.current.evolutionChain).toEqual(mockData.evolutionChain);
    expect(result.current.error).toBeNull();
  });

  it("sets error state on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: "Not found" }),
    } as unknown as Response);

    const { result } = renderHook(() => usePokemonDetail(999));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toBeNull();
    expect(result.current.error).toBe("Failed to fetch Pokemon (404)");
  });
});
