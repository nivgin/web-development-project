import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardMedia, CardContent, Typography, Box, Divider, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite"
import { card, title, description, metaRow, metaItem, cardMedia, divider, cardContent } from "./styles";
import type { Post } from "../../types/Post";
import { useAPI } from "../../hooks/useApi";

const PostCard = ({ _id: id, title: postTitle, content: postDesc, likeCount: likes, isLiked, imageUrl, commentCount: comments, linkSuffix }: Post & { linkSuffix?: string }) => {
  const [likedOverride, setLikedOverride] = useState<boolean | null>(null);
  const [countOverride, setCountOverride] = useState<number | null>(null);

  const liked = likedOverride ?? isLiked;
  const likeCount = countOverride ?? likes;

  const api = useAPI();

  const handleLikeToggle = async () => {
    const wasLiked = liked;
    const prevCount = likeCount;

    setLikedOverride(!wasLiked);
    setCountOverride(wasLiked ? prevCount - 1 : prevCount + 1);

    try {
      if (wasLiked) {
        await api.posts.unlikePost(id);
      } else {
        await api.posts.likePost(id);
      }
    } catch {
      setLikedOverride(wasLiked);
      setCountOverride(prevCount);
    }
  };

  return (
    <Link to={`/post/${id}${linkSuffix ?? ""}`} style={{ textDecoration: "none" }}>
      <Card sx={card}>
        <CardMedia component="img" sx={cardMedia} image={imageUrl} alt={postTitle} />
        <CardContent sx={cardContent}>
          <Typography variant="h6" sx={title}>
            {postTitle}
          </Typography>
          <Typography variant="body2" sx={description}>
            {postDesc}
          </Typography>
          <Divider sx={divider} />
          <Box sx={metaRow}>
              <IconButton
                onClick={(e) => { e.preventDefault(); handleLikeToggle(); }}
                size="small"
                disableRipple
                sx={{ p: 0, color: liked ? "error.main" : "inherit" }}
              >
                {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                <Typography variant="body2">{likeCount}</Typography>
              </IconButton>
            <Box sx={metaItem}>
              <ChatBubbleOutlineIcon fontSize="small" />
              <Typography variant="body2">{comments}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PostCard;