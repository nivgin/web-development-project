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
  multiline?: boolean;
  rows?: number;
  minRows?: number;
  textareaStyle?: React.CSSProperties;
  size?: "small" | "medium";
  margin?: "none" | "dense" | "normal";
}

export const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  icon,
  multiline,
  rows,
  minRows,
  textareaStyle,
  size,
  margin = "normal",
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
          size={size}
          margin={margin}
          multiline={multiline}
          rows={rows}
          minRows={minRows}
          error={!!error}
          helperText={error?.message}
          onChange={(e) => {
            if (type === "file") {
              field.onChange((e.target as HTMLInputElement).files);
            } else if (type === "number") {
              field.onChange(parseFloat(e.target.value));
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
            htmlInput: textareaStyle ? { style: textareaStyle } : undefined,
          }}
        />
      )}
    />
  );
};