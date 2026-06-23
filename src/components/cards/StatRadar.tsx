import { TYPE_COLORS } from "./TypeBadge";

interface StatRadarProps {
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  primaryType: string;
}

const LABELS = ["HP", "Atk", "Def", "Spe", "SpD", "SpA"];
const MAX_STAT = 255;
const CENTER = 100;
const RADIUS = 75;

function getHexPoint(index: number, scale: number): [number, number] {
  const angle = (Math.PI / 2) + (index * (2 * Math.PI) / 6);
  const x = CENTER + Math.cos(angle) * RADIUS * scale;
  const y = CENTER - Math.sin(angle) * RADIUS * scale;
  return [x, y];
}

function hexagonPoints(scale: number): string {
  return Array.from({ length: 6 }, (_, i) => getHexPoint(i, scale).join(",")).join(" ");
}

export function StatRadar({ stats, primaryType }: StatRadarProps) {
  const color = TYPE_COLORS[primaryType.toLowerCase()] ?? "#68a090";
  const statValues = [stats.hp, stats.attack, stats.defense, stats.speed, stats.specialDefense, stats.specialAttack];

  const dataPoints = statValues.map((val, i) => {
    const scale = val / MAX_STAT;
    return getHexPoint(i, scale);
  });

  const dataPolygon = dataPoints.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <svg viewBox="0 0 200 200" className="mx-auto h-48 w-48">
      {/* Reference hexagons */}
      {[0.33, 0.66, 1].map((scale) => (
        <polygon
          key={scale}
          points={hexagonPoints(scale)}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
        />
      ))}

      {/* Axis lines */}
      {Array.from({ length: 6 }, (_, i) => {
        const [x, y] = getHexPoint(i, 1);
        return (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPolygon}
        fill={color}
        fillOpacity={0.4}
        stroke={color}
        strokeWidth="1.5"
      />

      {/* Labels and values */}
      {LABELS.map((label, i) => {
        const [lx, ly] = getHexPoint(i, 1.2);
        return (
          <text
            key={label}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-400 font-mono text-[8px]"
          >
            {label} {statValues[i]}
          </text>
        );
      })}
    </svg>
  );
}
