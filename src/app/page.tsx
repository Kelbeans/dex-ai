"use client";

import { useState } from "react";
import { DeviceFrame } from "@/components/DeviceFrame";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { ClearButton } from "@/components/ClearButton";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { BrowsePanel } from "@/components/browse/BrowsePanel";
import { PokemonDetailModal } from "@/components/PokemonDetailModal";
import { useChat } from "@/hooks/useChat";

export default function Home() {
  const { messages, isLoading, hydrated, sendMessage, clearHistory } = useChat();
  const [activeTab, setActiveTab] = useState<"browse" | "chat">("chat");
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  const handlePokemonSelect = (_id: number, name: string) => {
    setSelectedPokemon(name);
  };

  const handleAskAI = (name: string) => {
    sendMessage(`Tell me about ${name}`);
    setSelectedPokemon(null);
    setActiveTab("chat");
  };

  if (!hydrated) {
    return (
      <DeviceFrame>
        <div className="flex flex-1 items-center justify-center">
          <p className="animate-pulse font-mono text-sm text-gray-500">
            INITIALIZING...
          </p>
        </div>
      </DeviceFrame>
    );
  }

  return (
    <DeviceFrame>
      {/* Mobile tab toggle */}
      <div className="flex border-b border-white/10 lg:hidden">
        <button
          onClick={() => setActiveTab("browse")}
          className={`flex-1 py-2 font-mono text-xs font-bold tracking-wider transition-colors ${
            activeTab === "browse"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-500"
          }`}
        >
          BROWSE
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-2 font-mono text-xs font-bold tracking-wider transition-colors ${
            activeTab === "chat"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-500"
          }`}
        >
          CHAT
        </button>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Browse Panel - desktop: half width, mobile: toggled */}
        <div
          className={`w-full shrink-0 border-r border-white/10 lg:block lg:w-1/2 ${
            activeTab === "browse" ? "block" : "hidden"
          }`}
        >
          <BrowsePanel onPokemonSelect={handlePokemonSelect} />
        </div>

        {/* Chat area - half width */}
        <div
          className={`flex w-full flex-col overflow-hidden lg:w-1/2 ${
            activeTab === "chat" ? "flex" : "hidden lg:flex"
          }`}
        >
          {messages.length === 0 ? (
            <WelcomeScreen onPromptClick={sendMessage} />
          ) : (
            <>
              <div className="flex justify-end px-3 pt-2">
                <ClearButton onClick={clearHistory} />
              </div>
              <ChatContainer messages={messages} isLoading={isLoading} />
            </>
          )}
          <ChatInput onSubmit={sendMessage} disabled={isLoading} />
        </div>
      </div>
      <PokemonDetailModal
        pokemonName={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        onAskAI={handleAskAI}
      />
    </DeviceFrame>
  );
}
