import type { SxProps } from "@mui/material";

export const root: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  py: 4,
};

export const avatar: SxProps = {
  height: "3rem",
  width: "3rem",
  borderRadius: "0.875rem",
  objectFit: "cover",
  flexShrink: 0,
};

export const lines: SxProps = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
};