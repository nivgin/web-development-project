import type { SxProps, Theme } from "@mui/material";

export const root: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 3,
  py: 4,
  px: 3,
};

export const textGroup: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
};

export const avatar: SxProps<Theme> = {
  width: 96,
  height: 96,
};

export const name: SxProps<Theme> = {
  fontWeight: 700,
  color: "text.primary",
};

export const email: SxProps<Theme> = {
  color: "text.secondary",
};
