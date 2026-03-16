import type { RecipeResult } from "../components/RecipeResultCard/RecipeResultCard";

export interface ChatMessage {
  id: string;
  role: "user" | "chef";
  text: string;
  recipes?: RecipeResult[];
}
