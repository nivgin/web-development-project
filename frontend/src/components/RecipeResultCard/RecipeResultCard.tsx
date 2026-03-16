import { Box, Typography, ButtonBase } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { root, title, content, meta, image, description } from "./styles";

export interface RecipeResult {
  id: string | number;
  title: string;
  description: string;
  image: string;
  time: string;
  servings: number;
}

interface RecipeResultCardProps {
  recipe: RecipeResult;
}

export default function RecipeResultCard({ recipe }: RecipeResultCardProps) {
  const navigate = useNavigate();

  return (
    <ButtonBase sx={root} onClick={() => navigate(`/recipe/${recipe.id}`)}>
      <Box
        component="img"
        src={recipe.image}
        alt={recipe.title}
        sx={image}
      />
      <Box sx={content}>
        <Typography variant="subtitle2" sx={title} noWrap>
          {recipe.title}
        </Typography>
        <Typography variant="caption" sx={description}>
          {recipe.description}
        </Typography>
        <Typography variant="caption" sx={meta}>
          {recipe.time} · {recipe.servings} servings
        </Typography>
      </Box>
    </ButtonBase>
  );
}
