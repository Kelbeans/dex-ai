"use client";

import { useState, useCallback, useRef } from "react";
import type { Message, PokemonCard } from "@/types/chat";
import { parseSegments } from "@/lib/stream-parser";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("dexai-history");
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      try {
        abortRef.current = new AbortController();
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });

          // Parse segments from accumulated text
          const segments = parseSegments(fullText);
          const textContent = segments
            .filter((s) => s.type === "text")
            .map((s) => s.content)
            .join("");
          const cards = segments
            .filter((s) => s.type === "card")
            .map((s) => (s as { type: "card"; data: PokemonCard }).data);

          setMessages([
            ...updatedMessages,
            {
              ...assistantMessage,
              content: textContent,
              cards: cards.length > 0 ? cards : undefined,
            },
          ]);
        }

        // Final parse
        const segments = parseSegments(fullText);
        const textContent = segments
          .filter((s) => s.type === "text")
          .map((s) => s.content)
          .join("");
        const cards = segments
          .filter((s) => s.type === "card")
          .map((s) => (s as { type: "card"; data: PokemonCard }).data);

        const finalMessage: Message = {
          ...assistantMessage,
          content: textContent.trim(),
          cards: cards.length > 0 ? cards : undefined,
        };
        const finalMessages = [...updatedMessages, finalMessage];
        setMessages(finalMessages);
        localStorage.setItem("dexai-history", JSON.stringify(finalMessages));
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        const errorMessage: Message = {
          ...assistantMessage,
          content:
            "SYSTEM ERROR: Unable to process query. Please try again.",
        };
        setMessages([...updatedMessages, errorMessage]);
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem("dexai-history");
  }, []);

  return { messages, isLoading, sendMessage, clearHistory };
}
