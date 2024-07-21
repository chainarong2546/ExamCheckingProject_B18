"use client";
import React from "react";
import { createTheme, Theme, PaletteMode } from "@mui/material";
import { createContext, FC, PropsWithChildren, useContext } from "react";
import { getModifiedTheme } from "@/theme/theme";

type ThemeContextType = {
    mode: string;
    localMode: string;
    selectColorMode: (selectMode: Mode) => void;
    theme: Theme;
};

type Mode = "light" | "dark" | "auto";

const useColorTheme = () => {
    const [mode, setMode] = React.useState<PaletteMode>("light");
    const [localMode, setLocalMode] = React.useState<PaletteMode | "auto">("light");

    const selectColorMode = (selectMode: Mode) => {
        localStorage.setItem("theme", selectMode);
        setLocalMode(selectMode);
        if (selectMode === "auto") {
            const prefers = window.matchMedia("(prefers-color-scheme: dark)");
            if (prefers.matches) {
                setMode("dark");
            } else {
                setMode("light");
            }
        } else {
            setMode(selectMode);
        }
    };

    const modifiedTheme = React.useMemo(() => createTheme(getModifiedTheme(mode)), [mode]);

    return {
        mode,
        selectColorMode,
        theme: modifiedTheme,
        localMode,
    };
};

const ThemeContext = createContext<ThemeContextType>({
    mode: "auto",
    localMode: "auto",
    selectColorMode: () => {},
    theme: createTheme(),
});

export const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const value = useColorTheme();

    React.useEffect(() => {
        const localTheme = localStorage.getItem("theme");
        if (localTheme === "dark" || localTheme === "light") {
            value.selectColorMode(localTheme);
        } else {
            value.selectColorMode("auto");
        }
    }, [value]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
    return useContext(ThemeContext);
};

export default ThemeContextProvider;
