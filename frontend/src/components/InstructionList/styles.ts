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

export const stepIconProps: SxProps = {
  color: "primary.main",
  "& .MuiStepIcon-text": { fill: "white" },
};

export const stepper: SxProps = {
  "& .MuiStepConnector-line": { minHeight: 8 },
};

export const step: SxProps = {
  py: 0,
};

export const stepContent: SxProps = {
  color: "text.primary",
  lineHeight: 1.8,
};
