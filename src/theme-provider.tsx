import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "@/theme";

type Mode = "light" | "dark";
interface Ctx {
  mode: Mode;
  toggle: () => void;
}
const ColorModeContext = createContext<Ctx>({ mode: "dark", toggle: () => {} });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("atracio.theme") as Mode) || "dark";
  });

  const value = useMemo<Ctx>(
    () => ({
      mode,
      toggle: () => {
        setMode((m) => {
          const next = m === "dark" ? "light" : "dark";
          if (typeof window !== "undefined")
            localStorage.setItem("atracio.theme", next);
          return next;
        });
      },
    }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
