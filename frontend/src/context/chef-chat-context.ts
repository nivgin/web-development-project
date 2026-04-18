import { createContext } from "react";
import type { ChatMessage } from "../types/ChatMessage";

export interface ChefChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  sessionId: string | undefined;
  setSessionId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ChefChatContext = createContext<ChefChatContextType | null>(null);
