"use client";
import React from "react";
import { Autocomplete, Box, Button, Divider, Grid, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, styled } from "@mui/material";
import Image from "next/image";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ConsoleReportData from "@/components/console/ConsoleReportData";


const top100Films = [
    { label: "ชื่อเฉลย1", year: 2566, key: 1},
    { label: "ชื่อเฉลย1", year: 2566, key: 2},
    { label: "ชื่อเฉลย2", year: 2566, key: 3},
    { label: "ชื่อเฉลย3", year: 2566, key: 4},
    { label: "ชื่อเฉลย4", year: 2566, key: 5},
    { label: "ชื่อเฉลย5", year: 2566, key: 6},
    { label: "ชื่อเฉลย6", year: 2566, key: 7},
];

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

type Props = {
    params: {
        id: string;
    };
};

export default function ConsoleGroupDetailPage({ params }: Props) {

    const [title, setTitle] = React.useState("");
    const [subject, setSubject] = React.useState("");
    const [year, setYear] = React.useState(new Date().getFullYear() + 543);

    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [imageDimensions, setImageDimensions] = React.useState<{ width: number; height: number }[]>([]);

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
        }
    };

    React.useEffect(() => {
        const getImageDimensions = async () => {
            const dimensionsArray: { width: number; height: number }[] = [];

            for (const file of selectedFiles) {
                const url = URL.createObjectURL(file);
                const img: HTMLImageElement = document.createElement("img");

                img.onload = () => {
                    dimensionsArray.push({ width: img.width, height: img.height });
                    if (dimensionsArray.length === selectedFiles.length) {
                        setImageDimensions(dimensionsArray);
                    }
                };

                img.src = url;
            }
        };

        if (selectedFiles.length > 0) {
            getImageDimensions();
        }
    }, [selectedFiles]);

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
                <Typography variant="h6">Group Detail : กลุ่มการตรวจ {params.id}</Typography>
                <Button variant="contained" onClick={() => {setIsModalOpen(true)}}>
                    Report
                </Button>
                <Modal
                    open={isModalOpen}
                    // onClose={() => {setIsModalOpen(false)}}
                    disableEnforceFocus 
                    sx={{overflow: "auto"}}
                >
                    <Paper sx={{m: 3, p:2, borderRadius: 5}}>
                        <ConsoleReportData closeButton={closeModal}/>
                    </Paper>
                </Modal>
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
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={top100Films}
                            renderInput={(params) => <TextField {...params} fullWidth label="Choose a Answer" variant="standard" />}
                        />
                    </Grid>
                </Grid>
                <Button variant="contained" onClick={() => {}}>
                    Update
                </Button>

                <Divider sx={{ m: 2 }} />
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Upload file
                    <VisuallyHiddenInput type="file" multiple onChange={handleFileSelect} />
                </Button>
                <TableContainer component={Paper} elevation={5}>
                    <Table sx={{ minWidth: "max-content" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>รูปที่</TableCell>
                                <TableCell align="center">แสดงรูป</TableCell>
                                <TableCell>สถานะ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedFiles.map((file, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell align="center">
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={`Image ${index + 1}`}
                                            height={200}
                                            width={imageDimensions[index]?.width / (imageDimensions[index]?.height / 200) || 0}
                                        />
                                    </TableCell>
                                    <TableCell>รอการอัพโหลด...</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Grid>
    );
}
