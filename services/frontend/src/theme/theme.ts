import { PaletteMode, ThemeOptions } from "@mui/material";
import { Kanit } from "next/font/google";

export const kanit = Kanit({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const getModifiedTheme = (mode: PaletteMode) =>
    <ThemeOptions>{
        palette: {
            mode: mode,
            ...(mode === "light"
                ? {
                      // palette values for light mode
                  }
                : {
                      // palette values for dark mode
                  }),
        },
        typography: {
            fontFamily: kanit.style.fontFamily,
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    "*::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "*::-webkit-scrollbar-thumb": {
                        backgroundColor: "#888",
                        borderRadius: "10px",
                    },
                    "*::-webkit-scrollbar-track": {
                        backgroundColor: "none",
                    },
                },
            },
        },
    };
