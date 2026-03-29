import { Box, Button, IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useFieldArray } from "react-hook-form";
import type { Control, Path } from "react-hook-form";
import type { PostFormSchema } from "../PostForm/PostForm";
import { FormInput } from "../FormInput/FormInput";

interface IngredientListInputProps {
  control: Control<PostFormSchema>;
}

export default function IngredientListInput({ control }: IngredientListInputProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  return (
    <Box>
      <Stack spacing={1}>
        {fields.map((field, index) => (
          <Stack key={field.id} direction="row" spacing={1} alignItems="flex-start">
            <FormInput<PostFormSchema>
              name={`ingredients.${index}.value` as Path<PostFormSchema>}
              control={control}
              label={`Ingredient ${index + 1}`}
              size="small"
              margin="none"
            />
            <IconButton
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              size="small"
              color="error"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Button
        startIcon={<AddIcon />}
        onClick={() => append({ value: "" })}
        size="small"
        sx={{ mt: 1 }}
      >
        Add Ingredient
      </Button>
    </Box>
  );
}
