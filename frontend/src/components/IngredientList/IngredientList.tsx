import { Box, Divider, List, ListItem, Typography } from "@mui/material";
import * as styles from "./styles";

interface IngredientListProps {
  ingredients: string[];
}

export default function IngredientList({ ingredients }: IngredientListProps) {
  if (!ingredients || ingredients.length === 0) return null;

  return (
    <Box sx={styles.paper}>
      <Box sx={styles.header}>
        <Typography variant="h5" fontWeight="bold">
          Ingredients
        </Typography>
      </Box>
      <Divider sx={styles.divider} />
      <List sx={styles.list}>
        {ingredients.map((ingredient, index) => (
          <ListItem key={index} sx={styles.listItem}>
            <Box sx={styles.bullet} />
            <Typography variant="body1" sx={styles.itemText}>
              {ingredient}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
