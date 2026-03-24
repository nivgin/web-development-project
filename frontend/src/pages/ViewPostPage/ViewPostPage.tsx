import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
import { useAPI } from "../../hooks/useApi";
import InstructionList from "../../components/InstructionList/InstructionList";
import IngredientList from "../../components/IngredientList/IngredientList";
import RecipeTitle from "../../components/RecipeTitle/RecipeTitle";
import CommentList from "../../components/CommentList/CommentList";

export default function ViewPostPage() {
  const { id } = useParams<{ id: string }>();
  const api = useAPI();

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => api.posts.getPostById(id!),
    enabled: !!id,
  });

  const { data: sender } = useQuery({
    queryKey: ["user", post?.sender],
    queryFn: () => api.users.getUserById(post!.sender),
    enabled: !!post?.sender,
  });

  if (postLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f9f7f5", minHeight: "100vh" }}>
      {post && <RecipeTitle post={post} sender={sender} />}

      {/* Body section */}
      <Box sx={{ maxWidth: "90em", mx: "auto", px: 2, py: 6 }}>
        <IngredientList ingredients={post?.ingredients ?? []} />
        <InstructionList instructions={post?.instructions ?? []} />
        {id && <CommentList postId={id} />}
      </Box>
    </Box>
  );
}
