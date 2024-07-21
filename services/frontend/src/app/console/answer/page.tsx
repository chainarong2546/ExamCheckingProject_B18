"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Divider,
    Grid,
    IconButton,
    InputBase,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

type Props = {};

export default function ConsoleAnswerPage({}: Props) {
    const router = useRouter();

    return (
        <Grid
            container
            direction="column"
            wrap="nowrap"
            sx={{ height: "100%" }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1,
                    p: 2,
                }}
            >
                <Typography variant="h6">My Answer</Typography>
                <Paper sx={{ borderRadius: 5 }}>
                    <InputBase sx={{ ml: 2 }} placeholder="Search Group Name" />
                    <IconButton
                        type="button"
                        sx={{ p: "10px" }}
                        aria-label="search"
                    >
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </Box>
            <Divider sx={{ m: 2 }} />
            <Box
                sx={{
                    p: 2,
                    overflow: "auto",
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 1,
                                borderRadius: 3,
                                cursor: "pointer",
                                transition: "box-shadow 0.3s",
                                "&:hover": {
                                    boxShadow:
                                        "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
                                },
                            }}
                            onClick={() => router.push("/console/answer/1")}
                        >
                            <Typography sx={{ mx: 1 }}>ชื่อเฉลย1</Typography>
                            <Paper variant="outlined" sx={{ p: 1, m: 1 }}>
                                <Typography>
                                    <b>วิชา:</b> การเขียนโปรแกรมคอมพิวเตอร์
                                </Typography>
                                <Typography>
                                    <b>ปีการศึกษา:</b> 2566
                                </Typography>
                                <Typography>
                                    <b>จำนวนข้อ:</b> 50
                                </Typography>
                                <Typography>
                                    <b>คะแนนรวม:</b> 50
                                </Typography>
                            </Paper>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="right"
                                sx={{ mx: 1 }}
                            >
                                สร้างเมื่อ 1/2/2566
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 1,
                                borderRadius: 3,
                                cursor: "pointer",
                                transition: "box-shadow 0.3s",
                                "&:hover": {
                                    boxShadow:
                                        "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
                                },
                            }}
                            onClick={() => router.push("/console/answer/1")}
                        >
                            <Typography sx={{ mx: 1 }}>ชื่อเฉลย1</Typography>
                            <Paper variant="outlined" sx={{ p: 1, m: 1 }}>
                                <Typography>
                                    <b>วิชา:</b> การเขียนโปรแกรมคอมพิวเตอร์
                                </Typography>
                                <Typography>
                                    <b>ปีการศึกษา:</b> 2566
                                </Typography>
                                <Typography>
                                    <b>จำนวนข้อ:</b> 50
                                </Typography>
                                <Typography>
                                    <b>คะแนนรวม:</b> 50
                                </Typography>
                            </Paper>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="right"
                                sx={{ mx: 1 }}
                            >
                                สร้างเมื่อ 1/2/2566
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 1,
                                borderRadius: 3,
                                cursor: "pointer",
                                transition: "box-shadow 0.3s",
                                "&:hover": {
                                    boxShadow:
                                        "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
                                },
                            }}
                            onClick={() => router.push("/console/answer/1")}
                        >
                            <Typography sx={{ mx: 1 }}>ชื่อเฉลย1</Typography>
                            <Paper variant="outlined" sx={{ p: 1, m: 1 }}>
                                <Typography>
                                    <b>วิชา:</b> การเขียนโปรแกรมคอมพิวเตอร์
                                </Typography>
                                <Typography>
                                    <b>ปีการศึกษา:</b> 2566
                                </Typography>
                                <Typography>
                                    <b>จำนวนข้อ:</b> 50
                                </Typography>
                                <Typography>
                                    <b>คะแนนรวม:</b> 50
                                </Typography>
                            </Paper>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="right"
                                sx={{ mx: 1 }}
                            >
                                สร้างเมื่อ 1/2/2566
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 1,
                                borderRadius: 3,
                                cursor: "pointer",
                                transition: "box-shadow 0.3s",
                                "&:hover": {
                                    boxShadow:
                                        "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
                                },
                            }}
                            onClick={() => router.push("/console/answer/1")}
                        >
                            <Typography sx={{ mx: 1 }}>ชื่อเฉลย1</Typography>
                            <Paper variant="outlined" sx={{ p: 1, m: 1 }}>
                                <Typography>
                                    <b>วิชา:</b> การเขียนโปรแกรมคอมพิวเตอร์
                                </Typography>
                                <Typography>
                                    <b>ปีการศึกษา:</b> 2566
                                </Typography>
                                <Typography>
                                    <b>จำนวนข้อ:</b> 50
                                </Typography>
                                <Typography>
                                    <b>คะแนนรวม:</b> 50
                                </Typography>
                            </Paper>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="right"
                                sx={{ mx: 1 }}
                            >
                                สร้างเมื่อ 1/2/2566
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    );
}
