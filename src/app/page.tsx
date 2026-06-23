"use client";

import { useState } from "react";
import { DeviceFrame } from "@/components/DeviceFrame";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { ClearButton } from "@/components/ClearButton";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { BrowsePanel } from "@/components/browse/BrowsePanel";
import { useChat } from "@/hooks/useChat";

export default function Home() {
  const { messages, isLoading, hydrated, sendMessage, clearHistory } = useChat();
  const [activeTab, setActiveTab] = useState<"browse" | "chat">("chat");

  const handlePokemonSelect = (id: number, name: string) => {
    sendMessage(`Tell me about ${name}`);
    // On mobile, switch to chat tab after selection
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
        {/* Browse Panel - desktop: always visible, mobile: toggled */}
        <div
          className={`w-full shrink-0 lg:block lg:w-80 ${
            activeTab === "browse" ? "block" : "hidden"
          }`}
        >
          <BrowsePanel onPokemonSelect={handlePokemonSelect} />
        </div>

        {/* Chat area */}
        <div
          className={`flex flex-1 flex-col overflow-hidden ${
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
    </DeviceFrame>
  );
}
