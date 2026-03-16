import type { SxProps } from "@mui/material";

export const root: SxProps = {
  display: "flex",
  gap: 1.5,
  borderRadius: "0.875rem",
  border: "1.5px solid",
  borderColor: "divider",
  p: 1.5,
  textAlign: "left",
  width: "100%",
  transition: "background-color 0.15s, border-color 0.15s",
  "&:hover": {
    backgroundColor: "action.hover",
    borderColor: "primary.light",
  },
};

export const image: SxProps = {
  height: "4rem",
  width: "4rem",
  borderRadius: "0.625rem",
  objectFit: "cover",
  flexShrink: 0,
};

export const content: SxProps = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: 0.25,
};

export const title: SxProps = {
  fontWeight: 600,
};

export const description: SxProps = {
  color: "text.secondary",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  lineHeight: 1.5,
};

export const meta: SxProps = {
  color: "text.disabled",
  mt: 0.25,
};