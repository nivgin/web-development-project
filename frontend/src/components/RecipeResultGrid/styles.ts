import type { SxProps } from "@mui/material";

export const grid: SxProps = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
  gap: 1.5,
  pt: 1,
};