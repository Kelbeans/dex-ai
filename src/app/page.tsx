"use client";

import { DeviceFrame } from "@/components/DeviceFrame";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";

export default function Home() {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <DeviceFrame>
      <ChatContainer messages={messages} isLoading={isLoading} />
      <ChatInput onSubmit={sendMessage} disabled={isLoading} />
    </DeviceFrame>
  );
}
