import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";
// import { DataGridPremium } from "@mui/x-data-grid-premium";

const roles = ["Market", "Finance", "Development"];

const initialRows: GridRowsProp = [
    { id: 0, username: "user001", lastName: "Mike", firstName: "Arya", age: 14 },
    { id: 1, username: "user002", lastName: "Snow", firstName: "Jon", age: 14 },
    { id: 2, username: "user003", lastName: "Lannister", firstName: "Cersei", age: 31 },
    { id: 3, username: "user004", lastName: "Lannister", firstName: "Jaime", age: 31 },
    { id: 4, username: "user005", lastName: "Stark", firstName: "Arya", age: 11 },
    { id: 5, username: "user006", lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, username: "user007", lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, username: "user008", lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, username: "user009", lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, username: "user010", lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function FullFeaturedCrudGrid() {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const EditToolbar = () => {
        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />}>
                    Add User
                </Button>
            </GridToolbarContainer>
        );
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 90, editable: false },
        { field: "username", headerName: "Username", type: "string", width: 150, editable: true },
        {
            field: "firstName",
            headerName: "Firstname",
            type: "string",
            width: 150,
            align: "left",
            headerAlign: "left",
            editable: true,
        },
        {
            field: "lastName",
            headerName: "Lastname",
            type: "string",
            width: 150,
            align: "left",
            headerAlign: "left",
            editable: true,
        },
        {
            field: "age",
            headerName: "Age",
            type: "number",
            width: 80,
            align: "left",
            headerAlign: "left",
            editable: true,
        },
        {
            field: "joinDate",
            headerName: "Join date",
            type: "date",
            width: 180,
            editable: true,
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key={id}
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem key={id} icon={<CancelIcon />} label="Cancel" className="textPrimary" onClick={handleCancelClick(id)} color="inherit" />,
                    ];
                }

                return [
                    <GridActionsCellItem key={id} icon={<EditIcon />} label="Edit" className="textPrimary" onClick={handleEditClick(id)} color="inherit" />,
                    <GridActionsCellItem key={id} icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} color="inherit" />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: 500,
                width: "100%",
                "& .actions": {
                    color: "text.secondary",
                },
                "& .textPrimary": {
                    color: "text.primary",
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
                slots={{
                    toolbar: EditToolbar,
                }}
            />
        </Box>
    );
}
