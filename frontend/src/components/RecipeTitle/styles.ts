import type { SxProps } from "@mui/material";

export const container: SxProps = {
  backgroundColor: "#f2f0ed",
  borderBottom: "1px solid #e0e0e0",
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
  width: { xs: "100%", md: "360px" },
  maxWidth: { xs: "360px", md: "360px" },
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

export const authorDivider: SxProps = {
  mb: 2,
};

export const avatar: SxProps = {
  width: 36,
  height: 36,
};

export const title: SxProps = {
  mb: 1.5,
};

export const description: SxProps = {
  lineHeight: 1.8,
  color: "text.secondary",
  mb: 2.5,
};

export const divider: SxProps = {
  mb: 2,
};

export const metaRow: SxProps = {
  display: "flex",
  gap: 3,
  mt: "auto",
  flexWrap: "wrap",
};

export const metaItem: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: 0.75,
};
