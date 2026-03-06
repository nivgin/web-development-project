import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { TextField, InputAdornment } from "@mui/material";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  accept?: string;
  icon?: React.ReactNode;
}

export const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  icon,
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          placeholder={label}
          type={type}
          fullWidth
          margin="normal"
          error={!!error}
          helperText={error?.message}
          onChange={(e) => {
            if (type === "file") {
              field.onChange((e.target as HTMLInputElement).files);
            } else {
              field.onChange(e.target.value);
            }
          }}
          slotProps={{
            input: {
              startAdornment: icon ? (
                <InputAdornment position="start">{icon}</InputAdornment>
              ) : undefined,
            },
          }}
        />
      )}
    />
  );
};