import { useState } from "react";
import { Autocomplete, Box, Button, FormHelperText, Stack, TextField, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { Controller, useFormState } from "react-hook-form";
import type { Control, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "../FormInput/FormInput";
import { useQuery } from "@tanstack/react-query";
import { useAPI } from "../../hooks/useApi";
import IngredientListInput from "../IngredientListInput/IngredientListInput";
import InstructionListInput from "../InstructionListInput/InstructionListInput";

export const postFormSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  time: z.number().min(1),
  servings: z.number().min(1),
  image: z.instanceof(FileList).refine((f) => f.length > 0),
  ingredients: z.array(z.object({ value: z.string().min(1) })).min(1),
  instructions: z.array(z.object({ value: z.string().min(1) })).min(1),
});

export type PostFormSchema = z.infer<typeof postFormSchema>;

interface PostFormProps {
  control: Control<PostFormSchema>;
  handleSubmit: (cb: SubmitHandler<PostFormSchema>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  onSubmit: SubmitHandler<PostFormSchema>;
  isSubmitting?: boolean;
}

export default function PostForm({ control, handleSubmit, onSubmit, isSubmitting }: PostFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { errors } = useFormState({ control });
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
          {...control.register("image", {
            onChange: (e) => {
              const file = e.target.files?.[0];
              if (file) setImagePreview(URL.createObjectURL(file));
            },
          })}
        />
        <label htmlFor="post-image-upload">
          <Box
            sx={{
              width: "100%",
              height: 220,
              borderRadius: 3,
              border: "2px dashed",
              borderColor: errors.image ? "error.main" : "divider",
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
        {errors.image && <FormHelperText error>Recipe image is required</FormHelperText>}
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
          render={({ field, fieldState }) => (
            <Autocomplete
              options={categories}
              value={field.value ?? null}
              onChange={(_, value) => field.onChange(value ?? "")}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select a category" error={!!fieldState.error} helperText={fieldState.error?.message} />
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

        {/* Ingredients */}
        <Typography variant="subtitle1" mb={1}>Ingredients</Typography>
        <IngredientListInput control={control} />

        {/* Instructions */}
        <Typography variant="subtitle1" mb={1}>Instructions</Typography>
        <InstructionListInput control={control} />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ mt: 2, alignSelf: "flex-start", color: "white", boxShadow: 0 }}
        >
          {isSubmitting ? "Publishing..." : "Publish Recipe"}
        </Button>
      </Stack>
    </form>
  );
}
