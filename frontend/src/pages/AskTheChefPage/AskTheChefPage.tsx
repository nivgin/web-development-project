import { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import SearchBar from "../../components/Searchbar/Searchbar";
import ChefHeroPrompt from "../../components/ChefHeroPrompt/ChefHeroPrompt";
import ChefThinkingLoader from "../../components/ChefThinkingLoader/ChefThinkingLoader";
import ChefResponseBubble from "../../components/ChefResponseBubble/ChefResponseBubble";
import UserBubble from "../../components/UserBubble/UserBubble";
import { root, scrollArea, inner, chatArea, inputBar, inputInner } from "./styles";
import type { ChatMessage } from "../../types/ChatMessage";
import { useAPI } from "../../hooks/useApi";

export default function AskTheChefPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { chefai } = useAPI();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = async (overrideText?: string) => {
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

    try {
      const response = await chefai.chat(text, sessionId);

      if (!sessionId) {
        setSessionId(response.sessionId);
      }

      let chefMessage: ChatMessage;

      if (response.intent === "search_recipes") {
        const found = response.results ?? [];
        chefMessage = {
          id: crypto.randomUUID(),
          role: "chef",
          text:
            found.length > 0
              ? `Great choice! I found ${found.length} recipe${found.length > 1 ? "s" : ""} for you.`
              : "Hmm, I don't have an exact match for that in my recipe book right now. Try asking about something else!",
          recipes: found.length > 0 ? found : undefined,
        };
      } else if (response.intent === "modify_recipe") {
        chefMessage = {
          id: crypto.randomUUID(),
          role: "chef",
          text: "Here's your modified recipe!",
          recipes: [response.recipe],
        };
      } else {
        chefMessage = {
          id: crypto.randomUUID(),
          role: "chef",
          text: response.answer,
        };
      }

      setMessages((prev) => [...prev, chefMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "chef",
          text: "Sorry, something went wrong. Please try again!",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
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