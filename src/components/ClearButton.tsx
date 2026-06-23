"use client";

import { motion } from "framer-motion";

interface ClearButtonProps {
  onClick: () => void;
}

export function ClearButton({ onClick }: ClearButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="rounded border border-gray-700 px-2 py-1 font-mono text-xs uppercase text-gray-500 transition-colors hover:border-red-500/50 hover:text-red-400"
    >
      CLR
    </motion.button>
  );
}
