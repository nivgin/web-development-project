import { Box, Typography } from "@mui/material";
import { root, bubble, text } from "./styles";

interface UserBubbleProps {
  message: string;
}

export default function UserBubble({ message }: UserBubbleProps) {
  return (
    <Box sx={root}>
      <Box sx={bubble}>
        <Typography variant="body2" sx={text}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
}
