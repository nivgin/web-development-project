import { Box, Button, Divider } from "@mui/material";
import type { PostFull } from "../../types/Post";
import RecipeTitleDetails from "../RecipeTitleDetails/RecipeTitleDetails";
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
            <Button variant="contained" onClick={onEdit} disableElevation sx={styles.editButton}>
              Edit
            </Button>
            <Button variant="contained" onClick={onDelete} disableElevation sx={styles.deleteButton}>
              Delete
            </Button>
          </Box>
          <Divider sx={styles.authorDivider} />
          <RecipeTitleDetails post={post} />
        </Box>
      </Box>
    </Box>
  );
}
