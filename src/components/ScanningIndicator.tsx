"use client";

import { motion } from "framer-motion";

export function ScanningIndicator() {
  return (
    <div className="flex items-start px-4 py-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 font-mono text-sm text-red-500">
          <span>SCANNING</span>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              .
            </motion.span>
          ))}
        </div>
        <motion.div
          className="h-px w-32 bg-red-500/50"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Horizontal sweep line */}
        <div className="relative mt-1 h-px w-48 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ width: "3rem" }}
          />
        </div>
      </div>
    </div>
  );
}
