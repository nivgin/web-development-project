import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useFieldArray } from "react-hook-form";
import type { Control, Path } from "react-hook-form";
import type { PostFormSchema } from "../PostForm/PostForm";
import { FormInput } from "../FormInput/FormInput";
import * as styles from "./styles";

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
          <Stack key={field.id} direction="row" spacing={1} alignItems="flex-start">
            <Typography
              variant="body2"
              fontWeight={600}
              sx={styles.stepNumber}
            >
              {index + 1}.
            </Typography>
            <FormInput<PostFormSchema>
              name={`instructions.${index}.value` as Path<PostFormSchema>}
              control={control}
              label={`Step ${index + 1}`}
              size="small"
              margin="none"
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
        sx={styles.addButton}
      >
        Add Step
      </Button>
    </Box>
  );
}
