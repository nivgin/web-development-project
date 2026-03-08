import { Card, CardMedia, CardContent, Typography, Box, Divider } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { card, title, description, metaRow, metaItem, cardMedia, divider } from "./styles";

export interface PostCardProps {
  title: string;
  image: string;
  description: string;
  likes: number;
  comments: number;
}

const PostCard = ({ title: postTitle, image, description: postDesc, likes, comments }: PostCardProps) => {
  return (
    <Card sx={card}>
      <CardMedia component="img" sx={cardMedia} image={image} alt={postTitle} />
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