import type { SxProps } from "@mui/material";

export const container: SxProps = {
  px: 2,
  py: 6,
  mt: "80px",
};

export const inner: SxProps = {
  maxWidth: "lg",
  mx: "auto",
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  alignItems: { xs: "center", md: "flex-start" },
  gap: 5,
};

export const image: SxProps = {
  width: { xs: "100%", md: "480px" },
  maxWidth: { xs: "480px", md: "480px" },
  aspectRatio: "1 / 1",
  objectFit: "cover",
  borderRadius: 3,
  flexShrink: 0,
};

export const textSide: SxProps = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

export const authorRow: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  mb: 1.5,
};

export const lowerDivider: SxProps = {
  mt: 2,
};

export const avatar: SxProps = {
  width: 36,
  height: 36,
};


