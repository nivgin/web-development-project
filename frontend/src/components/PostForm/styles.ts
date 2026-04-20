import type { SxProps, Theme } from "@mui/material";

export const imageUploadBox = (hasError: boolean, imagePreview: string | null): SxProps<Theme> => ({
  width: 320,
  height: 320,
  borderRadius: 3,
  border: "2px dashed",
  borderColor: hasError ? "error.main" : "divider",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  cursor: "pointer",
  backgroundColor: "background.paper",
  backgroundImage: imagePreview ? `url("${imagePreview}")` : "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
});

export const submitButton: SxProps<Theme> = {
  mt: 2,
  alignSelf: "flex-start",
  color: "white",
  boxShadow: 0,
};
