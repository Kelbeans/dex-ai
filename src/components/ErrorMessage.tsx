"use client";

import { motion } from "framer-motion";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ x: -5 }}
      animate={{ x: [-5, 5, -5, 5, 0] }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="rounded-lg border border-red-500/50 bg-red-950/20 px-4 py-3 shadow-lg shadow-red-500/20"
    >
      <p className="font-mono text-xs font-bold tracking-widest text-red-400">
        SYSTEM ERROR
      </p>
      <p className="mt-1 text-sm text-gray-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded border border-red-500/40 bg-red-950/40 px-3 py-1 font-mono text-xs tracking-wider text-red-300 transition-colors hover:border-red-400 hover:bg-red-900/40 hover:text-red-200"
        >
          RETRY
        </button>
      )}
    </motion.div>
  );
}
