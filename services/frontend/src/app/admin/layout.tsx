"use client";
import React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Grid, Paper } from "@mui/material";
import AdminAppBar from "@/components/admin/AdminAppBar";
import AdminDrawer from "@/components/admin/AdminDrawer";
import AddIcon from "@mui/icons-material/Add";

type Props = {
    children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
    const [openDrower, setOpenDrower] = React.useState(false);

    const drowerToggle = () => {
        setOpenDrower((prevState) => !prevState);
    };

    const drawerSetOpen = (open: boolean) => {
        setOpenDrower(() => open);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <AdminAppBar drowerToggle={drowerToggle} />
            <AdminDrawer
                open={openDrower}
                setOpen={drawerSetOpen}
                actionButton={{
                    title: "Add Group",
                    icon: <AddIcon />,
                    action: () => {}
                }}
            />
            <Grid
                container
                direction="column"
                wrap="nowrap"
                component="main"
                sx={{ height: "100vh" }}
            >
                <Toolbar />
                <Paper
                    elevation={2}
                    sx={{
                        flexGrow: 1,
                        borderRadius: 4,
                        m: 2,
                        overflow: "auto",
                    }}
                >
                    {children}
                </Paper>
            </Grid>
        </Box>
    );
}
