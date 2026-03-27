import { Avatar, Box, ListItem, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import * as styles from "./styles";
import type { CommentSender } from "../../types/Comment";

interface CommentProps {
  content: string;
  sender: CommentSender;
}

export default function Comment({ content, sender }: CommentProps) {
  return (
    <ListItem disablePadding sx={styles.listItem}>
      <Avatar sx={styles.avatar} src={sender.pfpUrl} alt={sender.username}>
        {!sender.pfpUrl && <PersonIcon sx={{ fontSize: 18 }} />}
      </Avatar>
      <Box sx={styles.commentContent}>
        <Typography sx={styles.senderName}>{sender.username}</Typography>
        <Typography sx={styles.contentText}>{content}</Typography>
      </Box>
    </ListItem>
  );
}
