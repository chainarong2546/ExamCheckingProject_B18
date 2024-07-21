"use client";
import React from "react";
import {
    Button,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Paper,
    Typography,
} from "@mui/material";
import ContrastIcon from "@mui/icons-material/Contrast";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Done } from "@mui/icons-material";
import { useThemeContext } from "@/components/providers/MuiThemeContextProvider";

type Props = {};

export default function SelectThemeButton() {
    const { selectColorMode, localMode } = useThemeContext();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                startIcon={
                    localMode === "light" ? (
                        <LightModeIcon />
                    ) : localMode === "dark" ? (
                        <DarkModeIcon />
                    ) : (
                        <ContrastIcon />
                    )
                }
                variant="text"
                color="inherit"
            >
                {/* {localMode} */}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <Paper sx={{ width: 200, background: "none" }} elevation={0}>
                    <MenuList>
                        <MenuItem
                            onClick={() => {
                                handleClose();
                                selectColorMode("light");
                            }}
                        >
                            <ListItemIcon>
                                <LightModeIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Light</ListItemText>
                            {localMode === "light" ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    <Done />
                                </Typography>
                            ) : undefined}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleClose();
                                selectColorMode("dark");
                            }}
                        >
                            <ListItemIcon>
                                <DarkModeIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Dark</ListItemText>
                            {localMode === "dark" ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    <Done />
                                </Typography>
                            ) : undefined}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleClose();
                                selectColorMode("auto");
                            }}
                        >
                            <ListItemIcon>
                                <ContrastIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Auto</ListItemText>
                            {localMode === "auto" ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    <Done />
                                </Typography>
                            ) : undefined}
                        </MenuItem>
                    </MenuList>
                </Paper>
            </Menu>
        </>
    );
}
