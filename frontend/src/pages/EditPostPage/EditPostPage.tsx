import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import PostForm from "../../components/PostForm/PostForm";
import type { PostFormSchema } from "../../components/PostForm/PostForm";
import { postFormSchema } from "../../components/PostForm/PostForm";
import { useAPI } from "../../hooks/useApi";
import AuthRestrictedRoute from "../../routes/AuthRestrictedRoute";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const api = useAPI();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => api.posts.getPostById(id!),
    enabled: !!id,
    staleTime: Infinity,      // never consider data stale
    refetchOnWindowFocus: false,
  });

  const { control, handleSubmit, reset } = useForm<PostFormSchema>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { ingredients: [{ value: "" }], instructions: [{ value: "" }] },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // We could make the API call to fetch the post directly here,
  // but then we would be losing out on caching logic from useQuery.
  useEffect(() => {
    if (!post) return;
    reset({
      title: post.title,
      content: post.content,
      category: post.category,
      time: post.time,
      servings: post.servings,
      ingredients: post.ingredients.map((v) => ({ value: v })),
      instructions: post.instructions.map((v) => ({ value: v })),
    });
    setImagePreview(post.imageUrl);
  }, [post]);

  const { mutateAsync: updatePost, isPending } = useMutation({
    mutationFn: (data: PostFormSchema) =>
      api.posts.updatePost(id!, {
        title: data.title,
        content: data.content,
        category: data.category,
        time: data.time,
        servings: data.servings,
        ingredients: data.ingredients.map((i) => i.value),
        instructions: data.instructions.map((i) => i.value),
        image: data.image?.[0] ?? null,
        existingImageUrl: post!.imageUrl,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      navigate(`/post/${id}/manage`);
    },
  });

  const onSubmit = async (data: PostFormSchema) => {
    await updatePost(data);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "80px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthRestrictedRoute ownerId={post?.sender}>
    <Box sx={{ backgroundColor: "#f9f7f5", minHeight: "100vh", pt: "100px", pb: 5 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight={700} mb={3} color="text.primary">
          Edit Recipe
        </Typography>
        <PostForm
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isSubmitting={isPending}
          imagePreview={imagePreview}
          onImagePreviewChange={setImagePreview}
        />
      </Container>
    </Box>
    </AuthRestrictedRoute>
  );
}
