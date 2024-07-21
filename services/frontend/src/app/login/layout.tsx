"use client";
import React from "react";
import SelectThemeButton from "@/components/selectThemeButton";
import { AppBar, Toolbar, Typography } from "@mui/material";

type Props = {
    children: React.ReactNode;
};

export default function LoginLayout({ children }: Props) {
    return (
        <>
            <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ gap: 1 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Exam Checking
                    </Typography>
                    <SelectThemeButton />
                </Toolbar>
            </AppBar>
            <Toolbar />
            {children}
        </>
    );
}
