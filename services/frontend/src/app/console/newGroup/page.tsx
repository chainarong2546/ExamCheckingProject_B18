"use client";
import React from "react";
import {
    Autocomplete,
    Box,
    Button,
    Divider,
    Grid,
    TextField,
    Typography,
} from "@mui/material";

const top100Films = [
    { label: "ชื่อเฉลย1", year: 2566, key: 1},
    { label: "ชื่อเฉลย1", year: 2566, key: 2},
    { label: "ชื่อเฉลย2", year: 2566, key: 3},
    { label: "ชื่อเฉลย3", year: 2566, key: 4},
    { label: "ชื่อเฉลย4", year: 2566, key: 5},
    { label: "ชื่อเฉลย5", year: 2566, key: 6},
    { label: "ชื่อเฉลย6", year: 2566, key: 7},
];

type Props = {};

export default function ConsoleNewGroupPage({}: Props) {
    const [title, setTitle] = React.useState("");
    const [subject, setSubject] = React.useState("");
    const [year, setYear] = React.useState(new Date().getFullYear() + 543);

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
                <Typography variant="h6">Add Group</Typography>
            </Box>
            <Divider sx={{ m: 2 }} />
            <Box
                sx={{
                    p: 2,
                    overflow: "auto",
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Group details
                </Typography>
                <Grid container spacing={3} sx={{ pb: 5 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            value={title}
                            required
                            label="Title"
                            variant="standard"
                            inputProps={{
                                maxLength: 100,
                            }}
                            fullWidth
                            onChange={(event) => {
                                setTitle(event.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            value={subject}
                            required
                            label="Subject"
                            variant="standard"
                            inputProps={{
                                maxLength: 100,
                            }}
                            fullWidth
                            onChange={(event) => {
                                setSubject(event.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            value={year}
                            required
                            label="Year"
                            variant="standard"
                            type="number"
                            fullWidth
                            onChange={(event) => {
                                const value = event.target.value ? parseInt(event.target.value, 10) : 1;
                                const yearNow = new Date().getFullYear() + 553;
                                setYear(value < 2500 ? 2500 : value > yearNow ? yearNow : value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={top100Films}
                            renderInput={(params) => <TextField {...params} fullWidth label="Choose a Answer" variant="standard" />}
                        />
                    </Grid>
                </Grid>
                <Button variant="contained" onClick={() => {}}>
                    Create
                </Button>

            </Box>
        </Grid>
    );
}
