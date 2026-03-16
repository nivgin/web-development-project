import { Box, Typography, ButtonBase } from "@mui/material";
import { root, avatar, hero, subtitle, suggestionsLabel, suggestionChip, suggestionsGrid, suggestionsSection, title } from "./styles";

const SUGGESTIONS = [
  "What can I make with chicken and rice?",
  "Quick 15-minute dinner ideas",
  "Best chocolate dessert recipe",
  "Healthy breakfast bowls",
];

interface ChefHeroPromptProps {
  onSuggestionClick: (suggestion: string) => void;
}

export default function ChefHeroPrompt({ onSuggestionClick }: ChefHeroPromptProps) {
  return (
    <Box sx={root}>
      <Box sx={hero}>
        <Box component="img" src="/chef.png" alt="Chef" sx={avatar} />
        <Typography variant="h4" sx={title}>
          Ask the Chef
        </Typography>
        <Typography variant="body2" sx={subtitle}>
          Ask for recipe ideas, ingredient substitutions, or cooking tips from our AI chef.
        </Typography>
      </Box>

      <Box sx={suggestionsSection}>
        <Typography variant="caption" sx={suggestionsLabel}>
          Popular questions
        </Typography>
        <Box sx={suggestionsGrid}>
          {SUGGESTIONS.map((s) => (
            <ButtonBase key={s} sx={suggestionChip} onClick={() => onSuggestionClick(s)}>
              <Typography variant="body2">{s}</Typography>
            </ButtonBase>
          ))}
        </Box>
      </Box>
    </Box>
  );
}