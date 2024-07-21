import React from "react";
import { DataGrid, GridValueGetterParams, GridToolbarContainer, GridToolbarExport, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Box, Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGridPremium } from "@mui/x-data-grid-premium";

type Props = {
    closeButton: () => void;
};

const columns: GridColDef[] = [
    { field: "id", headerName: "ข้อที่", width: 90, align: "center" },
    {
        field: "answer",
        headerName: "เฉลย",
        width: 90,
        align: "center"
    },
    {
        field: "point",
        headerName: "คะแนน",
        type: "number",
        width: 90,
        align: "center"
    },
    {
        field: "answer2",
        headerName: "คำตอบ",
        width: 90,
        align: "center"
    },
    {
        field: "point2",
        headerName: "คะแนนที่ได้",
        type: "number",
        width: 90,
        align: "center"
    },
];

const rows: GridRowsProp = [
    { id: 0, answer: "ก", point: 1, answer2: "ก", point2: 1},
    { id: 1, answer: "ข", point: 1, answer2: "ก", point2: 0},
    { id: 2, answer: "ก", point: 1, answer2: "ง", point2: 0},
    { id: 3, answer: "ง", point: 1, answer2: "ง", point2: 1},
    { id: 4, answer: "ค", point: 1, answer2: "ค", point2: 1},
    { id: 5, answer: "ข", point: 1, answer2: "ข", point2: 1},
    { id: 6, answer: "ข", point: 1, answer2: "ก", point2: 0},
    { id: 7, answer: "ก", point: 1, answer2: "ก", point2: 1},
    { id: 8, answer: "ง", point: 1, answer2: "ก", point2: 0},
    { id: 9, answer: "ก", point: 1, answer2: "ก", point2: 1},

];

const CustomToolbar = () => {
    return (
        <GridToolbarContainer>
            <GridToolbarExport />
        </GridToolbarContainer>
    );
};

export default function ConsoleReportData({ closeButton }: Props) {
    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box />
                <IconButton
                    aria-label="close"
                    onClick={() => {
                        closeButton();
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 15, 25, 50, 100]}
                checkboxSelection
                slots={{
                    toolbar: CustomToolbar,
                }}
                pagination
            />
        </>
    );
}
