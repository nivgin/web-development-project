import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import ProfileForm from "../../components/ProfileForm/ProfileForm";
import type { ProfileFormSchema } from "../../components/ProfileForm/ProfileForm";
import { profileFormSchema } from "../../components/ProfileForm/ProfileForm";
import { useAPI } from "../../hooks/useApi";
import { useAuth } from "../../hooks/useAuth";

export default function UpdateProfilePage() {
  const api = useAPI();
  const { user: userId } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.users.getUserById(userId!),
    enabled: !!userId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { control, handleSubmit, reset } = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    reset({ username: user.username, password: "" });
    setImagePreview(user.pfpUrl ?? null);
  }, [user]);

  const { mutateAsync: updateUser, isPending } = useMutation({
    mutationFn: (data: ProfileFormSchema) =>
      api.users.updateUser(userId!, {
        username: data.username,
        password: data.password,
        image: data.image?.[0] ?? null,
        existingPfpUrl: user!.pfpUrl,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      navigate("/profile");
    },
  });

  const onSubmit = async (data: ProfileFormSchema) => {
    await updateUser(data);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "80px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f9f7f5", minHeight: "100vh", pt: "100px", pb: 5 }}>
      <Container maxWidth="sm">
        <Typography variant="h5" fontWeight={700} mb={3} color="text.primary">
          Update Profile
        </Typography>
        <ProfileForm
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isSubmitting={isPending}
          imagePreview={imagePreview}
          onImagePreviewChange={setImagePreview}
        />
      </Container>
    </Box>
  );
}
