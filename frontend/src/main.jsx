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
    fontSize: 19,
    button: {
      textTransform: "none",
      fontWeight: 800,
      letterSpacing: 0,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontSize: "1.02rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          fontSize: "1.05rem",
          paddingLeft: 14,
          paddingRight: 14,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#2a3040",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        message: {
          fontSize: "1rem",
          lineHeight: 1.35,
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
