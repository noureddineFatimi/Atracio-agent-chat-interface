import { createTheme, type ThemeOptions } from "@mui/material/styles";

const shared: ThemeOptions = {
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, paddingInline: 18 },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
  },
};

export const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: "light",
    primary: { main: "#0B4FD9", dark: "#0838A6", light: "#3E78F0" },
    secondary: { main: "#06B6D4" },
    background: { default: "#F6F8FB", paper: "#FFFFFF" },
    text: { primary: "#0B1B33", secondary: "#5A6A85" },
    divider: "rgba(11,27,51,0.08)",
  },
});

export const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: "dark",
    primary: { main: "#5E8BFF", dark: "#3E78F0", light: "#8FAEFF" },
    secondary: { main: "#22D3EE" },
    background: { default: "#0A1020", paper: "#111A2E" },
    text: { primary: "#E6ECF7", secondary: "#9BAAC6" },
    divider: "rgba(255,255,255,0.08)",
  },
});
