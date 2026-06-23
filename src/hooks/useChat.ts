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
      // Empty input guard
      if (!content.trim()) return;

      // Prevent rapid re-submits
      if (isLoading) return;

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

        // Truncate message history: only send last 20 messages to avoid token limits
        const messagesToSend = updatedMessages.slice(-20).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: messagesToSend }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          // Read JSON error body from the API
          let errorText = `API error: ${response.status}`;
          try {
            const errorBody = await response.json();
            if (errorBody.error) {
              errorText = errorBody.error;
            }
          } catch {
            // If we can't parse JSON, use the status text
          }
          const errorMessage: Message = {
            ...assistantMessage,
            content: `SYSTEM ERROR: ${errorText}`,
          };
          const errorMessages = [...updatedMessages, errorMessage];
          setMessages(errorMessages);
          localStorage.setItem(
            "dexai-history",
            JSON.stringify(errorMessages)
          );
          return;
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
        // Network errors and other fetch failures
        const errorText =
          error instanceof Error
            ? error.message
            : "Unable to process query. Please try again.";
        const errorMessage: Message = {
          ...assistantMessage,
          content: `SYSTEM ERROR: ${errorText}`,
        };
        const errorMessages = [...updatedMessages, errorMessage];
        setMessages(errorMessages);
        localStorage.setItem(
          "dexai-history",
          JSON.stringify(errorMessages)
        );
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages, isLoading]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem("dexai-history");
  }, []);

  return { messages, isLoading, sendMessage, clearHistory };
}
