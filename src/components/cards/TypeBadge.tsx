const TYPE_COLORS: Record<string, string> = {
  normal: "#a8a878",
  fire: "#f08030",
  water: "#6890f0",
  electric: "#f8d030",
  grass: "#78c850",
  ice: "#98d8d8",
  fighting: "#c03028",
  poison: "#a040a0",
  ground: "#e0c068",
  flying: "#a890f0",
  psychic: "#f85888",
  bug: "#a8b820",
  rock: "#b8a038",
  ghost: "#705898",
  dragon: "#7038f8",
  dark: "#705848",
  steel: "#b8b8d0",
  fairy: "#ee99ac",
};

interface TypeBadgeProps {
  typeName: string;
}

export function TypeBadge({ typeName }: TypeBadgeProps) {
  const color = TYPE_COLORS[typeName.toLowerCase()] ?? "#68a090";

  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 font-mono text-xs font-bold uppercase text-white"
      style={{ backgroundColor: color }}
    >
      {typeName.toUpperCase()}
    </span>
  );
}

export { TYPE_COLORS };
