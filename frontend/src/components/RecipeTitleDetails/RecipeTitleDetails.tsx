import { useState } from "react";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import type { PostFull } from "../../types/Post";
import { useAPI } from "../../hooks/useApi";
import * as styles from "./styles";

export default function RecipeTitleDetails({ post }: { post: PostFull }) {
  const api = useAPI();
  const [likedOverride, setLikedOverride] = useState<boolean | null>(null);
  const [countOverride, setCountOverride] = useState<number | null>(null);

  const liked = likedOverride ?? post.isLiked;
  const likeCount = countOverride ?? post.likeCount;

  const handleLikeToggle = async () => {
    const wasLiked = liked;
    const prevCount = likeCount;
    setLikedOverride(!wasLiked);
    setCountOverride(wasLiked ? prevCount - 1 : prevCount + 1);
    try {
      if (wasLiked) {
        await api.posts.unlikePost(post._id);
      } else {
        await api.posts.likePost(post._id);
      }
    } catch {
      setLikedOverride(wasLiked);
      setCountOverride(prevCount);
    }
  };

  return (
    <>
      <Typography variant="h3" fontWeight="bold" sx={styles.title}>
        {post.title}
      </Typography>
      {post.content && (
        <Typography variant="body1" sx={styles.description}>
          {post.content}
        </Typography>
      )}
      <Divider sx={styles.divider} />
      <Box sx={styles.metaRow}>
        <IconButton
          onClick={handleLikeToggle}
          size="small"
          disableRipple
          sx={{ p: 0, gap: 0.75, color: liked ? "error.main" : "text.secondary" }}
        >
          {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          <Typography variant="body2">{likeCount}</Typography>
        </IconButton>
        {post.category && (
          <Box sx={styles.metaItem}>
            <LocalDiningIcon fontSize="small" color="primary" />
            <Typography variant="body2" color="text.secondary">
              {post.category}
            </Typography>
          </Box>
        )}
        {post.servings != null && (
          <Box sx={styles.metaItem}>
            <PeopleAltIcon fontSize="small" color="primary" />
            <Typography variant="body2" color="text.secondary">
              {post.servings} servings
            </Typography>
          </Box>
        )}
        {post.time != null && (
          <Box sx={styles.metaItem}>
            <AccessTimeIcon fontSize="small" color="primary" />
            <Typography variant="body2" color="text.secondary">
              {post.time} min
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
