import type { SxProps } from "@mui/material";

export const root: SxProps = {
  maxWidth: "35rem",
  mx: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

export const hero: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  pt: 4,
  pb: 1,
  gap: 1.5,
};

export const avatar: SxProps = {
  height: "7.5rem",
  width: "7.5rem",
  borderRadius: "0.875rem",
  objectFit: "cover",
};

export const title: SxProps = {
  fontWeight: 700,
  mt: 1,
};

export const subtitle: SxProps = {
  color: "text.secondary",
  maxWidth: "20rem",
};

export const suggestionsSection: SxProps = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
};

export const suggestionsLabel: SxProps = {
  color: "text.disabled",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  px: 0.5,
};

export const suggestionsGrid: SxProps = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
  gap: 1.5,
};

export const suggestionChip: SxProps = {
  textAlign: "left",
  borderRadius: "0.75rem",
  border: "1.5px solid",
  borderColor: "divider",
  px: 2,
  py: 1.75,
  width: "100%",
  transition: "background-color 0.15s, border-color 0.15s",
  "&:hover": {
    backgroundColor: "action.hover",
    borderColor: "primary.light",
  },
};