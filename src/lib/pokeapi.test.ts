import { describe, it, expect } from 'vitest';
import { getPokemon, getEvolutionChain, getTypeEffectiveness } from './pokeapi';

describe('pokeapi', () => {
  describe('getPokemon', () => {
    it('returns structured data for pikachu', async () => {
      const pokemon = await getPokemon('pikachu');
      expect(pokemon.name).toBe('pikachu');
      expect(pokemon.id).toBe(25);
      expect(pokemon.types).toContain('electric');
      expect(pokemon.stats.hp).toBeGreaterThan(0);
      expect(pokemon.stats.attack).toBeGreaterThan(0);
      expect(pokemon.sprites.officialArtwork).toContain('http');
      expect(pokemon.abilities.length).toBeGreaterThan(0);
      expect(pokemon.genus).toBeTruthy();
      expect(pokemon.flavorText).toBeTruthy();
    }, 30000);

    it('works with numeric ID', async () => {
      const pokemon = await getPokemon(6);
      expect(pokemon.name).toBe('charizard');
      expect(pokemon.types).toContain('fire');
      expect(pokemon.types).toContain('flying');
    }, 30000);

    it('throws for non-existent pokemon', async () => {
      await expect(getPokemon('notarealpokemon')).rejects.toThrow(
        'Pokemon not found'
      );
    }, 30000);
  });

  describe('getEvolutionChain', () => {
    it('returns evolution chain for eevee', async () => {
      const chain = await getEvolutionChain('eevee');
      expect(chain.species).toBe('eevee');
      expect(chain.evolvesTo.length).toBeGreaterThan(1);
    }, 30000);

    it('returns chain for charmander', async () => {
      const chain = await getEvolutionChain('charmander');
      expect(chain.species).toBe('charmander');
      expect(chain.evolvesTo[0].species).toBe('charmeleon');
      expect(chain.evolvesTo[0].evolvesTo[0].species).toBe('charizard');
    }, 30000);
  });

  describe('getTypeEffectiveness', () => {
    it('returns type data for fire', async () => {
      const type = await getTypeEffectiveness('fire');
      expect(type.type).toBe('fire');
      expect(type.doubleDamageTo).toContain('grass');
      expect(type.halfDamageFrom).toContain('fire');
    }, 30000);
  });
});
