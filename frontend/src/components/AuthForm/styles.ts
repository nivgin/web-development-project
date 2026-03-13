import type { SxProps } from "@mui/material";

export const container: SxProps = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 4,
  backgroundColor: "background.paper",
};

export const card: SxProps = {
  width: 380,
  p: 4,
  borderRadius: 2,
};

export const submitButton: SxProps = {
  mt: 3,
  bgcolor: "primary.main",
  color: "#FFFFFF",
  "&:hover": { bgcolor: "primary.dark" },
  py: 1.2,
  fontWeight: 600,
};