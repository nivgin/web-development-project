import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAPI } from "../../hooks/useApi";

export default function ViewPostPage() {
  const { id } = useParams<{ id: string }>();
  const api = useAPI();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => api.posts.getPostById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f9f7f5", minHeight: "100vh", px: 2, py: 6 }}>
      <Box sx={{ maxWidth: "100em", mx: "auto" }}>
      <Box
        component="img"
        src={post?.imageUrl}
        alt={post?.title}
        sx={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover"}}
      />
      <Typography variant="h3" fontWeight="bold" sx={{ mt: 3 }}>
        {post?.title}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.8, color: "text.secondary" }}>
        {post?.content}
      </Typography>
      </Box>
    </Box>
  );
}
