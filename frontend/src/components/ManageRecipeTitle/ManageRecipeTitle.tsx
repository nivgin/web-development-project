import { Box, Button, Divider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import type { PostFull } from "../../types/Post";
import RecipeTitleDetails from "../RecipeTitleDetails/RecipeTitleDetails";
import IngredientList from "../IngredientList/IngredientList";
import InstructionList from "../InstructionList/InstructionList";
import * as styles from "./styles";

export default function ManageRecipeTitle({
  post,
  onEdit,
  onDelete,
}: {
  post: PostFull;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Box sx={styles.container}>
      <Box sx={styles.inner}>
        <Box
          component="img"
          src={post.imageUrl}
          alt={post.title}
          sx={styles.image}
        />
        <Box sx={styles.textSide}>
          <Box sx={styles.actionRow}>
            <Button variant="contained" onClick={onEdit} disableElevation startIcon={<SettingsIcon />} sx={styles.editButton}>
              Edit
            </Button>
            <Button variant="contained" onClick={onDelete} disableElevation startIcon={<DeleteIcon />} sx={styles.deleteButton}>
              Delete
            </Button>
          </Box>
          <Divider sx={styles.lowerDivider} />
          <RecipeTitleDetails post={post} />
          <IngredientList ingredients={post.ingredients ?? []} />
          <InstructionList instructions={post.instructions ?? []} />
        </Box>
      </Box>
    </Box>
  );
}
