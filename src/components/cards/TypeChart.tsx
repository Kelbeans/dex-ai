"use client";

import { motion } from "framer-motion";
import type { TypeEffectiveness } from "@/types/pokemon";
import { TypeBadge } from "./TypeBadge";

interface TypeChartProps {
  data: TypeEffectiveness;
}

interface Section {
  label: string;
  types: string[];
}

export function TypeChart({ data }: TypeChartProps) {
  const offensiveSections: Section[] = [
    { label: "Super effective against", types: data.doubleDamageTo },
    { label: "Not very effective against", types: data.halfDamageTo },
    { label: "No effect on", types: data.noDamageTo },
  ];

  const defensiveSections: Section[] = [
    { label: "Weak to", types: data.doubleDamageFrom },
    { label: "Resists", types: data.halfDamageFrom },
    { label: "Immune to", types: data.noDamageFrom },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
          Type Chart
        </p>
        <TypeBadge typeName={data.type} />
      </div>

      {/* Offensive */}
      <div className="mb-3">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-red-400/70">
          Offensive
        </p>
        {offensiveSections.map((section) =>
          section.types.length > 0 ? (
            <TypeSection key={section.label} label={section.label} types={section.types} />
          ) : null,
        )}
      </div>

      {/* Defensive */}
      <div>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-cyan-400/70">
          Defensive
        </p>
        {defensiveSections.map((section) =>
          section.types.length > 0 ? (
            <TypeSection key={section.label} label={section.label} types={section.types} />
          ) : null,
        )}
      </div>
    </motion.div>
  );
}

function TypeSection({ label, types }: { label: string; types: string[] }) {
  return (
    <div className="mb-2">
      <p className="mb-1 font-mono text-[10px] text-gray-400">{label}</p>
      <div className="flex flex-wrap gap-1">
        {types.map((t) => (
          <TypeBadge key={t} typeName={t} />
        ))}
      </div>
    </div>
  );
}
