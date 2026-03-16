import type { SxProps } from "@mui/material";

export const root: SxProps = {
  display: "flex",
  justifyContent: "flex-end",
};

export const bubble: SxProps = {
  backgroundColor: "primary.main",
  color: "primary.contrastText",
  borderRadius: "1rem 1rem 0.25rem 1rem",
  px: 2.5,
  py: 1.5,
  maxWidth: "75%",
};

export const text: SxProps = {
  lineHeight: 1.6,
  color: "#f9f7f5",
};