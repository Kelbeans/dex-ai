import type { PokemonCategory } from "@/components/browse/CategoryTabs";

export interface CategoryPokemon {
  id: number;
  name: string;
  spriteId: number;
}

export const MEGA_FORMS: CategoryPokemon[] = [
  { id: 3, name: "venusaur-mega", spriteId: 10033 },
  { id: 6, name: "charizard-mega-x", spriteId: 10034 },
  { id: 6, name: "charizard-mega-y", spriteId: 10035 },
  { id: 9, name: "blastoise-mega", spriteId: 10036 },
  { id: 65, name: "alakazam-mega", spriteId: 10037 },
  { id: 94, name: "gengar-mega", spriteId: 10038 },
  { id: 115, name: "kangaskhan-mega", spriteId: 10039 },
  { id: 127, name: "pinsir-mega", spriteId: 10040 },
  { id: 130, name: "gyarados-mega", spriteId: 10041 },
  { id: 142, name: "aerodactyl-mega", spriteId: 10042 },
  { id: 150, name: "mewtwo-mega-x", spriteId: 10043 },
  { id: 150, name: "mewtwo-mega-y", spriteId: 10044 },
  { id: 181, name: "ampharos-mega", spriteId: 10045 },
  { id: 212, name: "scizor-mega", spriteId: 10046 },
  { id: 214, name: "heracross-mega", spriteId: 10047 },
  { id: 229, name: "houndoom-mega", spriteId: 10048 },
  { id: 248, name: "tyranitar-mega", spriteId: 10049 },
  { id: 257, name: "blaziken-mega", spriteId: 10050 },
  { id: 282, name: "gardevoir-mega", spriteId: 10051 },
  { id: 303, name: "mawile-mega", spriteId: 10052 },
  { id: 306, name: "aggron-mega", spriteId: 10053 },
  { id: 308, name: "medicham-mega", spriteId: 10054 },
  { id: 310, name: "manectric-mega", spriteId: 10055 },
  { id: 354, name: "banette-mega", spriteId: 10056 },
  { id: 359, name: "absol-mega", spriteId: 10057 },
  { id: 373, name: "salamence-mega", spriteId: 10089 },
  { id: 376, name: "metagross-mega", spriteId: 10076 },
  { id: 380, name: "latias-mega", spriteId: 10062 },
  { id: 381, name: "latios-mega", spriteId: 10063 },
  { id: 384, name: "rayquaza-mega", spriteId: 10079 },
  { id: 428, name: "lopunny-mega", spriteId: 10088 },
  { id: 445, name: "garchomp-mega", spriteId: 10058 },
  { id: 448, name: "lucario-mega", spriteId: 10059 },
  { id: 460, name: "abomasnow-mega", spriteId: 10060 },
];

export const GMAX_FORMS: CategoryPokemon[] = [
  { id: 6, name: "charizard-gmax", spriteId: 10196 },
  { id: 12, name: "butterfree-gmax", spriteId: 10198 },
  { id: 25, name: "pikachu-gmax", spriteId: 10199 },
  { id: 52, name: "meowth-gmax", spriteId: 10200 },
  { id: 68, name: "machamp-gmax", spriteId: 10201 },
  { id: 94, name: "gengar-gmax", spriteId: 10202 },
  { id: 99, name: "kingler-gmax", spriteId: 10203 },
  { id: 131, name: "lapras-gmax", spriteId: 10204 },
  { id: 133, name: "eevee-gmax", spriteId: 10205 },
  { id: 143, name: "snorlax-gmax", spriteId: 10206 },
  { id: 569, name: "garbodor-gmax", spriteId: 10207 },
  { id: 809, name: "melmetal-gmax", spriteId: 10208 },
  { id: 812, name: "rillaboom-gmax", spriteId: 10209 },
  { id: 815, name: "cinderace-gmax", spriteId: 10210 },
  { id: 818, name: "inteleon-gmax", spriteId: 10211 },
  { id: 839, name: "coalossal-gmax", spriteId: 10215 },
  { id: 841, name: "flapple-gmax", spriteId: 10216 },
  { id: 842, name: "appletun-gmax", spriteId: 10217 },
  { id: 849, name: "toxtricity-low-key-gmax", spriteId: 10228 },
  { id: 858, name: "hatterene-gmax", spriteId: 10221 },
  { id: 861, name: "grimmsnarl-gmax", spriteId: 10222 },
  { id: 869, name: "alcremie-gmax", spriteId: 10223 },
  { id: 879, name: "copperajah-gmax", spriteId: 10224 },
  { id: 884, name: "duraludon-gmax", spriteId: 10225 },
  { id: 892, name: "urshifu-rapid-strike-gmax", spriteId: 10227 },
];

export const PARADOX_IDS = new Set([
  984, 985, 986, 987, 988, 989, // Scarlet: Great Tusk, Scream Tail, Brute Bonnet, Flutter Mane, Slither Wing, Sandy Shocks
  990, 991, 992, 993, 994, 995, // Violet: Iron Treads, Iron Bundle, Iron Hands, Iron Jugulis, Iron Moth, Iron Thorns
  1005, 1006, // Roaring Moon, Iron Valiant
  1007, 1008, // Koraidon, Miraidon
  1009, 1010, // Walking Wake, Iron Leaves
  1020, 1021, 1022, 1023, // Gouging Fire, Raging Bolt, Iron Boulder, Iron Crown
]);

export const LEGENDARY_IDS = new Set([
  144, 145, 146, 150, // Gen 1: Articuno, Zapdos, Moltres, Mewtwo
  243, 244, 245, 249, 250, // Gen 2: Raikou, Entei, Suicune, Lugia, Ho-Oh
  377, 378, 379, 380, 381, 382, 383, 384, // Gen 3: Regis, Lati@s, Weather trio
  480, 481, 482, 483, 484, 485, 486, 487, 488, // Gen 4: Lake trio, Creation trio, Heatran, Regigigas, Giratina, Cresselia
  638, 639, 640, 641, 642, 643, 644, 645, 646, // Gen 5: Swords, Forces, Tao trio
  716, 717, 718, // Gen 6: Xerneas, Yveltal, Zygarde
  772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, // Gen 7: Type:Null, Silvally, Tapus, Cosmog line, Necrozma
  888, 889, 890, 891, 892, 895, 896, 897, 898, // Gen 8: Zacian, Zamazenta, Eternatus, Kubfu, Urshifu, Regieleki, Glastrier, Spectrier, Calyrex
  905, 1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017, 1024, 1025, // Gen 9
]);

export const MYTHICAL_IDS = new Set([
  151, // Mew
  251, // Celebi
  385, 386, // Jirachi, Deoxys
  489, 490, 491, 492, 493, // Phione, Manaphy, Darkrai, Shaymin, Arceus
  494, 647, 648, 649, // Victini, Keldeo, Meloetta, Genesect
  719, 720, 721, // Diancie, Hoopa, Volcanion
  801, 802, 807, 808, 809, // Magearna, Marshadow, Zeraora, Meltan, Melmetal
  893, // Zarude
  1025, // Pecharunt
]);

export const STARTER_IDS = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, // Gen 1
  152, 153, 154, 155, 156, 157, 158, 159, 160, // Gen 2
  252, 253, 254, 255, 256, 257, 258, 259, 260, // Gen 3
  387, 388, 389, 390, 391, 392, 393, 394, 395, // Gen 4
  495, 496, 497, 498, 499, 500, 501, 502, 503, // Gen 5
  650, 651, 652, 653, 654, 655, 656, 657, 658, // Gen 6
  722, 723, 724, 725, 726, 727, 728, 729, 730, // Gen 7
  810, 811, 812, 813, 814, 815, 816, 817, 818, // Gen 8
  906, 907, 908, 909, 910, 911, 912, 913, 914, // Gen 9
]);

export const FOSSIL_IDS = new Set([
  138, 139, 140, 141, 142, // Gen 1: Omanyte, Omastar, Kabuto, Kabutops, Aerodactyl
  345, 346, 347, 348, // Gen 3: Lileep, Cradily, Anorith, Armaldo
  408, 409, 410, 411, // Gen 4: Cranidos, Rampardos, Shieldon, Bastiodon
  564, 565, 566, 567, // Gen 5: Tirtouga, Carracosta, Archen, Archeops
  696, 697, 698, 699, // Gen 6: Tyrunt, Tyrantrum, Amaura, Aurorus
  880, 881, 882, 883, // Gen 8: Dracozolt, Arctozolt, Dracovish, Arctovish
]);

export const MEGA_IDS = new Set([
  3, 6, 9, 15, 18, 65, 80, 94, 115, 127, 130, 142, 150, 181, 208, 212,
  214, 229, 248, 254, 257, 260, 282, 302, 303, 306, 308, 310, 319, 323,
  334, 354, 359, 362, 373, 376, 380, 381, 384, 428, 445, 448, 460, 475,
  531, 719, 382, 383,
]);

export const GMAX_IDS = new Set([
  3, 6, 9, 12, 25, 52, 68, 94, 99, 131, 133, 143, 569, 809, 812, 815,
  818, 823, 826, 834, 839, 841, 842, 844, 849, 851, 858, 861, 869, 879,
  884, 890, 892,
]);

export interface FilteredPokemon {
  id: number;
  name: string;
  spriteUrl: string;
}

export function filterByCategory(ids: { id: number; name: string }[], category: PokemonCategory): FilteredPokemon[] {
  const artworkUrl = (spriteId: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${spriteId}.png`;

  if (category === "mega") {
    return MEGA_FORMS.map((f) => ({
      id: f.id,
      name: f.name,
      spriteUrl: artworkUrl(f.spriteId),
    }));
  }

  if (category === "gmax") {
    return GMAX_FORMS.map((f) => ({
      id: f.id,
      name: f.name,
      spriteUrl: artworkUrl(f.spriteId),
    }));
  }

  if (category === "all") {
    return ids.map((p) => ({
      id: p.id,
      name: p.name,
      spriteUrl: artworkUrl(p.id),
    }));
  }

  const categoryMap: Record<string, Set<number>> = {
    legendary: LEGENDARY_IDS,
    mythical: MYTHICAL_IDS,
    starter: STARTER_IDS,
    fossil: FOSSIL_IDS,
    paradox: PARADOX_IDS,
  };

  const set = categoryMap[category];
  if (!set) {
    return ids.map((p) => ({
      id: p.id,
      name: p.name,
      spriteUrl: artworkUrl(p.id),
    }));
  }

  return ids
    .filter((p) => set.has(p.id))
    .map((p) => ({
      id: p.id,
      name: p.name,
      spriteUrl: artworkUrl(p.id),
    }));
}
