"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

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
      className="relative flex gap-2 border-t border-red-900/30 px-4 py-3"
    >
      {/* Animated gradient separator at top */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.4), transparent)",
        }}
        animate={{ opacity: isFocused ? 1 : 0.3 }}
        transition={{ duration: 0.3 }}
      />

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        placeholder="Ask about any Pokemon..."
        className={`flex-1 rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 font-mono text-sm text-gray-200 placeholder-gray-600 outline-none transition-all duration-200 disabled:opacity-40 ${
          isFocused
            ? "border-red-500/50 ring-2 ring-red-500/70 shadow-[0_0_12px_rgba(220,38,38,0.15)]"
            : "focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
        }`}
      />
      <motion.button
        type="submit"
        disabled={disabled || !value.trim()}
        className="rounded-lg border border-red-700/50 bg-red-950/30 px-4 py-2 font-mono text-xs font-bold tracking-wider text-red-400 transition-colors hover:bg-red-900/40 disabled:opacity-40 disabled:hover:bg-red-950/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        SCAN
      </motion.button>
    </form>
  );
}
