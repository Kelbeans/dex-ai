"use client";

import { motion } from "framer-motion";
import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? "border-l-2 border-cyan-500/60 bg-cyan-950/20 text-gray-200"
            : "font-mono text-sm text-gray-300"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.cards?.map((card, index) => {
          const cardData = card.data as Record<string, unknown>;
          const pokemonName = typeof cardData.name === "string" ? cardData.name : null;
          return (
            <div
              key={index}
              className="mt-2 rounded border border-cyan-700/40 bg-cyan-950/20 px-3 py-2"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/80">
                POKEMON DATA
              </p>
              <p className="mt-1 text-xs text-gray-300">
                <span className="text-cyan-300">{card.type}</span>
                {pokemonName && (
                  <span className="ml-2 text-gray-400">
                    &mdash; {pokemonName}
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
