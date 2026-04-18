import { useState } from "react";
import { ChefChatContext } from "./chef-chat-context";
import type { ChatMessage } from "../types/ChatMessage";

export const ChefChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  return (
    <ChefChatContext.Provider value={{ messages, setMessages, sessionId, setSessionId }}>
      {children}
    </ChefChatContext.Provider>
  );
};
