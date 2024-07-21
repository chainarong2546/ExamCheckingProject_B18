"use client";

import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useThemeContext } from "@/components/providers/MuiThemeContextProvider";

type Props = {
    children: React.ReactNode;
};

export default function MuiThemeProvider({ children }: Props) {
    const { theme } = useThemeContext();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
