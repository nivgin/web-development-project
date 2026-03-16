import type { SxProps } from "@mui/material";

export const card: SxProps = {
  width: '22em',
  borderRadius: 1,
  overflow: 'hidden',
  transition: 'transform 0.2s ease-in-out',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  backgroundColor: '#f5f2f0',
  border: 'thin solid #d6d3d1',
  '&:hover': {
    transform: 'scale(1.02)',
  },
};

export const cardMedia: SxProps = {
  height: '17.5em',
  flexShrink: 0,
};

export const title: SxProps = {
  fontWeight: 600,
  fontSize: '0.95rem',
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

export const description: SxProps = {
  color: 'text.secondary',
  mt: 0.5,
  mb: 1,
  fontSize: '0.8rem',
  lineHeight: 1.4,
  height: '2.8em',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

export const cardContent: SxProps = {
  p: 2,
  "&:last-child": { pb: 1.5 },
};

export const metaRow: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  mt: 1,
};

export const metaItem: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  color: 'text.primary',
  fontSize: '0.875rem',
};

export const divider: SxProps = {
  borderColor: '#c2bebb',
  my: 2,
};