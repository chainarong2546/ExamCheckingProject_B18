"use client";
import React from "react";
import {
  Grid,
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  Paper,
} from "@mui/material";

type Props = {};

export default function LoginPage({}: Props) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = () => {
    // ทำตรวจสอบการเข้าสู่ระบบ ในที่นี้เราให้แค่ console.log ข้อมูล
    console.log("Username:", username);
    console.log("Password:", password);
    // สามารถเพิ่มโค้ดเช็ครหัสผ่าน, เรียก API เพื่อตรวจสอบข้อมูล, หรือทำการ redirect ไปหน้าอื่น ๆ ต่อไปตามที่ต้องการ
  };

  return (
    <Grid container sx={{ justifyContent: "center" }}>
      <Grid item xs={12} sm={6} lg={4}>
        <Paper sx={{ my: 5, mx: 1, p: 2, borderRadius: 5 }}>
          <Typography align="center" variant="h4">
            Login
          </Typography>
          <Divider sx={{ m: 2 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <TextField
              label="Username"
              type="text"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" size="large" onClick={handleLogin}>
              Login
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
