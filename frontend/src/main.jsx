import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import "./styles.css";

const theme = createTheme({
  palette: {
    primary: { main: "#6f57ef" },
    secondary: { main: "#03b988" },
    background: { default: "#2f3033" },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    fontSize: 18,
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1.05rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          fontSize: "1.05rem",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
