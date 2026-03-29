import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useFieldArray } from "react-hook-form";
import type { Control } from "react-hook-form";
import type { PostFormSchema } from "../PostForm/PostForm";

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
          <Stack key={field.id} direction="row" spacing={1} alignItems="center">
            <TextField
              {...control.register(`ingredients.${index}.value`)}
              placeholder={`Ingredient ${index + 1}`}
              fullWidth
              size="small"
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
