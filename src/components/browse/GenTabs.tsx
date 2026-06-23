"use client";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

interface GenTabsProps {
  activeGen: number;
  onGenChange: (gen: number) => void;
}

export function GenTabs({ activeGen, onGenChange }: GenTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto px-2 py-2 scrollbar-hide">
      {ROMAN_NUMERALS.map((numeral, index) => {
        const gen = index + 1;
        const isActive = gen === activeGen;
        return (
          <button
            key={gen}
            onClick={() => onGenChange(gen)}
            className={`shrink-0 rounded px-2.5 py-1 font-mono text-xs font-bold transition-colors ${
              isActive
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {numeral}
          </button>
        );
      })}
    </div>
  );
}
