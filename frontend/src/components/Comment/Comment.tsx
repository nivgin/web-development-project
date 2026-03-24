import { Avatar, Box, ListItem, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import * as styles from "../CommentList/styles";
import type { Comment as CommentType } from "../../types/Comment";

interface CommentProps {
  comment: CommentType;
}

export default function Comment({ comment }: CommentProps) {
  return (
    <ListItem disablePadding sx={styles.commentItem}>
      <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
        <PersonIcon sx={{ fontSize: 18 }} />
      </Avatar>
      <Box sx={styles.commentContent}>
        <Typography sx={styles.contentText}>{comment.content}</Typography>
      </Box>
    </ListItem>
  );
}
