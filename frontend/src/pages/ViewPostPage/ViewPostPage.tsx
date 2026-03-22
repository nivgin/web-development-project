import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
import { useAPI } from "../../hooks/useApi";
import InstructionList from "../../components/InstructionList/InstructionList";
import IngredientList from "../../components/IngredientList/IngredientList";
import RecipeTitle from "../../components/RecipeTitle/RecipeTitle";

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
    <Box sx={{ backgroundColor: "#f9f7f5", minHeight: "100vh" }}>
      {post && <RecipeTitle post={post} />}

      {/* Body section */}
      <Box sx={{ maxWidth: "90em", mx: "auto", px: 2, py: 6 }}>
        <IngredientList ingredients={post?.ingredients ?? []} />
        <InstructionList instructions={post?.instructions ?? []} />
      </Box>
    </Box>
  );
}
