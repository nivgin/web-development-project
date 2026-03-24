import { useState } from "react";
import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAPI } from "../../hooks/useApi";
import * as styles from "./styles";

interface PublishCommentProps {
  postId: string;
  onPublished?: () => void;
}

export default function PublishComment({ postId, onPublished }: PublishCommentProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const api = useAPI();

  const handleSend = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await api.comments.publishComment(postId, text.trim());
      setText("");
      onPublished?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.root}>
      <TextField
        fullWidth
        size="small"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={!text.trim() || loading}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
}
