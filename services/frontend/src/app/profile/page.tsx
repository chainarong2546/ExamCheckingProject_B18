"use client";
import React from "react";
import { Box, Button, Divider, Grid, Paper, TextField, Toolbar, Typography } from "@mui/material";
import Image from "next/image";

type Props = {};

export default function ProfilePage({}: Props) {
    const [username, setUsername] = React.useState("");
    const [firstname, setFirstname] = React.useState("");
    const [lastname, setLastname] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [cpassword, setCpassword] = React.useState("");

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
                <Typography variant="h6">Profile</Typography>
            </Box>
            <Divider sx={{ m: 2 }} />
            <Box
                sx={{
                    p: 2,
                    overflow: "auto",
                }}
            >
                <Grid container spacing={3} sx={{ pb: 5 }}>
                    <Grid item xs={12} sm={4} sx={{display:"flex", flexDirection:"column", alignItems: "center", gap:1}}>
                        <Image src={"/testUserIcon.jpg"} width={200} height={200} alt="" style={{borderRadius: "50%", objectFit: "cover"}} priority/>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Grid container spacing={3} sx={{ pb: 5 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={username}
                                    required
                                    label="Username"
                                    variant="standard"
                                    inputProps={{
                                        maxLength: 100,
                                    }}
                                    fullWidth
                                    onChange={(event) => {
                                        setUsername(event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={email}
                                    required
                                    label="Email"
                                    variant="standard"
                                    inputProps={{
                                        maxLength: 100,
                                    }}
                                    fullWidth
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={firstname}
                                    required
                                    label="Firstname"
                                    variant="standard"
                                    inputProps={{
                                        maxLength: 100,
                                    }}
                                    fullWidth
                                    onChange={(event) => {
                                        setFirstname(event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={lastname}
                                    required
                                    label="Lastname"
                                    variant="standard"
                                    inputProps={{
                                        maxLength: 100,
                                    }}
                                    fullWidth
                                    onChange={(event) => {
                                        setLastname(event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={password}
                                    required
                                    label="Password"
                                    variant="standard"
                                    type="password"
                                    inputProps={{
                                        maxLength: 100,
                                    }}
                                    fullWidth
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={cpassword}
                                    required
                                    label="Confirm Password"
                                    variant="standard"
                                    type="password"
                                    fullWidth
                                    onChange={(event) => {
                                        setCpassword(event.target.value);
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button variant="contained" onClick={() => {}}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    );
}
