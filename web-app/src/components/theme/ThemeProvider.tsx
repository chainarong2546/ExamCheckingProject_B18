"use client";
import React, { useEffect } from "react";

export type Theme = "dark" | "light" | "auto";

type Props = {
    children: React.ReactNode;
};

// Apply theme to the document root
export const applyTheme = (theme: Theme) => {
    // setVariableCSS(theme)
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    if (theme === "auto") {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }
};

export default function ThemeProvider({ children }: Props) {
    useEffect(() => {
        const savedTheme = (localStorage.getItem("theme") as Theme) || "auto";
        applyTheme(savedTheme);
    }, []);

    return children;
}
