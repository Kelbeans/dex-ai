"use client";

import { DeviceFrame } from "@/components/DeviceFrame";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { ClearButton } from "@/components/ClearButton";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useChat } from "@/hooks/useChat";

export default function Home() {
  const { messages, isLoading, sendMessage, clearHistory } = useChat();

  return (
    <DeviceFrame>
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
    </DeviceFrame>
  );
}
