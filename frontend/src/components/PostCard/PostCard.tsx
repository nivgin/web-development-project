import { Card, CardMedia, CardContent, Typography, Box, Divider } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { card, title, description, metaRow, metaItem, cardMedia, divider } from "./styles";
import type { Post } from "../../types/Post";

const PostCard = ({ title: postTitle, content: postDesc, likeCount: likes, commentCount: comments }: Post) => {
  return (
    <Card sx={card}>
      <CardMedia component="img" sx={cardMedia} image="CHANGE WHEN WE HAVE PICTURE IN POST" alt={postTitle} />
      <CardContent>
        <Typography variant="h6" sx={title}>
          {postTitle}
        </Typography>
        <Typography variant="body2" sx={description}>
          {postDesc}
        </Typography>
        <Divider sx={divider} />
        <Box sx={metaRow}>
          <Box sx={metaItem}>
            <FavoriteBorderIcon fontSize="small" />
            <Typography variant="body2">{likes}</Typography>
          </Box>
          <Box sx={metaItem}>
            <ChatBubbleOutlineIcon fontSize="small" />
            <Typography variant="body2">{comments}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard;