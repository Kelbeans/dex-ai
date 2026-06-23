"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Message } from "@/types/chat";
import { CardRenderer } from "./cards/CardRenderer";
import { useTypeGlow } from "./TypeGlow";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const { setActiveType } = useTypeGlow();

  // When a card with a pokemon type is rendered, update the glow
  useEffect(() => {
    if (message.cards && message.cards.length > 0) {
      const lastCard = message.cards[message.cards.length - 1];
      if (lastCard.type === "pokemon" && lastCard.data) {
        const types = lastCard.data.types as string[] | undefined;
        if (types && types.length > 0) {
          setActiveType(types[0]);
        }
      }
    }
  }, [message.cards, setActiveType]);

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
        {message.cards?.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: 0.2 + index * 0.1,
            }}
          >
            <CardRenderer card={card} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
