import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Box, Container, Typography } from "@mui/material";
import PostForm from "../../components/PostForm/PostForm";
import type { PostFormSchema } from "../../components/PostForm/PostForm";
import { postFormSchema } from "../../components/PostForm/PostForm";
import { useAPI } from "../../hooks/useApi";

export default function UploadPostPage() {
  const { control, handleSubmit } = useForm<PostFormSchema>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { ingredients: [{ value: "" }], instructions: [{ value: "" }] },
  });

  const navigate = useNavigate();
  const api = useAPI();

  const { mutateAsync: createPost, isPending } = useMutation({
    mutationFn: api.posts.createPost,
  });

  const onSubmit = async (data: PostFormSchema) => {
    if (!data.image?.[0]) return;
    await createPost({
      title: data.title,
      content: data.content,
      category: data.category,
      time: data.time,
      servings: data.servings,
      ingredients: data.ingredients.map((i) => i.value),
      instructions: data.instructions.map((i) => i.value),
      image: data.image[0],
    });
    navigate("/");
  };

  return (
    <Box sx={{ backgroundColor: "#f9f7f5", minHeight: "100vh", pt: "100px", pb: 5 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight={700} mb={3} color="text.primary">
          New Recipe
        </Typography>
        <PostForm
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isSubmitting={isPending}
        />
      </Container>
    </Box>
  );
}
