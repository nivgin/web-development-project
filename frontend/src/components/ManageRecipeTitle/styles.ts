export { container, inner, image, textSide, authorDivider } from "../RecipeTitle/styles";
import type { SxProps } from "@mui/material";

export const actionRow: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  mb: 1.5,
};

export const editButton: SxProps = {
  backgroundColor: "grey.500",
  color: "white",
  "&:hover": { backgroundColor: "grey.600" },
};

export const deleteButton: SxProps = {
  backgroundColor: "error.main",
  color: "white",
  "&:hover": { backgroundColor: "error.dark" },
};
