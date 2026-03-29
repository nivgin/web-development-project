import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useFieldArray } from "react-hook-form";
import type { Control } from "react-hook-form";
import type { PostFormSchema } from "../PostForm/PostForm";

interface InstructionListInputProps {
  control: Control<PostFormSchema>;
}

export default function InstructionListInput({ control }: InstructionListInputProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "instructions",
  });

  return (
    <Box>
      <Stack spacing={1}>
        {fields.map((field, index) => (
          <Stack key={field.id} direction="row" spacing={1} alignItems="center">
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ minWidth: 24, color: "text.secondary" }}
            >
              {index + 1}.
            </Typography>
            <TextField
              {...control.register(`instructions.${index}.value`)}
              placeholder={`Step ${index + 1}`}
              fullWidth
              size="small"
              multiline
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
        Add Step
      </Button>
    </Box>
  );
}
