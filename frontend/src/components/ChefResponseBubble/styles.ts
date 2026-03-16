import type { SxProps } from "@mui/material";

export const root: SxProps = {
  display: "flex",
  gap: 2,
  alignItems: "flex-start",
};

export const avatar: SxProps = {
  height: "3rem",
  width: "3rem",
  borderRadius: "0.875rem",
  objectFit: "cover",
  flexShrink: 0,
};

export const content: SxProps = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export const bubble: SxProps = {
  backgroundColor: "action.hover",
  borderRadius: "0.25rem 1rem 1rem 1rem",
  px: 2.5,
  py: 1.5,
  alignSelf: "flex-start",
  maxWidth: "75%",
};

export const text: SxProps = {
  lineHeight: 1.6,
};