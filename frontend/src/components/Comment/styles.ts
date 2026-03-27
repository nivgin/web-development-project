import type { SxProps } from "@mui/material";

export const listItem: SxProps = {
  display: "flex",
  alignItems: "flex-start",
  gap: 1.5,
  py: 1.5,
  px: 0,
};

export const avatar: SxProps = {
  width: 32,
  height: 32,
  bgcolor: "primary.main",
};

export const commentContent: SxProps = {
  display: "flex",
  flexDirection: "column",
  gap: 0.25,
};

export const senderName: SxProps = {
  fontWeight: 600,
  fontSize: "0.85rem",
  color: "text.primary",
};

export const contentText: SxProps = {
  color: "text.secondary",
  lineHeight: 1.6,
};
