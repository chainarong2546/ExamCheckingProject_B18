"use client";
import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Tooltip, Avatar, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SelectThemeButton from "../selectThemeButton";
import { useRouter } from "next/navigation";

type Props = {
    drowerToggle?: () => void;
};

export default function AdminAppBar({ drowerToggle }: Props) {
    const router = useRouter();
    
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{ gap: 1 }}>
                {drowerToggle != undefined ? (
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ display: { xs: "flex", md: "none" } }}
                        onClick={() => {
                            drowerToggle?.();
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                ) : null}
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Exam Checking
                </Typography>

                <SelectThemeButton />

                <Tooltip title="Profile">
                    <IconButton
                        onClick={() => {
                            router.push("/profile")
                        }}
                        sx={{ p: 0 }}
                    >
                        <Avatar alt="Remy Sharp" src="/testUserIcon.jpg" />
                    </IconButton>
                </Tooltip>

                {/* <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                </Menu> */}

            </Toolbar>
        </AppBar>
    );
}
