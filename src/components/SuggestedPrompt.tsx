"use client";

interface SuggestedPromptProps {
  text: string;
  onClick: (text: string) => void;
}

export function SuggestedPrompt({ text, onClick }: SuggestedPromptProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(text)}
      className="rounded-full border border-red-500/30 px-4 py-2 font-mono text-sm text-gray-400 transition-all hover:border-red-500/60 hover:bg-red-500/10 hover:text-gray-200 hover:shadow-[0_0_12px_rgba(239,68,68,0.15)]"
    >
      {text}
    </button>
  );
}
