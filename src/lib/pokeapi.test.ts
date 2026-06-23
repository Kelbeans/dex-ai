import { describe, it, expect } from 'vitest';
import { getPokemon, getPokemonForms, getEvolutionChain, getTypeEffectiveness } from './pokeapi';

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

  describe('getPokemonForms', () => {
    it('returns mega forms for charizard', async () => {
      const forms = await getPokemonForms('charizard');
      expect(forms.length).toBeGreaterThan(0);
      const megaX = forms.find(f => f.name.includes('mega-x'));
      expect(megaX).toBeDefined();
      expect(megaX!.formType).toBe('mega');
      expect(megaX!.types).toContain('fire');
    }, 30000);

    it('returns regional forms for meowth', async () => {
      const forms = await getPokemonForms('meowth');
      const alolan = forms.find(f => f.formType === 'alolan');
      expect(alolan).toBeDefined();
      expect(alolan!.types).toContain('dark');
    }, 30000);

    it('returns empty array for pokemon without forms', async () => {
      const forms = await getPokemonForms('pidgey');
      expect(forms).toEqual([]);
    }, 30000);

    it('returns gmax forms for pikachu', async () => {
      const forms = await getPokemonForms('pikachu');
      const gmax = forms.find(f => f.formType === 'gmax');
      expect(gmax).toBeDefined();
    }, 30000);
  });
});
