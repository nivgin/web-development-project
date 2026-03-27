import { useForm } from "react-hook-form";
import { Box, Container, Typography } from "@mui/material";
import PostForm from "../../components/PostForm/PostForm";
import type { PostFormSchema } from "../../components/PostForm/PostForm";

export default function UploadPostPage() {
  const { control, handleSubmit } = useForm<PostFormSchema>();

  const onSubmit = (data: PostFormSchema) => {
    console.log(data);
  };

  return (
    <Box sx={{ backgroundColor: "#f9f7f5", minHeight: "100vh", pt: "100px", pb: 5 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight={700} mb={3} color="text.primary">
          New Recipe
        </Typography>
        <PostForm control={control} handleSubmit={handleSubmit} onSubmit={onSubmit} />
      </Container>
    </Box>
  );
}
