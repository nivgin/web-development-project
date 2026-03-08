import type { SxProps } from "@mui/material";

export const container: SxProps = {
  width: '100%',
  py: { xs: 4, sm: 5, md: 6 },
  display: 'flex',
  justifyContent: 'center',
};

export const grid: SxProps = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 22em)',
  gap: '1.5em',
};