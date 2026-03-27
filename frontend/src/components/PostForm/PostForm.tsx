import { useState } from "react";
import { Autocomplete, Box, Stack, TextField, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { Controller } from "react-hook-form";
import type { Control, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "../FormInput/FormInput";
import { useQuery } from "@tanstack/react-query";
import { useAPI } from "../../hooks/useApi";

export const postFormSchema = z.object({
  title: z.string(),
  content: z.string(),
  category: z.string(),
  time: z.number(),
  servings: z.number(),
});

export type PostFormSchema = z.infer<typeof postFormSchema>;

interface PostFormProps {
  control: Control<PostFormSchema>;
  handleSubmit: (cb: SubmitHandler<PostFormSchema>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  onSubmit: SubmitHandler<PostFormSchema>;
}

export default function PostForm({ control, handleSubmit, onSubmit }: PostFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const api = useAPI();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.posts.getCategories(),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          id="post-image-upload"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setImagePreview(URL.createObjectURL(file));
          }}
        />
        <label htmlFor="post-image-upload">
          <Box
            sx={{
              width: "100%",
              height: 220,
              borderRadius: 3,
              border: "2px dashed",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              cursor: "pointer",
              backgroundColor: "background.paper",
              backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!imagePreview && (
              <Stack alignItems="center" spacing={1} color="text.secondary">
                <ImageIcon fontSize="large" />
                <Typography variant="body2">Click to upload recipe image</Typography>
              </Stack>
            )}
          </Box>
        </label>

        {/* Title */}
        <Typography variant="subtitle1">Title</Typography>
        <FormInput<PostFormSchema> name="title" control={control} label="Recipe Title" />

        {/* Description */}
        <Typography variant="subtitle1">Description</Typography>
        <FormInput<PostFormSchema> name="content" control={control} label="Description" multiline minRows={4} textareaStyle={{ resize: "vertical" }} />

        {/* Category */}
        <Typography variant="subtitle1">Category</Typography>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={categories}
              value={field.value ?? null}
              onChange={(_, value) => field.onChange(value ?? "")}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select a category" />
              )}
            />
          )}
        />

        {/* Cook Time & Servings */}
        <Stack direction="row" spacing={2}>
          <Box flex={1}>
            <Typography variant="subtitle1">Cook Time (minutes)</Typography>
            <FormInput<PostFormSchema> name="time" control={control} label="Cook Time" type="number" />
          </Box>
          <Box flex={1}>
            <Typography variant="subtitle1">Servings</Typography>
            <FormInput<PostFormSchema> name="servings" control={control} label="Servings" type="number" />
          </Box>
        </Stack>
      </Stack>
    </form>
  );
}
