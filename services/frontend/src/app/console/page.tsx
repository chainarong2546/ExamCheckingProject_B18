"use client";
import React from "react";
import router from "next/router";
import { Box, Button, Divider, Grid, IconButton, InputBase, Paper, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {};

export default function ConsolePage({}: Props) {
    const router = useRouter()

    return (
        <Grid container direction="column" wrap="nowrap" sx={{ height: "100%" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1,
                    p: 2,
                }}
            >
                <Typography variant="h6">Home</Typography>
            </Box>
            <Divider sx={{ m: 2 }} />
            <Box
                sx={{
                    p: 2,
                    overflow: "auto",
                }}
            >
                <Button onClick={() => {
                    router.push("/admin")
                }}>
                    Admin
                </Button>

            </Box>
        </Grid>
    );
}
