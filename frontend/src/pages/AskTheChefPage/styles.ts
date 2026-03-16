import type { SxProps } from "@mui/material";

export const root: SxProps = {
  height: "100vh",
  padding: "6rem 1.5rem 2rem 1.5rem",
  backgroundColor: "#f9f7f5",
  display: "flex",
  flexDirection: "column",
};

export const scrollArea: SxProps = {
  flex: 1,
  overflowY: "auto",
  px: 3,
  pt: 4,
  pb: 2,
};

export const inner: SxProps = {
  maxWidth: "45rem",
  mx: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 4,
  minHeight: "100%",
};

export const chatArea: SxProps = {
  maxWidth: "40rem",
  mx: "auto",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
};

export const inputBar: SxProps = {
  backgroundColor: "#f9f7f5",
  px: 3,
  py: 2,
};

export const inputInner: SxProps = {
  maxWidth: "35rem",
  mx: "auto",
  width: "100%",
};