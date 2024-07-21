"use client"
import React from 'react'
import { Grid, Box, Typography, Divider, TextField, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, FormControlLabel, Checkbox } from '@mui/material';
import CheckBoxOutlineBlankRoundedIcon from "@mui/icons-material/CheckBoxOutlineBlankRounded";
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";


export type rowDataType = {
    a: boolean;
    b: boolean;
    c: boolean;
    d: boolean;
    point: number;
    rule: boolean;
};


const examCheckBox = <Checkbox icon={<CheckBoxOutlineBlankRoundedIcon />} checkedIcon={<DisabledByDefaultRoundedIcon />} />;


type Props = {}

export default function ConsoleAnswerDetailPage({}: Props) {
    const [title, setTitle] = React.useState("");
    const [subject, setSubject] = React.useState("");
    const [year, setYear] = React.useState(new Date().getFullYear() + 543);
    const [totalNo, setTotalNo] = React.useState(1);
    const [rowData, setRowData] = React.useState<Array<rowDataType>>();

    const handleCheckboxChange = (index: number, label: "a" | "b" | "c" | "d" | "rule") => {
        if (rowData) {
            const nextState = rowData.map((value, index2) => {
                if (index == index2) {
                    if (label === "a") {
                        return {
                            ...value,
                            a: !value.a,
                        };
                    } else if (label === "b") {
                        return {
                            ...value,
                            b: !value.b,
                        };
                    } else if (label === "c") {
                        return {
                            ...value,
                            c: !value.c,
                        };
                    } else if (label === "d") {
                        return {
                            ...value,
                            d: !value.d,
                        };
                    } else if (label === "rule") {
                        return {
                            ...value,
                            rule: !value.rule,
                        };
                    }
                }
                return value;
            });
            setRowData(nextState);
        }
    };

    const handlePointChange = (index: number, point: number) => {
        if (rowData) {
            const nextState = rowData.map((value, index2) => {
                if (index == index2) {
                        return {
                            ...value,
                            point: point,
                        };
                }
                return value;
            });
            setRowData(nextState);
        }
    }

    const checkRuleDisable = (value: rowDataType, index: number) => {
        let count = 0;
        if (value.a) count++;
        if (value.b) count++;
        if (value.c) count++;
        if (value.d) count++;
        if (count > 1) return false;

        return true;
    };

    const handleUpdate = () => {
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
    
    const handleSave = () => {
        console.log(rowData);
        
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
                    <Typography variant="h6">Answer Detail : เฉลยชุดที่ 1</Typography>
                </Box>
                <Divider sx={{ m: 2 }} />
                <Box
                    sx={{
                        p: 2,
                        overflow: "auto",
                    }}
                >
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
                            handleUpdate();
                        }}
                    >
                        Update
                    </Button>
                    <Divider sx={{ m: 2 }} />
                    <TableContainer component={Paper} elevation={5}>
                        <Table sx={{ minWidth: "max-content" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ข้อ</TableCell>
                                    <TableCell>คำตอบ</TableCell>
                                    <TableCell>คะแนน</TableCell>
                                    <TableCell>ต้องถูกทุกตัวเลือก</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rowData?.map((value, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <FormControlLabel
                                                name="checkA"
                                                control={examCheckBox}
                                                labelPlacement="start"
                                                label="ก"
                                                checked={value.a}
                                                onChange={() => handleCheckboxChange(index, "a")}
                                            />

                                            <FormControlLabel
                                                name="checkB"
                                                control={examCheckBox}
                                                labelPlacement="start"
                                                label="ข"
                                                checked={value.b}
                                                onChange={() => handleCheckboxChange(index, "b")}
                                            />
                                            <FormControlLabel
                                                name="checkC"
                                                control={examCheckBox}
                                                labelPlacement="start"
                                                label="ค"
                                                checked={value.c}
                                                onChange={() => handleCheckboxChange(index, "c")}
                                            />
                                            <FormControlLabel
                                                name="checkD"
                                                control={examCheckBox}
                                                labelPlacement="start"
                                                label="ง"
                                                checked={value.d}
                                                onChange={() => handleCheckboxChange(index, "d")}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                required
                                                name="point"
                                                label="Point"
                                                variant="standard"
                                                type="number"
                                                defaultValue={1}
                                                inputProps={{
                                                    min: 1,
                                                    max: 10,
                                                }}
                                                onChange={(event) => {
                                                    const value = event.target.value ? parseInt(event.target.value, 10) : 1;
                                                    handlePointChange(index, value < 1 ? 1 : value > 10 ? 10 : value);
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                name="allCorrect"
                                                disabled={checkRuleDisable(value, index)}
                                                checked={value.rule}
                                                onChange={() => {
                                                    handleCheckboxChange(index, "rule");
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button variant="contained" color="success" onClick={() => {
                        handleSave()
                    }} sx={{ m: 2 }}>
                        Save
                    </Button>
                </Box>
            </Grid>
        </>
    );
}