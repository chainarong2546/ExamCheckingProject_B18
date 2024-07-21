"use client"
import React from 'react'
import { Grid, Box, Typography, Divider } from '@mui/material'
import AdminUserData from '@/components/admin/AdminUserData'

type Props = {}

export default function AdminUserPage({}: Props) {
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
            <Typography variant="h6">User</Typography>
        </Box>
        <Divider sx={{ m: 2 }} />
        <Box
            sx={{
                p: 2,
                overflow: "auto",
            }}
        >
            <AdminUserData/>
        </Box>
    </Grid>
  )
}