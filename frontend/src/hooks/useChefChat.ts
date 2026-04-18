import { useContext } from "react";
import { ChefChatContext } from "../context/chef-chat-context";

export function useChefChat() {
  const ctx = useContext(ChefChatContext);
  if (!ctx) throw new Error("useChefChat must be used within ChefChatProvider");
  return ctx;
}
