"use client";

import { motion } from "framer-motion";
import { SuggestedPrompt } from "./SuggestedPrompt";

const SUGGESTED_PROMPTS = [
  "Tell me about Pikachu",
  "What's the strongest Dragon-type?",
  "Compare Charizard and Blastoise",
  "Show me Eevee's evolutions",
  "Which Pokemon has the highest Speed stat?",
  "What's super effective against Steel types?",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

interface WelcomeScreenProps {
  onPromptClick: (text: string) => void;
}

export function WelcomeScreen({ onPromptClick }: WelcomeScreenProps) {
  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col items-center gap-2">
        <motion.h1
          className="font-mono text-4xl font-bold tracking-wider text-red-500"
          variants={itemVariants}
        >
          DEX.AI
        </motion.h1>
        <motion.p
          className="animate-pulse font-mono text-sm text-gray-500"
          variants={itemVariants}
        >
          SYSTEM ONLINE
        </motion.p>
      </div>

      <motion.div className="flex flex-col items-center gap-4" variants={itemVariants}>
        <span className="font-mono text-xs uppercase tracking-widest text-gray-600">
          Suggested Queries:
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <motion.div key={prompt} variants={itemVariants}>
              <SuggestedPrompt text={prompt} onClick={onPromptClick} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
