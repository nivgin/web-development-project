// src/theme/theme.ts
import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: '"DM Sans", system-ui, sans-serif',
    h1: { fontFamily: '"Lora", Georgia, serif' },
    h2: { fontFamily: '"Lora", Georgia, serif' },
    h3: { fontFamily: '"Lora", Georgia, serif' },
    h4: { fontFamily: '"Lora", Georgia, serif' },
    h5: { fontFamily: '"Lora", Georgia, serif' },
    h6: { fontFamily: '"Lora", Georgia, serif' },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#e45d1f",
      light: "#FFB98A",
      dark: "#FF7A1F",
    },
    divider: "#bdbdbd",
    background: {
      default: "#f9f7f5",
      paper: "#f9f7f5",
    },
    text: {
      primary: "#333",
      secondary: "#6B6B6B",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
  },
});
