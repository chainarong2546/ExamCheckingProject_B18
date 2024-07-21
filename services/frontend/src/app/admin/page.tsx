"use client";
import React from "react";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {};

export default function AdminPage({}: Props) {
    const router = useRouter();

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
                <Typography variant="h6">Dashboard</Typography>
            </Box>
            <Divider sx={{ m: 2 }} />
            <Box
                sx={{
                    p: 2,
                    overflow: "auto",
                }}
            >
                <Button onClick={() => {
                    router.push("/console")
                }}>
                    Console
                </Button>

            </Box>
        </Grid>
    );
}
