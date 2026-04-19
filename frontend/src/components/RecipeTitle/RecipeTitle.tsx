import { Avatar, Box, Divider, Typography } from "@mui/material";
import type { PostFull } from "../../types/Post";
import type { User } from "../../types/User";
import RecipeTitleDetails from "../RecipeTitleDetails/RecipeTitleDetails";
import IngredientList from "../IngredientList/IngredientList";
import InstructionList from "../InstructionList/InstructionList";
import * as styles from "./styles";

export default function RecipeTitle({ post, sender }: { post: PostFull; sender?: User }) {
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
          <Box sx={styles.authorRow}>
            <Avatar src={sender?.pfpUrl} alt={sender?.username ?? "Anonymous"} sx={styles.avatar} />
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              {sender?.username ?? "Anonymous"}
            </Typography>
          </Box>
          <RecipeTitleDetails post={post} />
          <Divider sx={styles.lowerDivider} />
          <IngredientList ingredients={post.ingredients ?? []} />
          <InstructionList instructions={post.instructions ?? []} />
        </Box>
      </Box>
    </Box>
  );
}

