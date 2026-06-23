"use client";

import { motion } from "framer-motion";
import type { Message } from "@/types/chat";
import { CardRenderer } from "./cards/CardRenderer";

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
        {message.cards?.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CardRenderer card={card} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
