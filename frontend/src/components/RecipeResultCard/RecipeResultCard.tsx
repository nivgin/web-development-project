import { Box, Typography, ButtonBase, Tooltip } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useNavigate } from "react-router-dom";
import { root, title, content, meta, image, description } from "./styles";

export interface RecipeResult {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  time: number;
  servings: number;
  category: string;
  ingredients: string[];
  instructions: string[];
  aiGenerated?: boolean;
}

interface RecipeResultCardProps {
  recipe: RecipeResult;
}

export default function RecipeResultCard({ recipe }: RecipeResultCardProps) {
  const navigate = useNavigate();

  return (
    <ButtonBase sx={root} onClick={() => navigate(`/recipe/${recipe._id}`)}>
      <Box
        component="img"
        src={recipe.imageUrl}
        alt={recipe.title}
        sx={image}
      />
      <Box sx={content}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="subtitle2" sx={title} noWrap>
            {recipe.title}
          </Typography>
          {recipe.aiGenerated && (
            <Tooltip title="AI modified recipe">
              <AutoAwesomeIcon sx={{ fontSize: 14, color: "primary.main", flexShrink: 0 }} />
            </Tooltip>
          )}
        </Box>
        <Typography variant="caption" sx={description}>
          {recipe.content}
        </Typography>
        <Typography variant="caption" sx={meta}>
          {recipe.time} minutes · {recipe.servings} servings
        </Typography>
      </Box>
    </ButtonBase>
  );
}