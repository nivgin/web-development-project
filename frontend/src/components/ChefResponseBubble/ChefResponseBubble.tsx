import { Box, Typography } from "@mui/material";
import RecipeResultsGrid from "../RecipeResultGrid/RecipeResultsGrid";
import { root, content, avatar, bubble, text } from "./styles";
import type { RecipeResult } from "../RecipeResultCard/RecipeResultCard";

interface ChefResponseBubbleProps {
  message: string;
  recipes?: RecipeResult[];
}

export default function ChefResponseBubble({ message, recipes }: ChefResponseBubbleProps) {
  return (
    <Box sx={root}>
      <Box component="img" src="/chef.png" alt="Chef" sx={avatar} />
      <Box sx={content}>
        <Box sx={bubble}>
          <Typography variant="body2" sx={text}>
            {message}
          </Typography>
        </Box>
        {recipes && recipes.length > 0 && (
          <RecipeResultsGrid recipes={recipes} />
        )}
      </Box>
    </Box>
  );
}