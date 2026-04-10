import type { SxProps, Theme } from "@mui/material";

export const root: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  py: 4,
  px: 3,
};

export const userDetails: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 3,
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

export const editButton: SxProps<Theme> = {
  backgroundColor: "grey.500",
  color: "white",
  "&:hover": { backgroundColor: "grey.600" },
};
