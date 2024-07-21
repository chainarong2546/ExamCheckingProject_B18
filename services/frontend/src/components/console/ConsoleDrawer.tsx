"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Drawer, Toolbar, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme, Divider, Typography, Fab, IconButton, Tooltip } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import TaskRoundedIcon from "@mui/icons-material/TaskRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;
const menus = [
    { title: "Home", icon: <HomeRoundedIcon />, url: "/console", tail: null },
    {
        title: "Group",
        icon: <FolderRoundedIcon />,
        url: "/console/group",
        tail: {
            icon: <AddRoundedIcon />,
            url: "/console/newGroup",
        },
    },
    {
        title: "Answer",
        icon: <TaskRoundedIcon />,
        url: "/console/answer",
        tail: {
            icon: <AddRoundedIcon />,
            url: "/console/newAnswer",
        },
    },
];

const menusFooter = [
    { title: "Profile", icon: <AccountCircleIcon />, url: "/profile", tail: null },
    {
        title: "Logout",
        icon: <LogoutIcon />,
        url: "/api/auth/signout",
        tail: null
    },
];

type Props = {
    open: boolean;
    setOpen?: (open: boolean) => void;
    actionButton?: {
        title: string;
        icon: React.ReactNode;
        action: () => void;
    };
};

export default function ConsoleDrawer({ open, setOpen, actionButton }: Props) {
    const router = useRouter();
    const theme = useTheme();
    const [variantDrower, setVariantDrower] = React.useState<"permanent" | "temporary">("temporary");

    React.useEffect(() => {
        const handleResize = () => {
            setVariantDrower(window.innerWidth >= theme.breakpoints.values.md ? "permanent" : "temporary");
        };

        if (typeof window !== "undefined") {
            handleResize();
            window.addEventListener("resize", handleResize);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        };
    }, [theme.breakpoints.values.md]);

    return (
        <Drawer
            variant={variantDrower}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
            open={open}
            onClose={() => setOpen?.(false)}
        >
            <Toolbar />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#888",
                        borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: "none",
                    },
                }}
            >
                <List sx={{ flexGrow: 1 }}>
                    {menus.map((menu) => (
                        <ListItem key={menu.title} disablePadding>
                            <ListItemButton onClick={() => router.push(menu.url)}>
                                <ListItemIcon>{menu.icon}</ListItemIcon>
                                <ListItemText primary={menu.title} />
                            </ListItemButton>
                            {menu.tail ? (
                                <IconButton
                                    size="large"
                                    sx={{
                                        "& > *": {
                                            opacity: "0.6",
                                        },
                                        "&::after": {
                                            content: '""',
                                            position: "absolute",
                                            height: "80%",
                                            display: "block",
                                            left: 0,
                                            width: "1px",
                                            bgcolor: "divider",
                                        },
                                    }}
                                    onClick={() => router.push(menu.tail.url)}
                                >
                                    {menu.tail.icon}
                                </IconButton>
                            ) : null}
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Divider />
            <Box>
                <List sx={{ flexGrow: 1 }}>
                    {menusFooter.map((menu) => (
                        <ListItem key={menu.title} disablePadding>
                            <ListItemButton onClick={() => router.push(menu.url)}>
                                <ListItemIcon>{menu.icon}</ListItemIcon>
                                <ListItemText primary={menu.title} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}
