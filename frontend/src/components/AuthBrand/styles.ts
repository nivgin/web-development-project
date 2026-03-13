import type { SxProps } from "@mui/material";

export const container: SxProps = {
  flex: 1,
  display: { xs: "none", md: "flex" },
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: 6,
  backgroundColor: "#FFF4EB",
};

export const logo: SxProps = {
  width: 220,
  height: 220,
  mb: 3,
};

export const title: SxProps = {
  fontWeight: 700,
  color: "primary.main",
  mb: 2,
};

export const subtitle: SxProps = {
  color: "text.secondary",
  textAlign: "center",
  maxWidth: 380,
};