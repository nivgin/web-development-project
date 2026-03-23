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
    divider: "#bdbdbd",
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
  },
});
