"use client";

import { useState } from "react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t border-red-900/30 px-4 py-3"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder="Ask about any Pokemon..."
        className="flex-1 rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 font-mono text-sm text-gray-200 placeholder-gray-600 outline-none transition-shadow focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 disabled:opacity-40"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="rounded-lg border border-red-700/50 bg-red-950/30 px-4 py-2 font-mono text-xs font-bold tracking-wider text-red-400 transition-colors hover:bg-red-900/40 disabled:opacity-40 disabled:hover:bg-red-950/30"
      >
        SCAN
      </button>
    </form>
  );
}
