import { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import SearchBar from "../../components/Searchbar/Searchbar";
import ChefHeroPrompt from "../../components/ChefHeroPrompt/ChefHeroPrompt";
import ChefThinkingLoader from "../../components/ChefThinkingLoader/ChefThinkingLoader";
import ChefResponseBubble from "../../components/ChefResponseBubble/ChefResponseBubble";
import UserBubble from "../../components/UserBubble/UserBubble";
import { root, scrollArea, inner, chatArea, inputBar, inputInner } from "./styles";
import { recipes } from "../../data/mockData";
import type { ChatMessage } from "../../types/ChatMessage";

export default function AskTheChefPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isThinking) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const q = text.toLowerCase();
      const filtered = recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.ingredients.some((ing: string) => ing.toLowerCase().includes(q))
      );

      const chefMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "chef",
        text:
          filtered.length > 0
            ? `Great choice! I found ${filtered.length} recipe${filtered.length > 1 ? "s" : ""} for you. ${filtered[0].title} is a personal favourite — it only takes ${filtered[0].time} and serves ${filtered[0].servings}. Give it a try!`
            : "Hmm, I don't have an exact match for that in my collection right now. Try asking about chicken, pasta, salmon, or desserts — I've got some wonderful recipes there!",
        recipes: filtered.length > 0 ? filtered : undefined,
      };

      setMessages((prev) => [...prev, chefMessage]);
      setIsThinking(false);
    }, 1200);
  };

  const hasMessages = messages.length > 0;

  return (
    <Box sx={root}>
      <Box sx={scrollArea}>
        <Box sx={inner}>
          {!hasMessages && !isThinking && (
            <ChefHeroPrompt onSuggestionClick={handleSend} />
          )}

          {(hasMessages || isThinking) && (
            <Box sx={chatArea}>
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <UserBubble key={msg.id} message={msg.text} />
                ) : (
                  <ChefResponseBubble key={msg.id} message={msg.text} recipes={msg.recipes} />
                )
              )}
              {isThinking && <ChefThinkingLoader />}
              <div ref={bottomRef} />
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={inputBar}>
        <Box sx={inputInner}>
          <SearchBar
            value={input}
            onSearch={setInput}
            onSubmit={handleSend}
            placeholder="Ask me anything about cooking..."
          />
        </Box>
      </Box>
    </Box>
  );
}
