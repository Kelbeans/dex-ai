"use client";

import { useState } from "react";
import type { Message } from "@/types/chat";
import { DeviceFrame } from "@/components/DeviceFrame";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";

function generateId(): string {
  return crypto.randomUUID();
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(content: string) {
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content:
          "I am DexAI. Pokemon data scanning is not yet connected.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  }

  return (
    <DeviceFrame>
      <ChatContainer messages={messages} isLoading={isLoading} />
      <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
    </DeviceFrame>
  );
}
