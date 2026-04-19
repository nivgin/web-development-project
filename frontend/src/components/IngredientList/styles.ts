import type { SxProps } from "@mui/material";

export const paper: SxProps = {
  mt: 4,
};

export const header: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  mb: 1,
};

export const divider: SxProps = {
  mb: 2,
};

export const list: SxProps = {
  p: 0,
  columns: { xs: 1, sm: 2 },
  columnGap: 4,
};

export const listItem: SxProps = {
  px: 0,
  py: 0.75,
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  breakInside: "avoid",
};

export const bullet: SxProps = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: "primary.main",
  flexShrink: 0,
};

export const itemText: SxProps = {
  color: "text.primary",
  lineHeight: 1.6,
};
