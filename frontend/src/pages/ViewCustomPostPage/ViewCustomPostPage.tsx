import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Box } from "@mui/material";
import RecipeTitle from "../../components/RecipeTitle/RecipeTitle";
import type { PostFull } from "../../types/Post";
import type { User } from "../../types/User";

export default function ViewCustomPostPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const post: PostFull | undefined = state?.post;
  const sender: User = { id: "", username: "ChefAI", email: "", password: "", pfpUrl: "/chef.png" };

  useEffect(() => {
    if (!post) navigate("/", { replace: true });
  }, [post, navigate]);


  if (!post) return null;

  return (
    <Box sx={{ backgroundColor: "#f9f7f5", minHeight: "100vh" }}>
      <RecipeTitle post={post} sender={sender} customRecipe />
    </Box>
  );
}
