import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
import { useAPI } from "../../hooks/useApi";
import InstructionList from "../../components/InstructionList/InstructionList";
import IngredientList from "../../components/IngredientList/IngredientList";
import ManageRecipeTitle from "../../components/ManageRecipeTitle/ManageRecipeTitle";
import CommentList from "../../components/CommentList/CommentList";
import PublishComment from "../../components/PublishComment/PublishComment";
import AuthRestrictedRoute from "../../routes/AuthRestrictedRoute";

export default function ManagePostPage() {
  const { id } = useParams<{ id: string }>();
  const api = useAPI();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleCommentPublished = () => {
    queryClient.invalidateQueries({ queryKey: ["comments", id] });
    queryClient.invalidateQueries({ queryKey: ["post", id] });
  };

  const handleDelete = async () => {
    if (!id) return;
    await api.posts.deletePost(id);
    navigate("/profile");
  };

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => api.posts.getPostById(id!),
    enabled: !!id,
  });

  if (postLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthRestrictedRoute ownerId={post?.sender}>
      <Box sx={{ backgroundColor: "#f9f7f5", minHeight: "100vh" }}>
        {post && <ManageRecipeTitle post={post} onEdit={() => navigate(`/post/${id}/edit`)} onDelete={handleDelete} />}

        {/* Body section */}
        <Box sx={{ maxWidth: "lg", mx: "auto", px: 2, py: 6 }}>
          <IngredientList ingredients={post?.ingredients ?? []} />
          <InstructionList instructions={post?.instructions ?? []} />
          {id && <CommentList postId={id} />}
          {id && <PublishComment postId={id} onPublished={handleCommentPublished} />}
        </Box>
      </Box>
    </AuthRestrictedRoute>
  );
}
