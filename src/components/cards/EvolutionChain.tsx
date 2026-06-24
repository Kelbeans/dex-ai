"use client";

import { motion } from "framer-motion";
import type { EvolutionStage } from "@/types/pokemon";

interface EvolutionChainProps {
  data: EvolutionStage;
}

interface FlatStage {
  species: string;
  spriteUrl: string;
  trigger?: string;
  minLevel?: number;
  item?: string;
}

function flattenLinear(stage: EvolutionStage): FlatStage[] {
  const result: FlatStage[] = [
    { species: stage.species, spriteUrl: stage.spriteUrl },
  ];

  let current = stage;
  while (current.evolvesTo.length === 1) {
    const next = current.evolvesTo[0];
    result.push({
      species: next.species,
      spriteUrl: next.spriteUrl,
      trigger: next.trigger,
      minLevel: next.minLevel,
      item: next.item,
    });
    current = next;
  }

  return result;
}

function isBranching(stage: EvolutionStage): boolean {
  let current = stage;
  while (current.evolvesTo.length > 0) {
    if (current.evolvesTo.length > 1) return true;
    current = current.evolvesTo[0];
  }
  return false;
}

function getItemSpriteUrl(itemName: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemName}.png`;
}

function getTriggerText(stage: FlatStage): string {
  if (stage.minLevel) return `Lv. ${stage.minLevel}`;
  if (stage.item) return stage.item;
  if (stage.trigger) return stage.trigger;
  return "";
}

function TriggerDisplay({ stage }: { stage: FlatStage }) {
  const text = getTriggerText(stage);
  if (!text) return null;

  return (
    <div className="flex flex-col items-center gap-0.5">
      {stage.item && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getItemSpriteUrl(stage.item)}
          alt={stage.item}
          width={24}
          height={24}
          className="h-6 w-6 object-contain"
        />
      )}
      <span className="font-mono text-[9px] text-gray-600">
        {text}
      </span>
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function EvolutionChain({ data }: EvolutionChainProps) {
  const branching = isBranching(data);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
    >
      <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-gray-500">
        Evolution Chain
      </p>

      {!branching ? (
        <LinearChain stages={flattenLinear(data)} />
      ) : (
        <BranchingChain root={data} />
      )}
    </motion.div>
  );
}

function LinearChain({ stages }: { stages: FlatStage[] }) {
  if (stages.length === 1) {
    return (
      <p className="text-center font-mono text-xs text-gray-500">
        This Pokemon does not evolve.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {stages.map((stage, i) => (
        <div key={stage.species} className="flex items-center gap-1">
          {i > 0 && (
            <div className="flex flex-col items-center px-2">
              <span className="font-mono text-sm text-gray-500">&rarr;</span>
              <TriggerDisplay stage={stage} />
            </div>
          )}
          <StageDisplay species={stage.species} spriteUrl={stage.spriteUrl} />
        </div>
      ))}
    </div>
  );
}

function BranchingChain({ root }: { root: EvolutionStage }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <StageDisplay species={root.species} spriteUrl={root.spriteUrl} />
      {root.evolvesTo.length > 0 && (
        <>
          <span className="font-mono text-sm text-gray-500">&darr;</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {root.evolvesTo.map((branch) => (
              <div key={branch.species} className="flex flex-col items-center gap-1">
                <TriggerDisplay stage={{
                  species: branch.species,
                  spriteUrl: branch.spriteUrl,
                  trigger: branch.trigger,
                  minLevel: branch.minLevel,
                  item: branch.item,
                }} />
                <StageDisplay species={branch.species} spriteUrl={branch.spriteUrl} />
                {branch.evolvesTo.length > 0 && (
                  <div className="flex flex-col items-center gap-1">
                    {branch.evolvesTo.map((sub) => (
                      <div key={sub.species} className="flex flex-col items-center">
                        <span className="font-mono text-sm text-gray-500">&darr;</span>
                        <TriggerDisplay stage={{
                          species: sub.species,
                          spriteUrl: sub.spriteUrl,
                          trigger: sub.trigger,
                          minLevel: sub.minLevel,
                          item: sub.item,
                        }} />
                        <StageDisplay species={sub.species} spriteUrl={sub.spriteUrl} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StageDisplay({ species, spriteUrl }: { species: string; spriteUrl: string }) {
  return (
    <div className="flex flex-col items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={spriteUrl}
        alt={species}
        width={48}
        height={48}
        className="h-12 w-12 object-contain"
      />
      <span className="font-mono text-[10px] text-gray-300">
        {capitalize(species)}
      </span>
    </div>
  );
}
