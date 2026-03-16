import { Box } from "@mui/material";
import RecipeResultCard from "../RecipeResultCard/RecipeResultCard";
import type { RecipeResult } from "../RecipeResultCard/RecipeResultCard";
import { grid } from "./styles";

interface RecipeResultsGridProps {
  recipes: RecipeResult[];
}

export default function RecipeResultsGrid({ recipes }: RecipeResultsGridProps) {
  if (recipes.length === 0) return null;

  return (
    <Box sx={grid}>
      {recipes.map((recipe) => (
        <RecipeResultCard key={recipe.id} recipe={recipe} />
      ))}
    </Box>
  );
}
