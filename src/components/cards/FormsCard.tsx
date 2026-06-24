"use client";

import { motion } from "framer-motion";
import type { PokemonForm } from "@/types/pokemon";
import { TypeBadge } from "./TypeBadge";

interface FormsCardProps {
  data: {
    baseName: string;
    forms: PokemonForm[];
  };
}

function FormTypeBadge({ formType }: { formType: string }) {
  const colors: Record<string, string> = {
    mega: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    gmax: "bg-red-500/20 text-red-300 border-red-500/40",
    alolan: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    galarian: "bg-pink-500/20 text-pink-300 border-pink-500/40",
    hisuian: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    paldean: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    other: "bg-gray-500/20 text-gray-300 border-gray-500/40",
  };

  const className = colors[formType] || colors.other;

  return (
    <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${className}`}>
      {formType}
    </span>
  );
}

export function FormsCard({ data }: FormsCardProps) {
  if (!data || !data.forms || data.forms.length === 0) {
    return (
      <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="font-mono text-xs text-gray-500">No alternate forms found.</p>
      </div>
    );
  }

  const baseName = data.baseName || "Pokemon";
  const displayBase = baseName.charAt(0).toUpperCase() + baseName.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
    >
      <p className="mb-3 font-mono text-xs uppercase tracking-wider text-gray-500">
        {displayBase} — Alternate Forms
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {data.forms.map((form) => (
          <div
            key={form.name}
            className="flex flex-col items-center gap-2 rounded-lg bg-black/30 p-3 border border-white/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {form.spriteUrl ? (
              <img
                src={form.spriteUrl}
                alt={form.formName}
                width={80}
                height={80}
                className="h-[80px] w-[80px] object-contain"
              />
            ) : (
              <div className="flex h-[80px] w-[80px] items-center justify-center text-gray-600">
                ?
              </div>
            )}

            <p className="font-pokemon text-sm text-gray-200">
              {form.formName}
            </p>

            <FormTypeBadge formType={form.formType} />

            <div className="flex flex-wrap justify-center gap-1">
              {(form.types ?? []).map((t) => (
                <TypeBadge key={t} typeName={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
