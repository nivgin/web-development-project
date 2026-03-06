// src/theme/theme.ts
import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FF8A3D",
      light: "#FFB98A",
      dark: "#FF7A1F",
    },
    background: {
      default: "#FFF4EB",
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
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #FFB98A",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#e9e6e2",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        },
      },
    },
  },
});
