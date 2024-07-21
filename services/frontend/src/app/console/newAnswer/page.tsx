"use client";
import React from "react";
import router from "next/router";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import type { rowDataType } from "../answer/[id]/page";

type Props = {};

const examCheckBox = <Checkbox icon={<CheckBoxOutlineBlankRoundedIcon />} checkedIcon={<DisabledByDefaultRoundedIcon />} />;

export default function ConsoleNewAnswerPage({}: Props) {
    const [title, setTitle] = React.useState("");
    const [subject, setSubject] = React.useState("");
    const [year, setYear] = React.useState(new Date().getFullYear() + 543);
    const [totalNo, setTotalNo] = React.useState(1);
    const [rowData, setRowData] = React.useState<Array<rowDataType>>();

    const handleSubmit = () => {
        setRowData(
            Array(totalNo).fill({
                a: false,
                b: false,
                c: false,
                d: false,
                point: 1,
                rule: true,
            })
        );


    };

    return (
        <>
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
                    <Typography variant="h6">Add Answer</Typography>
                </Box>
                <Divider sx={{ m: 2 }} />
                <Box
                    sx={{
                        p: 2,
                        overflow: "auto",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Answer details
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
                            <TextField
                                value={totalNo}
                                required
                                label="Total No."
                                type="number"
                                variant="standard"
                                fullWidth
                                onChange={(event) => {
                                    const value = event.target.value ? parseInt(event.target.value, 10) : 1;
                                    setTotalNo(value < 1 ? 1 : value > 100 ? 100 : value);
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        Create
                    </Button>

                </Box>
            </Grid>
        </>
    );
}
