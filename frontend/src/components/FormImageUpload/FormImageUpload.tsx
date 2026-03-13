import { useState } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Avatar, Box, Typography } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

interface FormImageUploadProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  size?: number;
  round?: boolean;
  placeholder?: string;
}

export const FormImageUpload = <T extends FieldValues>({
  name,
  control,
  size = 88,
  round = true,
  placeholder = "/avatar.png",
}: FormImageUploadProps<T>) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [hover, setHover] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box textAlign="center">
          <input
            type="file"
            accept="image/*"
            id={name}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                field.onChange(e.target.files);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          <label htmlFor={name} style={{ cursor: "pointer" }}>
            <Box
              sx={{
                position: "relative",
                width: size,
                height: size,
              }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <Avatar
                src={preview || placeholder}
                variant={round ? "circular" : "rounded"}
                sx={{
                  width: size,
                  height: size,
                  boxShadow: 0,
                  transition: "0.2s",
                  display: "block"
                }}
              />

              {/* Hover overlay */}
              {hover && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.45)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  <PhotoCameraIcon sx={{ fontSize: 18 }} />
                  Upload
                </Box>
              )}
            </Box>
          </label>

          {error && (
            <Typography
              color="error"
              variant="caption"
              sx={{ mt: 1, display: "block" }}
            >
              {error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};